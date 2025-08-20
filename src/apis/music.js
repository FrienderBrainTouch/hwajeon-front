import { API_BASE_URL, getHeaders, apiFetch } from './config';

// 새로운 검색 API
export const searchMusicByKeywords = async (keywords) => {
  const response = await apiFetch(`${API_BASE_URL}/api/matches?keywords=${encodeURIComponent(keywords)}`);

  if (!response.ok) {
    throw new Error('Failed to search music by keywords');
  }

  return response.json();
};

// 플레이리스트 조회
export const getPlaylist = async () => {
  const response = await apiFetch(`${API_BASE_URL}/music/playlist`);

  if (!response.ok) {
    throw new Error('Failed to get playlist');
  }

  return response.json();
};

// 좋아요 토글
export const toggleLike = async (musicId) => {
  const response = await apiFetch(`${API_BASE_URL}/api/plays/music/${musicId}/like`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to toggle like');
  }

  return response.json();
};

// 음악 파일 업로드 (TEACHER 권한용)
export const uploadMusic = async (files, userId = null) => {
  const formData = new FormData();
  
  // 파일들을 FormData에 추가
  files.forEach(file => {
    formData.append('files', file.file);
  });
  
  // TEACHER 권한일 때 userId가 있으면 해당 사용자로 업로드
  if (userId) {
    formData.append('userId', userId);
  }

  // FormData를 사용할 때는 Content-Type을 자동으로 설정하도록 헤더에서 제거
  // 하지만 Authorization 토큰은 유지해야 함
  const headers = getHeaders();
  delete headers['Content-Type'];

  // TEACHER 권한일 때는 api/musics/{userId} 엔드포인트 사용
  // 일반 유저일 때는 api/musics 엔드포인트 사용 (토큰에서 사용자 정보 추출)
  const uploadUrl = userId 
    ? `${API_BASE_URL}/api/musics/${userId}`
    : `${API_BASE_URL}/api/musics`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers, // Authorization 토큰 포함
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload music');
  }

  return response.json();
};

// 나의 음악 리스트 조회
export const getMyMusic = async () => {
  const response = await apiFetch(`${API_BASE_URL}/api/plays/me/playlists`);

  if (!response.ok) {
    throw new Error('Failed to get my music');
  }

  return response.json();
};

// 음악 재생 URL 가져오기
export const getMusicPlayUrl = async (musicId) => {
  console.log('=== getMusicPlayUrl API 호출 ===');
  console.log('요청 URL:', `${API_BASE_URL}/api/musics/${musicId}`);
  console.log('요청 헤더:', getHeaders());
  
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/musics/${musicId}`);
    
    console.log('API 응답 상태:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('API 응답 에러:', response.status, response.statusText);
      throw new Error(`Failed to get music play URL: ${response.status} ${response.statusText}`);
    }
    
    // API 응답: { musicId, title, playbackUrl }
    const data = await response.json();
    console.log('API 응답 데이터 (musicId, title, playbackUrl):', data);
    return data;
  } catch (error) {
    if (error.message === 'TOKEN_EXPIRED') {
      throw error; // 토큰 만료 에러는 상위로 전파
    }
    console.error('getMusicPlayUrl 에러:', error);
    throw error;
  }
};

// 최근 추가된 음악 조회
export const getRecentMusic = async () => {
  const response = await apiFetch(`${API_BASE_URL}/api/plays/me/music`);

  if (!response.ok) {
    throw new Error('Failed to get recent music');
  }

  return response.json();
};

// 좋아요한 음악 조회
export const getLikedMusic = async () => {
  const response = await apiFetch(`${API_BASE_URL}/api/plays/me/likes`);

  if (!response.ok) {
    throw new Error('Failed to get liked music');
  }

  return response.json();
};

// 특정 음악의 좋아요 상태 확인
export const checkMusicLikeStatus = async (musicId) => {
  const response = await apiFetch(`${API_BASE_URL}/api/plays/music/${musicId}/like-status`);

  if (!response.ok) {
    throw new Error('Failed to check like status');
  }

  return response.json();
};

// 음악 재생 시 재생목록에 추가
export const addToPlayHistory = async (musicId) => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/history/me/${musicId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to add to play history');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to add to play history:', error);
    // 재생목록 추가 실패해도 음악 재생은 계속되도록 에러를 던지지 않음
    return null;
  }
};

// 재생 이력 조회 (페이징)
export const getPlayHistory = async (page = 0, size = 5) => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/history/me?page=${page}&size=${size}`);

    if (!response.ok) {
      throw new Error('Failed to get play history');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to get play history:', error);
    throw error;
  }
};

// 사용자 목록 조회 (TEACHER 권한만)
export const getAllUsers = async () => {
  const response = await apiFetch(`${API_BASE_URL}/api/users/all`);

  if (!response.ok) {
    throw new Error('Failed to get users list');
  }

  return response.json();
};

// 음악 파일 목록 조회 (TEACHER 권한만) - Pageable 적용
export const getAllMusicFiles = async (page = 0, size = 10) => {
  const response = await apiFetch(`${API_BASE_URL}/api/matches/manage?page=${page}&size=${size}`);

  if (!response.ok) {
    throw new Error('Failed to get music files list');
  }

  return response.json();
};

// 음악 파일 삭제 (TEACHER 권한만)
export const deleteMusicFile = async (musicId) => {
  const response = await apiFetch(`${API_BASE_URL}/api/musics/${musicId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete music file');
  }

  // 응답 본문이 비어있을 수 있으므로 안전하게 처리
  try {
    const responseText = await response.text();
    if (responseText.trim()) {
      return JSON.parse(responseText);
    }
    return { success: true, message: '음악 파일이 성공적으로 삭제되었습니다.' };
  } catch (error) {
    return { success: true, message: '음악 파일이 성공적으로 삭제되었습니다.' };
  }
};

// 음악 제목 수정 (TEACHER 권한만)
export const updateMusicTitle = async (musicId, newTitle) => {
  const response = await apiFetch(`${API_BASE_URL}/api/musics/${musicId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newName: newTitle }),
  });

  if (!response.ok) {
    throw new Error('Failed to update music title');
  }

  // 응답 본문이 비어있을 수 있으므로 안전하게 처리
  try {
    const responseText = await response.text();
    if (responseText.trim()) {
      return JSON.parse(responseText);
    }
    return { success: true, message: '제목이 성공적으로 변경되었습니다.' };
  } catch (error) {
    return { success: true, message: '제목이 성공적으로 변경되었습니다.' };
  }
};