import { API_BASE_URL, apiFetch } from './config';

export const login = async (username, password) => {
  console.log('=== login 함수 시작 ===');
  console.log('로그인 요청:', { username });
  console.log('로그인 전 쿠키:', document.cookie);

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include', // 쿠키 포함
  });

  console.log('로그인 API 응답 상태:', response.status, response.statusText);
  console.log('로그인 응답 헤더:');
  response.headers.forEach((value, key) => {
    console.log(`  ${key}: ${value}`);
  });

  if (!response.ok) {
    console.error('로그인 API 실패:', response.status, response.statusText);
    throw new Error('Login failed');
  }

  const result = await response.json();
  console.log('로그인 API 성공, 응답:', result);
  console.log('로그인 후 쿠키:', document.cookie);
  console.log('=== login 함수 완료 ===');

  return result;
};

export const signup = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Signup failed');
  }

  return response.json();
};

export const checkDuplicateId = async (loginId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/duplicate?loginId=${loginId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { available: response.status === 200 };
  } catch (error) {
    return { available: false };
  }
};

export const logout = async () => {
  console.log('auth.js logout 함수 시작');
  console.log('API URL:', `${API_BASE_URL}/api/auth/logout`);

  const response = await apiFetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
  });

  console.log('logout API 응답:', response);

  if (!response.ok) {
    console.error('logout API 실패:', response.status, response.statusText);
    throw new Error('Logout failed');
  }

  console.log('logout API 성공');
  return response.json();
};

// Access Token 재발급 (Refresh Token은 HttpOnly 쿠키에서 자동으로 전송됨)
export const refreshAccessToken = async () => {
  console.log('=== refreshAccessToken 함수 시작 ===');
  console.log('API URL:', `${API_BASE_URL}/api/auth/reissue`);

  const response = await fetch(`${API_BASE_URL}/api/auth/reissue`, {
    method: 'POST',
    credentials: 'include', // HttpOnly 쿠키의 refresh_token 자동 전송
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('reissue API 응답 상태:', response.status, response.statusText);

  if (!response.ok) {
    console.error('reissue API 실패:', response.status, response.statusText);
    throw new Error('Token reissue failed');
  }

  const result = await response.json(); // { accessToken: "새로운 액세스 토큰" }
  console.log('reissue API 성공, 응답:', result);
  return result;
};

export const changePassword = async (oldPassword, newPassword, confirmPassword) => {
  const response = await apiFetch(`${API_BASE_URL}/api/users/passwords`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      oldPassword,
      newPassword,
      confirmPassword,
    }),
  });

  if (!response.ok) {
    throw new Error('Password change failed');
  }

  return response.json();
};
