import React from 'react';
import styled from '@emotion/styled';

const Artist = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  font-weight: 400;
  line-height: 1.3;
  color: var(--color-text-secondary);
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  letter-spacing: -0.3px;
`;

const CardArtist = ({ children }) => {
  return <Artist>{children}</Artist>;
};

export default CardArtist;
