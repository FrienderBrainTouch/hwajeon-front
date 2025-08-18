import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useLocation, useNavigate } from 'react-router-dom';
import MusicListItem from '../../components/common/MusicListItem';
import { useMusicPlayer } from '../../context/MusicContext';
import { searchMusicByKeywords } from '../../apis/music';
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

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 48px;  // 양쪽에 아이콘을 위한 공간
  border: none;
  border-radius: 10px;
  background-color: #E9E9E9;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  color: var(--color-text-primary);

  &::placeholder {
    color: var(--color-text-secondary);
  }

  &:focus {
    outline: none;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: var(--spacing-small);
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background-image: url('/icons/search.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

const SearchButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  background-image: url('/icons/search.svg'); /* 👈 이렇게 경로를 지정 */
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  position: absolute;
  right: var(--spacing-small);
  top: 50%;
  transform: translateY(-50%);
  
  &:hover {
    opacity: 0.9;
  }
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
  background-image: url('/icons/search.svg');
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

function SearchResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTrack, isPlaying, playTrack } = useMusicPlayer();
  
  const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');
  const [searchResults, setSearchResults] = useState(location.state?.results || []);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    const term = searchTerm.trim();
    if (!term || isSearching) return;
    
    try {
      setIsSearching(true);
      const results = await searchMusicByKeywords(term);
      
      console.log('검색 결과:', results);
      
      // API 응답을 MusicListItem 형식에 맞게 변환
      const formattedResults = results.map(item => {
        console.log('개별 아이템:', item);
        return {
          musicId: item.musicId,
          title: item.title,
          playbackUrl: item.playbackUrl,
          imageUrl: "", // API에서 이미지 URL이 없으므로 빈 문자열
          owner: item.owner // API에서 owner 정보 사용
        };
      });
      
      // 일관된 앨범 커버 할당
      const resultsWithImages = assignRandomImagesToMusicList(formattedResults);
      setSearchResults(resultsWithImages);
    } catch (error) {
      console.error('검색 실패:', error);
      alert('검색에 실패했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Container>
      <SearchHeader>
        <BackButton onClick={() => navigate(-1)} />
        <SearchBox>
          <SearchInputWrapper>
            <SearchIcon />
            <SearchInput
              placeholder="노래명, 만든 사람 검색"
              value={searchTerm}
              onChange={handleSearchInput}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <SearchButton onClick={handleSearch} type="button" />
          </SearchInputWrapper>
        </SearchBox>
      </SearchHeader>
      <Content>
        {searchResults.length > 0 ? (
          <>
            <ResultTitle>검색된 음악 목록</ResultTitle>
            <ResultList>
              {searchResults.map((result) => {
                const isCurrentTrack = currentTrack?.id === (result.musicId || result.id);
                const shouldShowPlaying = isCurrentTrack && isPlaying;
                console.log(`음악 ${result.musicId}: currentTrack.id=${currentTrack?.id}, isCurrentTrack=${isCurrentTrack}, isPlaying=${isPlaying}, shouldShowPlaying=${shouldShowPlaying}`);
                
                return (
                  <MusicListItem
                    key={result.musicId || result.id}
                    imageUrl={result.imageUrl || ""}
                    title={result.title}
                    artist={result.owner}
                    owner={result.owner}
                    isPlaying={shouldShowPlaying}
                    onPlayClick={() => {
                      playTrack({
                        id: result.musicId,
                        title: result.title,
                        artist: result.owner,
                        coverUrl: result.imageUrl,
                        audioUrl: result.playbackUrl
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
            <div>검색 결과가 없습니다.</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>
              다른 검색어를 시도해보세요.
            </div>
          </NoResults>
        )}
      </Content>
    </Container>
  );
}

export default SearchResultPage;