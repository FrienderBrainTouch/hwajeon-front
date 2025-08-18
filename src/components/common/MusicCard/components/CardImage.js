import React, { useState } from 'react';
import styled from '@emotion/styled';

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--color-background);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FallbackContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-normal);
  font-weight: 500;
`;

const CardImage = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <ImageContainer>
        <FallbackContainer>
          No Image
        </FallbackContainer>
      </ImageContainer>
    );
  }

  return (
    <ImageContainer>
      <StyledImage 
        src={src} 
        alt={alt} 
        onError={() => setHasError(true)}
      />
    </ImageContainer>
  );
};

export default CardImage;