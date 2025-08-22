import { API_BASE_URL, apiFetch } from './config';

export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
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