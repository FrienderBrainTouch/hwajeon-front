import React from 'react';
import styled from '@emotion/styled';
import CardImage from './components/CardImage';
import CardTitle from './components/CardTitle';
import CardArtist from './components/CardArtist';

const Card = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  background: var(--color-background);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: var(--spacing-small);
  
  /* CardImage 컴포넌트의 크기를 컨테이너에 맞게 확장 */
  > div {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
  }
`;

const TextContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  text-align: left;
  padding: 0;
`;



const MusicCard = ({ imageUrl, title, artist, onClick }) => {
  // undefined 값들을 안전하게 처리
  const safeTitle = title || '제목 없음';
  const safeArtist = artist || '아티스트 없음';
  const safeImageUrl = imageUrl || '';

  return (
    <Card onClick={onClick}>
      <ImageContainer>
        <CardImage 
          src={safeImageUrl} 
          alt={`${safeTitle} - ${safeArtist}`} 
        />
      </ImageContainer>
      <TextContainer>
        <CardTitle>{safeTitle}</CardTitle>
        <CardArtist>{safeArtist}</CardArtist>
      </TextContainer>
    </Card>
  );
};

export default MusicCard;