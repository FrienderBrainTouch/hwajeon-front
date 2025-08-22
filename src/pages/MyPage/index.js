import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import { getMyMusic } from '../../apis/music';
import { assignRandomImagesToMusicList } from '../../utils/imageUtils';

const MainContainer = styled.div`
  width: 100%;
  min-width: var(--min-viewport-width);
  max-width: var(--max-viewport-width);
  min-height: 100vh;
  margin: 0 auto;
  padding-top: 60px;
  background-color: var(--color-background);
`;

const Content = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding: 0 var(--spacing-medium);
`;

const UserInfoSection = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProfileIcon = styled.div`
  width: 60px;
  height: 60px;
  background-image: url('/icons/header_profile.svg');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

const UserName = styled.h2`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 32px;
  font-weight: 400;
  color: var(--color-text-primary);
  margin: 0;
`;

const UploadButton = styled.button`
  height: 36px;
  padding: 0 16px;
  background: var(--color-accent);
  border: none;
  border-radius: 8px;
  color: white;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24px 0 16px 0;
`;

const SectionTitle = styled.h3`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-title);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
`;

const MusicGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--spacing-medium);
  margin-bottom: var(--spacing-medium);
  overflow-x: auto;
  
  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const MusicCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: var(--spacing-small);
  border-radius: 8px;
  min-width: 80px;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px);
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const AlbumCover = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f0f0f0;
  margin-bottom: var(--spacing-small);
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'url(/icons/music_thumbnail.svg)'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const SongTitle = styled.h4`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.3;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  max-width: 80px;
`;

const ViewMoreButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-accent);
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: var(--spacing-small);
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const MenuSection = styled.div`
  margin-top: 32px;
  padding: 0 8px;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  cursor: pointer;
  border-bottom: 1px solid #F1F1F1;

  &:last-child {
    border-bottom: none;
  }
`;

const MenuTitle = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  color: var(--color-text-primary);
`;

const ArrowIcon = styled.div`
  width: 24px;
  height: 24px;
  background-image: url('/icons/arrow.svg');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  transform: rotate(90deg);
`;

const MenuSectionTitle = styled.h3`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-title);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
`;

const LogoutButton = styled.button`
  width: 100%;
  height: 60px;
  background: none;
  border: 1px solid var(--color-accent);
  border-radius: 8px;
  color: var(--color-accent);
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-subtitle);
  font-weight: 500;
  cursor: pointer;
  margin-top: 40px;
`;

const EmptyStateContainer = styled.div`
  width: 100%;
  padding: var(--spacing-large);
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 12px;
  margin-bottom: var(--spacing-medium);
`;

const EmptyStateTitle = styled.h3`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-subtitle);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-small) 0;
`;

const EmptyStateText = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
`;

function MyPage() {
  const navigate = useNavigate();
  const { logout, userName } = useAuth();
  const [myMusic, setMyMusic] = useState([]);
  const [loading, setLoading] = useState(true);

  // API 호출 함수
  const fetchMyMusic = async () => {
    try {
      const response = await getMyMusic();
      const musicData = response.data || response;
      
      // 이미지가 비어있는 경우 랜덤 이미지 할당
      const musicWithImages = assignRandomImagesToMusicList(musicData);
      
      // 4개만 반환
      return musicWithImages.slice(0, 4);
    } catch (error) {
      console.error('Failed to fetch my music:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const musicData = await fetchMyMusic();
        setMyMusic(musicData);
      } catch (error) {
        console.error('Failed to load music data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = async () => {
    console.log('로그아웃 버튼 클릭됨');
    try {
      console.log('AuthContext의 logout 함수 호출 시작');
      await logout();
      console.log('AuthContext의 logout 함수 호출 완료');
      // 로그아웃 함수 내에서 리다이렉트를 처리하므로 여기서는 추가 처리 불필요
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUploadClick = () => {
    navigate('/mypage/upload');
  };

  const handlePasswordChange = () => {
    navigate('/mypage/password');
  };

  const handleWithdraw = () => {
    navigate('/mypage/withdraw');
  };

  // 빈 상태 컴포넌트
  const EmptyState = () => (
    <EmptyStateContainer>
      <EmptyStateTitle>추가한 음악이 없습니다</EmptyStateTitle>
      <EmptyStateText>
        첫 번째 음악을 업로드해보세요!
      </EmptyStateText>
    </EmptyStateContainer>
  );

  return (
    <>
      <Header type="login" title="마이페이지" />
      <MainContainer>
        <Content>
          <UserInfoSection>
            <ProfileIcon />
            <UserInfoWrapper>
              <UserName>{userName || "사용자"}</UserName>
              <UploadButton onClick={handleUploadClick}>
                파일 업로드
              </UploadButton>
            </UserInfoWrapper>
          </UserInfoSection>
          
          <SectionHeader>
            <SectionTitle>나의 음악</SectionTitle>
            <ViewMoreButton onClick={() => navigate('/playlist/my-music')}>
              더보기 {'>'}
            </ViewMoreButton>
          </SectionHeader>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-large)', color: 'var(--color-text-secondary)' }}>
              음악 목록을 불러오는 중...
            </div>
          ) : myMusic.length > 0 ? (
            <>
              <MusicGrid>
                {myMusic.map(music => (
                  <MusicCard key={music.musicId || music.id}>
                    <AlbumCover imageUrl={music.imageUrl} />
                    <SongTitle>{music.title}</SongTitle>
                  </MusicCard>
                ))}
              </MusicGrid>
            </>
          ) : (
            <EmptyState />
          )}

          <MenuSection>
            <MenuSectionTitle>개인정보 관리</MenuSectionTitle>
            <MenuList>
              <MenuItem onClick={handlePasswordChange}>
                <MenuTitle>비밀번호 변경</MenuTitle>
                <ArrowIcon />
              </MenuItem>
              <MenuItem onClick={handleWithdraw}>
                <MenuTitle>회원탈퇴</MenuTitle>
                <ArrowIcon />
              </MenuItem>
            </MenuList>
          </MenuSection>
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </Content>
      </MainContainer>
    </>
  );
}

export default MyPage;