import React, { createContext, useState, useContext, useRef, useEffect, useCallback } from 'react';
import { getMusicPlayUrl, addToPlayHistory, getPlayHistory } from '../apis/music';
import { assignRandomImagesToMusicList } from '../utils/imageUtils';
import { useAuth } from './AuthContext';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState([]); // 백엔드 재생 이력 기반 재생목록
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1); // 현재 재생 중인 곡의 인덱스
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(false);
  const audioRef = useRef(new Audio());

  // 백엔드 재생 이력을 가져와서 재생목록으로 설정
  const loadPlaylistFromBackend = useCallback(async () => {
    if (!isAuthenticated) {
      console.warn('인증되지 않은 사용자는 재생 이력을 불러올 수 없습니다.');
      setPlaylist([]);
      setCurrentTrackIndex(-1);
      return;
    }

    try {
      setIsPlaylistLoading(true);
      const response = await getPlayHistory(0, 50); // 최근 50개 재생 이력
      console.log('백엔드 재생 이력 API 응답:', response);
      
      // Spring Boot Pageable 응답 구조에 맞게 content에서 데이터 추출
      const data = response.content || response.data || response;
      console.log('추출된 재생 이력 데이터:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        // 이미지가 비어있는 경우 일관된 랜덤 이미지 할당
        const musicWithImages = assignRandomImagesToMusicList(data);
        console.log('이미지 할당 후 음악 데이터:', musicWithImages);
        
        // 백엔드 데이터를 프론트엔드 형식으로 변환
        const formattedPlaylist = musicWithImages.map(item => ({
          id: item.musicId || item.id,
          title: item.title,
          artist: item.owner,
          coverUrl: item.imageUrl,
          audioUrl: item.playbackUrl
        }));
        
        setPlaylist(formattedPlaylist);
        console.log('백엔드 재생 이력으로 재생목록 설정 완료:', formattedPlaylist);
        
        // 현재 재생 중인 곡이 재생목록에 있는지 확인하고 인덱스 설정
        if (currentTrack) {
          const currentIndex = formattedPlaylist.findIndex(item => item.id === currentTrack.id);
          if (currentIndex !== -1) {
            setCurrentTrackIndex(currentIndex);
            console.log('현재 재생 중인 곡 인덱스 설정:', currentIndex);
          }
        }
      } else {
        setPlaylist([]);
        setCurrentTrackIndex(-1);
        console.log('재생 이력이 없습니다.');
      }
    } catch (error) {
      console.error('백엔드 재생 이력 로드 실패:', error);
      // 에러 시 기존 재생목록 유지
    } finally {
      setIsPlaylistLoading(false);
    }
  }, [currentTrack, isAuthenticated]);

  // 컴포넌트 마운트 시 백엔드 재생 이력 로드 (인증된 경우에만)
  useEffect(() => {
    if (isAuthenticated) {
      loadPlaylistFromBackend();
    } else {
      // 인증되지 않은 경우 재생목록 초기화
      setPlaylist([]);
      setCurrentTrackIndex(-1);
    }
  }, [loadPlaylistFromBackend, isAuthenticated]);

  // 재생목록에 곡 추가 (기존 로직 유지)
  const addToPlaylist = (track) => {
    setPlaylist(prevPlaylist => {
      // 이미 존재하는지 확인
      const existingIndex = prevPlaylist.findIndex(item => item.id === track.id);
      if (existingIndex !== -1) {
        // 이미 존재하면 제거하고 맨 뒤에 추가 (최신 재생 순서)
        const newPlaylist = prevPlaylist.filter(item => item.id !== track.id);
        const finalPlaylist = [...newPlaylist, track];
        // 인덱스 업데이트
        setCurrentTrackIndex(finalPlaylist.length - 1);
        return finalPlaylist;
      }
      // 새로운 곡이면 맨 뒤에 추가
      const finalPlaylist = [...prevPlaylist, track];
      // 인덱스 업데이트
      setCurrentTrackIndex(finalPlaylist.length - 1);
      return finalPlaylist;
    });
  };

  // 이전 곡으로 이동 (백엔드 재생 이력 기반)
  const playPreviousTrack = () => {
    if (playlist.length === 0) return;
    
    let prevIndex;
    if (currentTrackIndex <= 0) {
      // 현재 곡이 첫 번째이거나 인덱스가 설정되지 않은 경우, 맨 마지막 곡으로
      prevIndex = playlist.length - 1;
    } else {
      prevIndex = currentTrackIndex - 1;
    }
    
    const prevTrack = playlist[prevIndex];
    if (prevTrack) {
      console.log('이전 곡 재생:', prevTrack.title, '인덱스:', prevIndex);
      playTrack(prevTrack);
    }
  };

  // 다음 곡으로 이동 (백엔드 재생 이력 기반)
  const playNextTrack = () => {
    if (playlist.length === 0) return;
    
    let nextIndex;
    if (currentTrackIndex >= playlist.length - 1) {
      // 현재 곡이 마지막인 경우, 첫 번째 곡으로
      nextIndex = 0;
    } else {
      nextIndex = currentTrackIndex + 1;
    }
    
    const nextTrack = playlist[nextIndex];
    if (nextTrack) {
      console.log('다음 곡 재생:', nextTrack.title, '인덱스:', nextIndex);
      playTrack(nextTrack);
    }
  };

  // 재생목록이 비어있는지 확인
  const hasPreviousTrack = () => {
    return playlist.length > 0;
  };

  const hasNextTrack = () => {
    return playlist.length > 0;
  };

  const playTrack = async (track) => {
    if (!isAuthenticated) {
      alert('인증되지 않은 사용자는 음악을 재생할 수 없습니다.');
      return;
    }

    try {
      console.log('=== MusicContext playTrack 시작 ===');
      console.log('받은 track 정보:', track);
      setIsLoading(true);
      
      if (currentTrack?.id === track.id) {
        console.log('같은 곡 재생/일시정지 토글');
        // 같은 곡이면 재생/일시정지 토글
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
          
          // 재생 시작 시 재생목록에 추가 (기존 로직 유지)
          try {
            await addToPlayHistory(track.id);
            console.log('재생목록에 추가 완료');
            // 백엔드 재생 이력 업데이트 후 재생목록 새로고침
            await loadPlaylistFromBackend();
          } catch (error) {
            console.error('재생목록 추가 실패:', error);
          }
        }
      } else {
        console.log('새로운 곡 재생 시작');
        // 새로운 곡이면 재생 URL을 가져와서 재생
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        // track에 audioUrl이 있으면 사용, 없으면 API 호출
        let audioUrl = track.audioUrl;
        console.log('기존 audioUrl:', audioUrl);
        
        if (!audioUrl) {
          console.log('audioUrl이 없어서 API 호출 시작');
          console.log('API 호출할 musicId:', track.id);
          
          // 음악 재생 URL 가져오기
          const response = await getMusicPlayUrl(track.id);
          console.log('getMusicPlayUrl API 응답:', response);
          
          // API 응답에서 재생 URL 추출 (playbackUrl 필드 사용)
          if (typeof response === 'string') {
            // 응답이 직접 URL 문자열인 경우
            audioUrl = response;
            console.log('문자열 응답으로 audioUrl 설정:', audioUrl);
          } else if (response && typeof response === 'object') {
            // API 응답 구조: musicId, title, playbackUrl
            audioUrl = response.playbackUrl;
            console.log('객체 응답에서 playbackUrl 추출:', audioUrl);
          }
          
          if (!audioUrl) {
            console.error('재생 URL을 찾을 수 없습니다. API 응답:', response);
            throw new Error('재생 URL을 찾을 수 없습니다.');
          }
        }
        
        console.log('최종 재생 URL:', audioUrl);
        
        // 트랙 정보 업데이트
        const trackWithAudio = {
          ...track,
          audioUrl: audioUrl
        };
        
        console.log('재생할 트랙 정보:', trackWithAudio);
        setCurrentTrack(trackWithAudio);
        
        // 재생목록에 추가하고 인덱스 업데이트 (기존 로직 유지)
        addToPlaylist(trackWithAudio);
        
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
        setIsPlaying(true);
        
        // 새로운 곡 재생 시작 시 재생목록에 추가 (기존 로직 유지)
        try {
          await addToPlayHistory(track.id);
          console.log('재생목록에 추가 완료');
          // 백엔드 재생 이력 업데이트 후 재생목록 새로고침
          await loadPlaylistFromBackend();
        } catch (error) {
          console.error('재생목록 추가 실패:', error);
        }
        
        console.log('음악 재생 성공!');
      }
    } catch (error) {
      console.error('음악 재생 실패:', error);
      alert('음악 재생에 실패했습니다: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = async () => {
    if (!currentTrack) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('재생/일시정지 실패:', error);
    }
  };

  const pauseTrack = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const stopTrack = () => {
    audioRef.current?.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  // 재생목록 새로고침 함수 (외부에서 호출 가능)
  const refreshPlaylist = async () => {
    await loadPlaylistFromBackend();
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoading,
        playlist,
        currentTrackIndex,
        isPlaylistLoading,
        hasPreviousTrack: hasPreviousTrack(),
        hasNextTrack: hasNextTrack(),
        playTrack,
        togglePlay,
        pauseTrack,
        stopTrack,
        playPreviousTrack,
        playNextTrack,
        refreshPlaylist,
        audioRef
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicProvider');
  }
  return context;
};