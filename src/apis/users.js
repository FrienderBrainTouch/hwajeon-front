import { API_BASE_URL, apiFetch } from './config';

// 모든 사용자 목록 조회
export const getAllUsers = async () => {
  const response = await apiFetch(`${API_BASE_URL}/api/users/all`);
  
  if (!response.ok) {
    throw new Error('사용자 목록을 가져오는데 실패했습니다.');
  }
  
  return response.json();
};

// 사용자 정보 조회
export const getUserById = async (userId) => {
  const response = await apiFetch(`${API_BASE_URL}/api/users/${userId}`);
  
  if (!response.ok) {
    throw new Error('사용자 정보를 가져오는데 실패했습니다.');
  }
  
  return response.json();
};

// 사용자 권한 변경
export const updateUserRole = async (userId, newRole) => {
  const response = await apiFetch(`${API_BASE_URL}/api/users/${userId}/role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: newRole }),
  });
  
  if (!response.ok) {
    throw new Error('사용자 권한 변경에 실패했습니다.');
  }
  
  return response.json();
};

// 사용자 상태 변경 (활성/비활성)
export const updateUserStatus = async (userId, newStatus) => {
  const response = await apiFetch(`${API_BASE_URL}/api/users/${userId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: newStatus }),
  });
  
  if (!response.ok) {
    throw new Error('사용자 상태 변경에 실패했습니다.');
  }
  
  return response.json();
};

// 사용자 삭제
export const deleteUser = async (userId) => {
  const response = await apiFetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('사용자 삭제에 실패했습니다.');
  }
  
  return response.json();
};

// 사용자 이름 변경
export const updateUserName = async (userId, newName) => {
  const response = await apiFetch(`${API_BASE_URL}/api/users/names/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newName }),
  });
  
  if (!response.ok) {
    throw new Error('사용자 이름 변경에 실패했습니다.');
  }
  
  // 응답 본문이 비어있을 수 있으므로 안전하게 처리
  try {
    const responseText = await response.text();
    if (responseText.trim()) {
      return JSON.parse(responseText);
    }
    return { success: true, message: '이름이 성공적으로 변경되었습니다.' };
  } catch (error) {
    // JSON 파싱 실패 시에도 성공으로 처리 (200 OK이므로)
    return { success: true, message: '이름이 성공적으로 변경되었습니다.' };
  }
};
