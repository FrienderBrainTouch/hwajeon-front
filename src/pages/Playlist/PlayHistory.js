import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useMusicPlayer } from '../../context/MusicContext';
import MusicListItem from '../../components/common/MusicListItem';
import { getPlayHistory } from '../../apis/music';
import { assignRandomImagesToMusicList } from '../../utils/imageUtils';

const Container = styled.div`
  width: 100%;
  min-width: var(--min-viewport-width);
  max-width: var(--max-viewport-width);
  min-height: 100vh;
  margin: 0 auto;
  background-color: var(--color-background);
`;

const SearchHeader = styled.header`
  width: 100%;
  height: 60px;
  background-color: var(--color-background);
  border-bottom: 1px solid #f1f1f1;
  z-index: 100;
  padding: 0 var(--spacing-medium);
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
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

const Content = styled.div`
  padding: var(--spacing-medium);
`;

const ResultTitle = styled.h2`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-subtitle);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-medium) 0;
  padding: 0 var(--spacing-medium);
`;

const NoResults = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 15vh;
  gap: var(--spacing-medium);
  color: var(--color-text-secondary);
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  text-align: center;
`;

const NoResultsIcon = styled.div`
  width: 48px;
  height: 48px;
  background-image: url('/icons/playlist.svg');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.5;
`;

const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-small);
  padding: var(--spacing-medium) 0;
`;

function PlayHistoryPage() {
  const navigate = useNavigate();
  const { currentTrack, isPlaying, playTrack } = useMusicPlayer();
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayHistory = async () => {
      try {
        setLoading(true);
        const response = await getPlayHistory(0, 20); // 최근 20개 재생 이력
        console.log('재생 이력 API 응답:', response);
        
        // Spring Boot Pageable 응답 구조에 맞게 content에서 데이터 추출
        const data = response.content || response.data || response;
        console.log('추출된 음악 데이터:', data);
        
        // 이미지가 비어있는 경우 랜덤 이미지 할당
        const musicWithImages = assignRandomImagesToMusicList(data);
        setMusicList(musicWithImages);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch play history:', error);
        setError('재생 기록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayHistory();
  }, []);

  if (loading) {
    return (
      <Container>
        <SearchHeader>
          <BackButton onClick={() => navigate(-1)} />
        </SearchHeader>
        <Content>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-large)', color: 'var(--color-text-secondary)' }}>
            재생 기록을 불러오는 중...
          </div>
        </Content>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <SearchHeader>
          <BackButton onClick={() => navigate(-1)} />
        </SearchHeader>
        <Content>
          <NoResults>
            <NoResultsIcon />
            <div>데이터 로드 실패</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>
              {error}
            </div>
          </NoResults>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        {musicList.length > 0 ? (
          <>
            <ResultTitle>재생 기록</ResultTitle>
            <ResultList>
              {musicList.map((music) => {
                const isCurrentTrack = currentTrack?.id === (music.musicId || music.id);
                const shouldShowPlaying = isCurrentTrack && isPlaying;
                
                return (
                  <MusicListItem
                    key={music.musicId || music.id}
                    imageUrl={music.imageUrl || ""}
                    title={music.title}
                    artist={music.owner}
                    owner={music.owner}
                    isPlaying={shouldShowPlaying}
                    onPlayClick={() => {
                      playTrack({
                        id: music.musicId || music.id,
                        title: music.title,
                        artist: music.owner,
                        coverUrl: music.imageUrl,
                        audioUrl: music.playbackUrl
                      });
                    }}
                  />
                );
              })}
            </ResultList>
          </>
        ) : (
          <NoResults>
            <NoResultsIcon />
            <div>재생 기록이 없습니다</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>
              음악을 재생하면 여기에 기록됩니다.
            </div>
          </NoResults>
        )}
      </Content>
    </Container>
  );
}

export default PlayHistoryPage;
