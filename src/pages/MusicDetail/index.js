import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useMusicPlayer } from '../../context/MusicContext';
import { toggleLike, checkMusicLikeStatus } from '../../apis/music';


const Container = styled.div`
  width: 100%;
  min-width: var(--min-viewport-width);
  max-width: var(--max-viewport-width);
  min-height: 100vh;
  margin: 0 auto;
  background-color: var(--color-background);
`;

const Header = styled.header`
  width: 100%;
  height: 60px;
  background-color: var(--color-background);
  border-bottom: 1px solid #f1f1f1;
  z-index: 100;
  padding: 0 var(--spacing-medium);
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
`;

const BackButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  background-image: url('/icons/arrow.svg');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  transform: rotate(-90deg);
`;

const Content = styled.div`
  padding: var(--spacing-medium);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CoverImage = styled.div`
  width: 100%;
  max-width: 320px;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: var(--spacing-large);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;



const MusicInfo = styled.div`
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-title);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-small) 0;
`;

const Artist = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-subtitle);
  color: var(--color-text-secondary);
  margin: 0;
`;

const ProgressContainer = styled.div`
  width: 100%;
  max-width: 320px;
  margin: var(--spacing-large) 0;
`;

const ProgressBar = styled.input`
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: #E9E9E9;
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  /* 진행된 부분을 검은색으로 표시 */
  background: linear-gradient(to right, #000 0%, #000 ${props => (props.value / props.max) * 100}%, #E9E9E9 ${props => (props.value / props.max) * 100}%, #E9E9E9 100%);

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #007AFF;
    cursor: pointer;
    border: none;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #007AFF;
    cursor: pointer;
    border: none;
  }

  &::-moz-range-track {
    height: 4px;
    border-radius: 2px;
    background: #E9E9E9;
  }
`;

const TimeInfo = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  justify-content: space-between;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-small);
`;

const Controls = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-large);
`;

const MainControls = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
`;

const PlayButton = styled.button`
  width: 48px;
  height: 48px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  background-image: url('/icons/play.svg');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  
  &[data-playing="true"] {
    background-image: url('/icons/pause.svg');
  }
`;

const ControlButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`;

const MainControlButton = styled(ControlButton)`
  width: 48px;
  height: 48px;
`;

const PlaylistButton = styled(ControlButton)`
  background-image: url('/icons/playlist.svg');
`;

const LikeButton = styled(ControlButton)`
  background-image: ${props => props.isLiked 
    ? "url('data:image/svg+xml;utf8,<svg width=\"59\" height=\"59\" viewBox=\"0 0 59 59\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M19.0521 8.60417C12.6039 8.60417 7.375 14.16 7.375 21.0114C7.375 34.724 29.5 50.3958 29.5 50.3958C29.5 50.3958 51.625 34.724 51.625 21.0114C51.625 12.5228 46.3961 8.60417 39.9479 8.60417C35.3754 8.60417 31.4175 11.3968 29.5 15.4629C27.5825 11.3968 23.6246 8.60417 19.0521 8.60417Z\" fill=\"%23ff4757\" stroke=\"%23ff4757\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>')"
    : "url('/icons/music_like_button.svg')"
  };
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const PrevButton = styled(MainControlButton)`
  background-image: url('/icons/music_controll_button.svg');
  transform: rotate(180deg);
`;

const NextButton = styled(MainControlButton)`
  background-image: url('/icons/music_controll_button.svg');
`;

function formatTime(seconds) {
  // NaN이나 유효하지 않은 값 처리
  if (!seconds || isNaN(seconds) || seconds < 0) {
    return '0:00';
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function MusicDetailPage() {
  const navigate = useNavigate();
  const { 
    currentTrack, 
    isPlaying, 
    isLoading, 
    playTrack, 
    pauseTrack, 
    audioRef,
    hasPreviousTrack,
    hasNextTrack,
    playPreviousTrack,
    playNextTrack
  } = useMusicPlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isLikeStatusLoaded, setIsLikeStatusLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    
    // audioRef가 유효하지 않으면 리턴
    if (!audio) {
      console.log('audioRef가 유효하지 않습니다.');
      return;
    }

    console.log('audioRef 설정됨:', audio);
    console.log('현재 audio 상태:', {
      currentTime: audio.currentTime,
      duration: audio.duration,
      readyState: audio.readyState,
      src: audio.src
    });

    const handleTimeUpdate = () => {
      if (audio && !isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
        console.log('시간 업데이트:', audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio && !isNaN(audio.duration)) {
        setDuration(audio.duration);
        console.log('메타데이터 로드됨, duration:', audio.duration);
      }
    };

    const handleCanPlay = () => {
      if (audio && !isNaN(audio.duration)) {
        setDuration(audio.duration);
        console.log('재생 가능, duration:', audio.duration);
      }
    };

    const handleEnded = () => {
      console.log('음악 재생이 끝났습니다.');
      setCurrentTime(0);
    };

    // 초기값 설정
    if (!isNaN(audio.currentTime)) {
      setCurrentTime(audio.currentTime);
    }
    if (!isNaN(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    }

    // 이벤트 리스너 등록
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, currentTrack]); // currentTrack이 변경될 때도 다시 설정

  // currentTrack이 변경될 때마다 좋아요 상태 확인
  useEffect(() => {
    let isMounted = true;
    
    const checkLikeStatus = async () => {
      if (!currentTrack) {
        setIsLiked(false);
        setIsLikeStatusLoaded(false);
        return;
      }
      
      try {
        setIsLikeLoading(true);
        const response = await checkMusicLikeStatus(currentTrack.id);
        
        // 컴포넌트가 언마운트되었으면 상태 업데이트하지 않음
        if (!isMounted) return;
        
        console.log('좋아요 상태 API 응답:', response);
        
        // API 응답 구조에 따라 다르게 처리
        let likeStatus = false;
        
        if (response && typeof response === 'object') {
          // 다양한 필드명에 대응
          if (response.hasOwnProperty('isLiked')) {
            likeStatus = Boolean(response.isLiked);
          } else if (response.hasOwnProperty('liked')) {
            likeStatus = Boolean(response.liked);
          } else if (response.hasOwnProperty('status')) {
            likeStatus = Boolean(response.status);
          } else if (response.hasOwnProperty('likeStatus')) {
            likeStatus = Boolean(response.likeStatus);
          } else {
            // 응답 자체가 boolean 값일 수도 있음
            likeStatus = Boolean(response);
          }
        } else if (typeof response === 'boolean') {
          likeStatus = response;
        }
        
        console.log('설정할 likeStatus:', likeStatus);
        setIsLiked(likeStatus);
        setIsLikeStatusLoaded(true);
      } catch (error) {
        console.error('좋아요 상태 확인 실패:', error);
        // 에러 시 기본값 false로 설정
        if (isMounted) {
          setIsLiked(false);
          setIsLikeStatusLoaded(true);
        }
      } finally {
        if (isMounted) {
          setIsLikeLoading(false);
        }
      }
    };

    checkLikeStatus();

    // 클린업 함수
    return () => {
      isMounted = false;
    };
  }, [currentTrack]);

  if (!currentTrack) {
    // 현재 재생 중인 음악이 없으면 메인 페이지로 리다이렉트
    navigate('/');
    return null;
  }

  const handlePlayClick = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack(currentTrack);
    }
  };

  const handleTimeChange = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current && !isNaN(time) && time >= 0) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      console.log('재생 시간 변경:', time);
    }
  };

  const handlePrevTrack = () => {
    if (hasPreviousTrack) {
      playPreviousTrack();
    }
  };

  const handleNextTrack = () => {
    if (hasNextTrack) {
      playNextTrack();
    }
  };

  const handleLikeToggle = async () => {
    if (!currentTrack || isLikeLoading) return;
    
    console.log('좋아요 토글 시작 - 현재 상태:', isLiked);
    console.log('토글할 음악 ID:', currentTrack.id);
    
    try {
      setIsLikeLoading(true);
      const response = await toggleLike(currentTrack.id);
      console.log('좋아요 토글 API 응답:', response);
      
      // API 응답에 따라 상태 업데이트
      let newLikeStatus = !isLiked; // 기본값은 현재 상태의 반대
      
      if (response && typeof response === 'object') {
        if (response.hasOwnProperty('isLiked')) {
          newLikeStatus = Boolean(response.isLiked);
        } else if (response.hasOwnProperty('liked')) {
          newLikeStatus = Boolean(response.liked);
        } else if (response.hasOwnProperty('status')) {
          newLikeStatus = Boolean(response.status);
        }
      } else if (typeof response === 'boolean') {
        newLikeStatus = response;
      }
      
      setIsLiked(newLikeStatus);
      console.log('좋아요 상태 업데이트 완료:', newLikeStatus);
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
      // 에러 시 원래 상태로 되돌리지 않고 현재 상태 유지
    } finally {
      setIsLikeLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)} />
      </Header>
      <Content>
        <CoverImage>
          <img 
            src={currentTrack.coverUrl || "/icons/music_thumbnail.svg"} 
            alt={currentTrack.title || "음악 썸네일"} 
            onError={(e) => {
              e.target.src = "/icons/music_thumbnail.svg";
            }}
          />
        </CoverImage>
        <MusicInfo>
          <Title>{currentTrack.title}</Title>
          <Artist>{currentTrack.artist}</Artist>
        </MusicInfo>
        <ProgressContainer>
          <ProgressBar
            type="range"
            min={0}
            max={duration > 0 ? duration : 100}
            value={currentTime}
            onChange={handleTimeChange}
            disabled={isLoading}
          />
          <TimeInfo>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </TimeInfo>
        </ProgressContainer>
        <Controls>
          <LikeButton 
            onClick={handleLikeToggle}
            isLiked={isLiked}
            disabled={isLikeLoading || !isLikeStatusLoaded}
          />
          <MainControls>
            <PrevButton 
              onClick={handlePrevTrack} 
              disabled={!hasPreviousTrack}
              style={{ opacity: hasPreviousTrack ? 0.8 : 0.3 }}
            />
            <PlayButton 
              onClick={handlePlayClick}
              data-playing={isPlaying}
              disabled={isLoading}
            />
            <NextButton 
              onClick={handleNextTrack} 
              disabled={!hasNextTrack}
              style={{ opacity: hasNextTrack ? 0.8 : 0.3 }}
            />
          </MainControls>
          <PlaylistButton onClick={() => navigate('/playlist/play-history')} />
        </Controls>
      </Content>
    </Container>
  );
}

export default MusicDetailPage;