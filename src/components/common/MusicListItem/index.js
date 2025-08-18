import React from 'react';
import styled from '@emotion/styled';
import ItemImage from './components/ItemImage';
import ItemInfo from './components/ItemInfo';

const Container = styled.div`
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  padding-right: 45px;
`;

const PlayButton = styled.button`
  width: 33px;
  height: 33px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  background-image: url('/icons/play.svg');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  right: 0;
  
  &[data-playing="true"] {
    background-image: url('/icons/pause.svg');
  }
`;

const MusicListItem = ({ 
  imageUrl, 
  title, 
  artist, 
  owner,
  isPlaying = false,
  onPlayClick,
  onClick 
}) => {
  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (onPlayClick) {
      onPlayClick();
    }
  };

  const handleContainerClick = () => {
    if (onClick) {
      onClick();
    } else if (onPlayClick) {
      onPlayClick();
    }
  };

  return (
    <Container onClick={handleContainerClick}>
      <ItemImage 
        src={imageUrl} 
        alt={`${title} - ${artist || owner}`} 
      />
      <ItemInfo 
        title={title}
        artist={artist}
        owner={owner}
      />
      <PlayButton 
        data-playing={isPlaying}
        onClick={handlePlayClick}
      />
    </Container>
  );
};

export default MusicListItem;