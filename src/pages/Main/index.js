import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import MusicCard from '../../components/common/MusicCard';
import { useMusicPlayer } from '../../context/MusicContext';
import { useAuth } from '../../context/AuthContext';
import { getMyMusic, getRecentMusic, getLikedMusic } from '../../apis/music';
import { assignRandomImagesToMusicList } from '../../utils/imageUtils';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  min-width: var(--min-viewport-width);
  max-width: var(--max-viewport-width);
  margin: 0 auto;
  padding: var(--spacing-medium);
  padding-bottom: ${({ hasMusic }) => hasMusic ? 'calc(70px + var(--spacing-medium))' : 'var(--spacing-medium)'};
  background-color: var(--color-background);
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 480px) {
    padding: var(--spacing-small);
    padding-bottom: ${({ hasMusic }) => hasMusic ? 'calc(60px + var(--spacing-small))' : 'var(--spacing-small)'};
  }
`;

const PlaylistSection = styled.div`
  width: 100%;
  margin-bottom: var(--spacing-large);

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-medium);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-title);
  font-weight: 600;
  color: var(--color-text-primary);
`;

const ViewMoreButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: var(--font-size-normal);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
`;

const MusicList = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  padding: var(--spacing-small) 0;
  
  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const MusicCardWrapper = styled.div`
  display: inline-block;
  width: 120px;
  margin-right: var(--spacing-medium);
  vertical-align: top;

  @media (max-width: 480px) {
    width: 100px;
    margin-right: var(--spacing-small);
  }

  &:last-child {
    margin-right: 0;
  }
`;

const LoginMessageContainer = styled.div`
  width: 100%;
  padding: var(--spacing-large);
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 12px;
  margin-bottom: var(--spacing-large);
`;

const LoginMessageTitle = styled.h2`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-title);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-medium) 0;
`;

const LoginMessageText = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-medium) 0;
  line-height: 1.5;
`;

const LoginButton = styled.button`
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1976d2;
  }
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

const UploadButton = styled.button`
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  font-weight: 500;
  cursor: pointer;
  margin-top: var(--spacing-medium);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1976d2;
  }
`;

const LoadingContainer = styled.div`
  width: 100%;
  padding: var(--spacing-large);
  text-align: center;
  color: var(--color-text-secondary);
  font-family: 'Noto Sans KR', sans-serif;
`;

function MainPage() {
  const navigate = useNavigate();
  const { playTrack, currentTrack } = useMusicPlayer();
  const { isAuthenticated } = useAuth();
  
  const [myMusic, setMyMusic] = useState([]);
  const [recentMusic, setRecentMusic] = useState([]);
  const [favoriteMusic, setFavoriteMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API 호출 함수들 (백엔드 연동 시 실제 구현)
  const fetchMyMusic = async () => {
    try {
      const response = await getMyMusic();
      const musicData = response.data || response; // 백엔드 응답 구조에 따라 조정
      
      console.log('API 응답 데이터:', response);
      console.log('음악 데이터:', musicData);
      
      // 이미지가 비어있는 경우 랜덤 이미지 할당
      const musicWithImages = assignRandomImagesToMusicList(musicData);
      console.log('이미지 할당 후 데이터:', musicWithImages);
      
      return musicWithImages;
    } catch (error) {
      console.error('Failed to fetch my music:', error);
      throw error;
    }
  };

  const fetchRecentMusic = async () => {
    try {
      const response = await getRecentMusic();
      const musicData = response.data || response; // 백엔드 응답 구조에 따라 조정
      
      console.log('최근 추가된 음악 API 응답:', response);
      console.log('최근 추가된 음악 데이터:', musicData);
      
      return musicData;
    } catch (error) {
      console.error('Failed to fetch recent music:', error);
      throw error;
    }
  };

  const fetchFavoriteMusic = async () => {
    try {
      const response = await getLikedMusic();
      const musicData = response.data || response; // 백엔드 응답 구조에 따라 조정
      
      console.log('좋아요한 음악 API 응답:', response);
      console.log('좋아요한 음악 데이터:', musicData);
      
      return musicData;
    } catch (error) {
      console.error('Failed to fetch liked music:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const [myMusicData, recentMusicData, favoriteMusicData] = await Promise.all([
          fetchMyMusic(),
          fetchRecentMusic(),
          fetchFavoriteMusic()
        ]);
        
        // 각 음악 목록에 랜덤 이미지 할당
        setMyMusic(myMusicData);
        setRecentMusic(assignRandomImagesToMusicList(recentMusicData));
        setFavoriteMusic(assignRandomImagesToMusicList(favoriteMusicData));
        setError(null);
      } catch (error) {
        setError('데이터를 불러오는데 실패했습니다.');
        console.error('Failed to load music data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  // 음악 클릭 시 푸터에서 재생
  const handleMusicClick = async (music) => {
    try {
      console.log('=== 음악 재생 디버깅 ===');
      console.log('재생 요청 음악 정보:', music);
      console.log('music.musicId:', music.musicId);
      console.log('music.title:', music.title);
      console.log('music.owner:', music.owner);
      console.log('music.imageUrl:', music.imageUrl);
      
      // MusicContext에 음악 정보 설정 (푸터에서 재생)
      await playTrack({
        id: music.musicId,        // API에서 받는 musicId
        title: music.title,       // API에서 받는 title
        artist: music.owner,      // API에서 받는 owner
        coverUrl: music.imageUrl  // 이미지 URL (있는 경우)
      });
    } catch (error) {
      console.error('음악 재생 실패:', error);
      alert('음악 재생에 실패했습니다: ' + error.message);
    }
  };

  // 로그인하지 않은 경우 로그인 메시지 표시
  if (!isAuthenticated) {
    return (
      <Container hasMusic={!!currentTrack}>
        <LoginMessageContainer>
          <LoginMessageTitle>로그인이 필요합니다</LoginMessageTitle>
          <LoginMessageText>
            현재 플레이리스트에 접근하려면 로그인이 필요합니다.<br />
            로그인 후 이용해 주세요.
          </LoginMessageText>
          <LoginButton onClick={() => navigate('/login')}>
            로그인하기
          </LoginButton>
        </LoginMessageContainer>
      </Container>
    );
  }

  // 로딩 중일 때
  if (loading) {
    return (
      <Container hasMusic={!!currentTrack}>
        <LoadingContainer>
          음악 목록을 불러오는 중...
        </LoadingContainer>
      </Container>
    );
  }

  // 에러가 발생했을 때
  if (error) {
    return (
      <Container hasMusic={!!currentTrack}>
        <EmptyStateContainer>
          <EmptyStateTitle>데이터 로드 실패</EmptyStateTitle>
          <EmptyStateText>{error}</EmptyStateText>
        </EmptyStateContainer>
      </Container>
    );
  }

  // 빈 상태 컴포넌트
  const EmptyState = ({ title, description, showUploadButton = false }) => (
    <EmptyStateContainer>
      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateText>{description}</EmptyStateText>
      {showUploadButton && (
        <UploadButton onClick={() => navigate('/mypage/upload')}>
          음악 업로드하기
        </UploadButton>
      )}
    </EmptyStateContainer>
  );

  return (
    <Container hasMusic={!!currentTrack}>
      <PlaylistSection>
        <SectionHeader>
          <SectionTitle>나의 음악</SectionTitle>
          <ViewMoreButton onClick={() => navigate('/playlist/my-music')}>
            더보기 {'>'}
          </ViewMoreButton>
        </SectionHeader>
        {myMusic.length > 0 ? (
          <MusicList>
            {myMusic.map((music) => (
              <MusicCardWrapper key={music.musicId}>
                <MusicCard
                  imageUrl={music.imageUrl}
                  title={music.title}
                  artist={music.owner}
                  owner={music.owner}
                  onClick={() => handleMusicClick(music)}
                />
              </MusicCardWrapper>
            ))}
          </MusicList>
        ) : (
          <EmptyState 
            title="아직 등록된 음악이 없어요" 
            description="첫 번째 음악을 업로드해보세요!"
            showUploadButton={true}
          />
        )}
      </PlaylistSection>

      <PlaylistSection>
        <SectionHeader>
          <SectionTitle>최근 추가된 음악</SectionTitle>
          <ViewMoreButton onClick={() => navigate('/playlist/recent-music')}>
            더보기 {'>'}
          </ViewMoreButton>
        </SectionHeader>
        {recentMusic.length > 0 ? (
          <MusicList>
            {recentMusic.map((music) => (
              <MusicCardWrapper key={music.musicId}>
                <MusicCard
                  imageUrl={music.imageUrl}
                  title={music.title}
                  artist={music.owner}
                  owner={music.owner}
                  onClick={() => handleMusicClick(music)}
                />
              </MusicCardWrapper>
            ))}
          </MusicList>
        ) : (
          <EmptyState 
            title="최근 추가된 음악이 없어요" 
            description="새로운 음악을 추가하면 여기에 표시됩니다."
          />
        )}
      </PlaylistSection>

      <PlaylistSection>
        <SectionHeader>
          <SectionTitle>즐겨찾기한 음악</SectionTitle>
          <ViewMoreButton onClick={() => navigate('/playlist/favorites')}>
            더보기 {'>'}
          </ViewMoreButton>
        </SectionHeader>
        {favoriteMusic.length > 0 ? (
          <MusicList>
            {favoriteMusic.map((music) => (
              <MusicCardWrapper key={music.musicId}>
                <MusicCard
                  imageUrl={music.imageUrl}
                  title={music.title}
                  artist={music.owner}
                  owner={music.owner}
                  onClick={() => handleMusicClick(music)}
                />
              </MusicCardWrapper>
            ))}
          </MusicList>
        ) : (
          <EmptyState 
            title="즐겨찾기한 음악이 없어요" 
            description="마음에 드는 음악을 즐겨찾기에 추가해보세요!"
          />
        )}
      </PlaylistSection>
    </Container>
  );
}

export default MainPage;