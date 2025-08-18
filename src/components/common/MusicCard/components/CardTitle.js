import React from 'react';
import styled from '@emotion/styled';

const Title = styled.h3`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: clamp(var(--font-size-normal), 4.5vw, var(--font-size-large));
  font-weight: 500;
  line-height: 1.3;
  color: var(--color-text-primary);
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  letter-spacing: -0.5px;
  
  @media (max-width: 480px) {
    font-size: var(--font-size-normal);
  }
`;

const CardTitle = ({ children }) => {
  return <Title>{children}</Title>;
};

export default CardTitle;
