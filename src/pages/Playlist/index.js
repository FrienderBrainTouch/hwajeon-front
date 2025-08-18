import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';
import { useMusicPlayer } from '../../context/MusicContext';
import MusicListItem from '../../components/common/MusicListItem';
import { getMyMusic, getRecentMusic, getLikedMusic } from '../../apis/music';
import { assignRandomImagesToMusicList } from '../../utils/imageUtils';

const Container = styled.div`
  width: 100%;
  min-width: var(--min-viewport-width);
  max-width: var(--max-viewport-width);
  margin: 0 auto;
  padding: var(--spacing-medium);
  padding-bottom: ${({ hasMusic }) => hasMusic ? 'calc(70px + var(--spacing-medium))' : '0'};
  background-color: var(--color-background);

  @media (max-width: 480px) {
    padding: var(--spacing-small);
    padding-bottom: ${({ hasMusic }) => hasMusic ? 'calc(60px + var(--spacing-small))' : '0'};
  }
`;

const Title = styled.h1`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.448;
  color: var(--color-text-primary);
  margin: 0 var(--spacing-medium);
  padding: var(--spacing-large) 0 var(--spacing-medium);

  @media (max-width: 480px) {
    margin: 0 var(--spacing-small);
    padding: var(--spacing-medium) 0;
    font-size: 28px;
  }
`;

const MusicList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-small);
  padding: var(--spacing-medium);
  width: 100%;

  @media (max-width: 480px) {
    padding: var(--spacing-small);
    gap: calc(var(--spacing-small) * 0.8);
  }
`;

const EmptyStateContainer = styled.div`
  width: 100%;
  padding: var(--spacing-large);
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 12px;
  margin: var(--spacing-medium);
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

const LoadingContainer = styled.div`
  width: 100%;
  padding: var(--spacing-large);
  text-align: center;
  color: var(--color-text-secondary);
  font-family: 'Noto Sans KR', sans-serif;
`;

// 플레이리스트 타입별 설정
const PLAYLIST_CONFIGS = {
  'my-music': {
    title: '나의 음악',
    fetchFunction: getMyMusic,
    emptyTitle: '등록된 음악이 없습니다',
    emptyMessage: '첫 번째 음악을 업로드해보세요!',
    errorMessage: '음악 목록을 불러오는데 실패했습니다.'
  },
  'recent-music': {
    title: '최근 추가된 음악',
    fetchFunction: getRecentMusic,
    emptyTitle: '최근 추가된 음악이 없습니다',
    emptyMessage: '새로운 음악을 추가하면 여기에 표시됩니다.',
    errorMessage: '최근 추가된 음악 목록을 불러오는데 실패했습니다.'
  },
  'favorites': {
    title: '즐겨찾기한 음악',
    fetchFunction: getLikedMusic,
    emptyTitle: '즐겨찾기한 음악이 없습니다',
    emptyMessage: '마음에 드는 음악을 즐겨찾기에 추가해보세요!',
    errorMessage: '즐겨찾기한 음악 목록을 불러오는데 실패했습니다.'
  }
};

function PlaylistPage() {
  const location = useLocation();
  const { currentTrack, playTrack, isPlaying, togglePlay } = useMusicPlayer();
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL에서 플레이리스트 타입 추출
  const getPlaylistType = () => {
    const path = location.pathname;
    if (path.includes('/my-music')) return 'my-music';
    if (path.includes('/recent-music')) return 'recent-music';
    if (path.includes('/favorites')) return 'favorites';
    return 'my-music'; // 기본값
  };

  const playlistType = getPlaylistType();
  const config = PLAYLIST_CONFIGS[playlistType];

  useEffect(() => {
    const fetchMusicList = async () => {
      try {
        setLoading(true);
        
        if (!config.fetchFunction) {
          // API가 아직 구현되지 않은 경우 빈 배열 반환
          setMusicList([]);
          setError(null);
          return;
        }

        const response = await config.fetchFunction();
        const data = response.data || response;
        // 음악 목록에 랜덤 이미지 할당
        setMusicList(assignRandomImagesToMusicList(data));
        setError(null);
      } catch (error) {
        console.error(`Failed to fetch ${playlistType} music:`, error);
        setError(config.errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMusicList();
  }, [playlistType, config]);

  if (loading) {
    return (
      <Container hasMusic={!!currentTrack}>
        <Title>{config.title}</Title>
        <LoadingContainer>
          음악 목록을 불러오는 중...
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container hasMusic={!!currentTrack}>
        <Title>{config.title}</Title>
        <EmptyStateContainer>
          <EmptyStateTitle>데이터 로드 실패</EmptyStateTitle>
          <EmptyStateText>{error}</EmptyStateText>
        </EmptyStateContainer>
      </Container>
    );
  }

  return (
    <Container hasMusic={!!currentTrack}>
      <Title>{config.title}</Title>
      {musicList.length > 0 ? (
        <MusicList>
          {musicList.map((music) => (
            <MusicListItem
              key={music.musicId || music.id}
              imageUrl={music.imageUrl}
              title={music.title}
              artist={music.owner}
              isPlaying={currentTrack?.id === (music.musicId || music.id) && isPlaying}
              onPlayClick={() => {
                const musicId = music.musicId || music.id;
                if (currentTrack?.id === musicId) {
                  togglePlay();
                } else {
                  playTrack({
                    id: musicId,
                    title: music.title,
                    artist: music.owner,
                    coverUrl: music.imageUrl
                  });
                }
              }}
            />
          ))}
        </MusicList>
      ) : (
        <EmptyStateContainer>
          <EmptyStateTitle>{config.emptyTitle}</EmptyStateTitle>
          <EmptyStateText>{config.emptyMessage}</EmptyStateText>
        </EmptyStateContainer>
      )}
    </Container>
  );
}

export default PlaylistPage;