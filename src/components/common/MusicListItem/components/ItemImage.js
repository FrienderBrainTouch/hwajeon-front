import React, { useState } from 'react';
import styled from '@emotion/styled';

const ImageContainer = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #FFFFFF;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;



const ItemImage = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  // src가 없거나 에러가 발생한 경우 기본 이미지 사용
  const imageSrc = (!src || hasError) ? "/icons/music_thumbnail.svg" : src;

  return (
    <ImageContainer>
      <StyledImage 
        src={imageSrc} 
        alt={alt || "음악 썸네일"} 
        onError={() => setHasError(true)}
      />
    </ImageContainer>
  );
};

export default ItemImage;