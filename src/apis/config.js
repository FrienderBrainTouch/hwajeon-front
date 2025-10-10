// 토큰 재발급 함수 import
import { refreshAccessToken } from './auth';

// 환경별 API 주소 설정
const getApiBaseUrl = () => {
  // 개발 환경에서도 환경 변수 사용
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
  }

  // 배포 환경 (npm run build) - 환경 변수 또는 기본값 사용
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_BASE_URL || 'https://api.hwajeon.store';
  }

  // 기본값
  return 'http://localhost:8080';
};

export const API_BASE_URL = getApiBaseUrl();

// 프로덕션 환경에서 콘솔 로그 비활성화
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

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

// API 응답 처리 및 토큰 만료 감지
export const handleApiResponse = async (response, expiredToken) => {
  if (response.status === 401) {
    console.log('401 에러 감지. 토큰 재발급을 시도합니다.');

    // 자동 로그인이 활성화되어 있는 경우 토큰 재발급 시도
    const autoLoginEnabled = localStorage.getItem('autoLogin') === 'true';
    if (autoLoginEnabled) {
      try {
        console.log('자동 로그인 활성화됨. refreshAccessToken 호출...');
        const newTokenData = await refreshAccessToken(expiredToken); // 만료된 토큰 전달
        if (newTokenData.accessToken) {
          console.log('토큰 재발급 성공');
          localStorage.setItem('accessToken', newTokenData.accessToken);
          return { isTokenExpired: false, response, newToken: newTokenData.accessToken };
        }
      } catch (reissueError) {
        console.log('토큰 재발급 실패:', reissueError);
      }
    } else {
      console.log('자동 로그인 비활성화됨');
    }

    console.log('토큰 재발급 실패 또는 자동 로그인 비활성화. 자동 로그아웃을 실행합니다.');
    if (onTokenExpired) {
      onTokenExpired();
    }
    return { isTokenExpired: true, response };
  }
  return { isTokenExpired: false, response };
};

// 공통 fetch 함수 (토큰 만료 감지 포함)
export const apiFetch = async (url, options = {}) => {
  console.log('apiFetch 시작:', url);
  console.log('apiFetch 옵션:', options);
  const currentToken = localStorage.getItem('accessToken');
  console.log('현재 토큰:', currentToken);

  const response = await fetch(url, {
    ...options,
    headers: getHeaders(),
    credentials: 'include', // HttpOnly 쿠키 포함
  });

  console.log('apiFetch 응답:', response.status, response.statusText);

  const { isTokenExpired, newToken } = await handleApiResponse(response, currentToken);

  if (isTokenExpired) {
    console.log('토큰 만료 감지됨');
    throw new Error('TOKEN_EXPIRED');
  }

  // 토큰이 재발급된 경우 원래 요청을 새 토큰으로 재시도
  if (newToken && response.status === 401) {
    console.log('새 토큰으로 원래 요청 재시도');
    const retryResponse = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`, // 새로 발급받은 토큰 사용
      },
      credentials: 'include', // HttpOnly 쿠키 포함
    });
    return retryResponse;
  }

  return response;
};
