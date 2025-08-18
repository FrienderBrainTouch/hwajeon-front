import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useMusicPlayer } from '../../../context/MusicContext';

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #fff;
  border-top: 1px solid #f1f1f1;
  padding: 0 var(--spacing-medium);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  
  /* 모바일에서 컨테이너 길이에 맞춤 */
  min-width: var(--min-viewport-width);
  max-width: var(--max-viewport-width);
  margin: 0 auto;
  
  @media (max-width: 480px) {
    padding: 0 var(--spacing-small);
    height: 60px;
  }
`;

const MusicInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  cursor: pointer;
  transition: opacity 0.2s ease;
  min-width: 0; /* 텍스트 오버플로우 방지 */
  
  &:hover {
    opacity: 0.8;
  }
  
  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const CoverImage = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 4px;
  background-color: #E9E9E9;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  flex-shrink: 0;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 1;
  
  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0; /* 텍스트 오버플로우 방지 */
  flex: 1;
`;

const TrackTitle = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.2em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const TrackArtist = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  color: #666;
  line-height: 1.2em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const IconButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;

const Footer = () => {
  const navigate = useNavigate();
  const { currentTrack, isPlaying, isLoading, togglePlay } = useMusicPlayer();

  if (!currentTrack) return null;  // 재생 중인 음악이 없으면 Footer를 렌더링하지 않음

  const handleMusicInfoClick = () => {
    navigate('/music/detail');
  };

  const handlePlayButtonClick = () => {
    if (!isLoading) {
      togglePlay();
    }
  };

  return (
    <FooterContainer>
      <MusicInfo onClick={handleMusicInfoClick}>
        <CoverImage
          style={{
            backgroundImage: currentTrack.coverUrl 
              ? `url(${currentTrack.coverUrl})` 
              : 'url(/icons/music_thumbnail.svg)',
          }}
        >
          {isLoading && <LoadingOverlay />}
        </CoverImage>
        <TrackInfo>
          <TrackTitle>{currentTrack.title}</TrackTitle>
          <TrackArtist>{currentTrack.artist}</TrackArtist>
        </TrackInfo>
      </MusicInfo>
      <Controls>
        <IconButton
          onClick={handlePlayButtonClick}
          disabled={isLoading}
          style={{
            backgroundImage: `url(${
              isPlaying ? '/icons/pause.svg' : '/icons/play.svg'
            })`,
          }}
        />
        <IconButton
          onClick={() => navigate('/playlist/play-history')}
          style={{ backgroundImage: 'url(/icons/playlist.svg)' }}
        />
      </Controls>
    </FooterContainer>
  );
};

export default Footer;