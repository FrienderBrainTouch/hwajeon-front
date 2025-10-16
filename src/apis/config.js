// 환경별 API 주소 설정
const getApiBaseUrl = () => {
  // 개발 환경 (npm start) - 로컬 백엔드 사용
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8080';
  }
  
  // 프로덕션 환경 (npm run build) - 환경 변수 사용
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_BASE_URL || 'https://api.100youth.kr';
  }
  
  // 기본값
  return 'https://api.100youth.kr';
};

export const API_BASE_URL = getApiBaseUrl();

// 환경별 로그
console.log(`🌍 ${process.env.NODE_ENV === 'production' ? '배포' : '개발'} 환경`);
console.log(`🔗 API URL: ${API_BASE_URL}`);

// 토큰 만료 시 자동 로그아웃을 위한 콜백 함수
let onTokenExpired = null;

// 토큰 만료 콜백 설정 함수
export const setTokenExpiredCallback = (callback) => {
  onTokenExpired = callback;
};

// API 요청에 사용할 기본 헤더
export const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// 토큰 재발급 진행 중 여부 플래그
let isRefreshing = false;
let refreshSubscribers = [];

// 토큰 재발급 후 대기 중인 요청들을 처리
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// API 응답 처리 및 토큰 만료 감지
export const handleApiResponse = async (response) => {
  if (response.status === 401) {
    try {
      const responseText = await response.text();
      if (responseText.trim()) {
        const errorData = JSON.parse(responseText);
        if (errorData.error === 'token_expired' || errorData.message === 'token_expired') {
          console.log('토큰이 만료되었습니다. 토큰 재발급을 시도합니다.');
          return { isTokenExpired: true, shouldRefresh: true, response };
        }
      }
    } catch (error) {
      console.error('에러 응답 파싱 실패:', error);
    }
  }
  return { isTokenExpired: false, shouldRefresh: false, response };
};

// Access Token 재발급 함수
export const refreshTokenAndRetry = async () => {
  if (isRefreshing) {
    // 이미 재발급 중이면 대기
    return new Promise((resolve) => {
      subscribeTokenRefresh((newToken) => {
        resolve(newToken);
      });
    });
  }

  isRefreshing = true;

  try {
    // refreshAccessToken을 동적으로 import (순환 참조 방지)
    const { refreshAccessToken } = await import('./auth');
    const { accessToken } = await refreshAccessToken();
    
    // 새 토큰 저장
    localStorage.setItem('accessToken', accessToken);
    
    // 대기 중인 요청들에게 새 토큰 전달
    onTokenRefreshed(accessToken);
    
    isRefreshing = false;
    return accessToken;
  } catch (error) {
    console.error('토큰 재발급 실패:', error);
    isRefreshing = false;
    refreshSubscribers = [];
    
    // 재발급 실패 시 로그아웃 처리
    if (onTokenExpired) {
      onTokenExpired();
    }
    throw error;
  }
};

// 공통 fetch 함수 (토큰 만료 감지 및 자동 재발급 포함)
export const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: getHeaders(),
    credentials: 'include', // HttpOnly 쿠키를 자동으로 포함
  });
  
  const { isTokenExpired, shouldRefresh } = await handleApiResponse(response);
  
  if (isTokenExpired && shouldRefresh) {
    console.log('토큰 만료 감지됨 - 재발급 시도');
    
    try {
      // 토큰 재발급
      const newToken = await refreshTokenAndRetry();
      
      console.log('토큰 재발급 성공 - 요청 재시도');
      
      // 새 토큰으로 요청 재시도
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
        },
        credentials: 'include',
      });
      
      return retryResponse;
    } catch (error) {
      console.error('토큰 재발급 실패 - 로그아웃 처리');
      throw new Error('TOKEN_EXPIRED');
    }
  }
  
  return response;
};