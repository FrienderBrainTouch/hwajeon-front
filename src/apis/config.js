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
export const handleApiResponse = async (response) => {
  if (response.status === 401) {
    try {
      const errorData = await response.json();
      if (errorData.error === 'token_expired' || errorData.message === 'token_expired') {
        console.log('토큰이 만료되었습니다. 자동 로그아웃을 실행합니다.');
        if (onTokenExpired) {
          onTokenExpired();
        }
        return { isTokenExpired: true, response };
      }
    } catch (error) {
      console.error('에러 응답 파싱 실패:', error);
    }
  }
  return { isTokenExpired: false, response };
};

// 공통 fetch 함수 (토큰 만료 감지 포함)
export const apiFetch = async (url, options = {}) => {
  console.log('apiFetch 시작:', url);
  console.log('apiFetch 옵션:', options);
  console.log('현재 토큰:', localStorage.getItem('accessToken'));

  const response = await fetch(url, {
    ...options,
    headers: getHeaders(),
  });

  console.log('apiFetch 응답:', response.status, response.statusText);

  const { isTokenExpired } = await handleApiResponse(response);

  if (isTokenExpired) {
    console.log('토큰 만료 감지됨');
    throw new Error('TOKEN_EXPIRED');
  }

  return response;
};
