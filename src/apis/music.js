import { API_BASE_URL, getHeaders, apiFetch } from './config';

// 음악 목록 조회
export const getMusicList = async () => {
  const response = await apiFetch(`${API_BASE_URL}/music/list`);

  if (!response.ok) {
    throw new Error('Failed to get music list');
  }

  return response.json();
};

// 음악 검색 (기존)
export const searchMusic = async (keyword) => {
  const response = await apiFetch(`${API_BASE_URL}/music/search?keyword=${encodeURIComponent(keyword)}`);

  if (!response.ok) {
    throw new Error('Failed to search music');
  }

  return response.json();
};

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

// 음악 파일 업로드
export const uploadMusic = async (files, creator = null) => {
  const formData = new FormData();
  
  // 파일들을 FormData에 추가
  files.forEach(file => {
    formData.append('files', file.file);
  });
  
  // 만든 사람 정보가 있으면 추가
  if (creator) {
    formData.append('creator', creator);
  }

  // FormData를 사용할 때는 Content-Type을 자동으로 설정하도록 헤더에서 제거
  const headers = getHeaders();
  delete headers['Content-Type'];

  const response = await fetch(`${API_BASE_URL}/api/musics`, {
    method: 'POST',
    headers,
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