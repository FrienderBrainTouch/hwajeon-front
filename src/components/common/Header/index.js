import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import finderIcon from '../../../assets/images/header/header_finder.svg';
import profileIcon from '../../../assets/images/header/header_profile.svg';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--max-viewport-width);
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #f1f1f1;
  box-sizing: border-box;
  z-index: 100;
`;

const HeaderContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 var(--spacing-medium);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;  /* PageTitle의 absolute 포지셔닝을 위해 필요 */
  
  @media (max-width: 480px) {
    padding: 0 var(--spacing-small);
  }
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

const PageTitle = styled.h1`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: clamp(20px, 5vw, 28px);
  font-weight: 400;
  color: var(--color-text-primary);
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;  // 줄바꿈 방지

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const IconGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
`;

const Logo = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-subtitle);
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
`;

const Header = ({ type = 'main', title, onBack }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  if (type === 'login') {
    return (
      <HeaderContainer>
        <HeaderContent>
          <BackButton onClick={() => navigate(-1)} />
          <PageTitle>{title}</PageTitle>
        </HeaderContent>
      </HeaderContainer>
    );
  }

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo onClick={() => navigate('/')}>홈</Logo>
        <IconGroup>
          <IconWrapper 
            onClick={() => navigate('/search')}
            style={{ backgroundImage: `url(${finderIcon})` }} 
          />
          <IconWrapper 
            style={{ backgroundImage: `url(${profileIcon})` }}
            onClick={() => navigate(isAuthenticated ? '/mypage' : '/login')}  
          />
        </IconGroup>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
