import React from 'react';
import styled from '@emotion/styled';

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 25px;
  flex: 1;
  min-width: 0;  /* flex item 내부의 text-overflow를 위해 필요 */
`;

const Title = styled.h3`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 22px;
  font-weight: 400;
  line-height: 1.448;
  color: #1A1A1A;
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;  /* 부모 컨테이너 너비를 넘지 않도록 제한 */
`;

const Artist = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.448;
  color: #A0A0A0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Owner = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.448;
  color: #C0C0C0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemInfo = ({ title, artist, owner }) => {
  return (
    <InfoContainer>
      <Title>{title}</Title>
      <Artist>{artist}</Artist>
      {owner && owner !== artist && <Owner>만든 사람: {owner}</Owner>}
    </InfoContainer>
  );
};

export default ItemInfo;