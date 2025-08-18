import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { searchMusicByKeywords } from '../../apis/music';
import { assignRandomImagesToMusicList } from '../../utils/imageUtils';

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

const MainContainer = styled.div`
  width: 100%;
  min-width: var(--min-viewport-width);
  max-width: var(--max-viewport-width);
  min-height: calc(100vh - 60px);
  margin: 0 auto;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
`;

const SearchContainer = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding: 0 var(--spacing-medium);
  display: flex;
  flex-direction: column;
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
  background-image: url('/assets/images/header/header_finder.svg');
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

const ContentWrapper = styled.div`
  width: 100%;
`;

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const navigate = useNavigate();

  const handleSearch = async () => {
    const term = searchTerm.trim();
    if (!term || isSearching) return;

    try {
      setIsSearching(true);
      const results = await searchMusicByKeywords(term);
      
      console.log('검색 결과:', results);
      
      // API 응답을 MusicListItem 형식에 맞게 변환
      const formattedResults = results.map(item => ({
        musicId: item.musicId,
        title: item.title,
        playbackUrl: item.playbackUrl,
        imageUrl: "", // API에서 이미지 URL이 없으므로 빈 문자열
        owner: item.owner // API에서 owner 정보 사용
      }));
      
      // 일관된 앨범 커버 할당
      const resultsWithImages = assignRandomImagesToMusicList(formattedResults);
      
      navigate('/search/result', {
        state: {
          searchTerm: term,
          results: resultsWithImages
        }
      });
    } catch (error) {
      console.error('검색 실패:', error);
      alert('검색에 실패했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <SearchHeader>
        <BackButton onClick={() => window.history.back()} />
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
      <MainContainer>
        <SearchContainer>
          <ContentWrapper>
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-normal)'
            }}>
              검색어를 입력하고 엔터를 눌러주세요.
            </div>
          </ContentWrapper>
        </SearchContainer>
      </MainContainer>
    </>
  );
}

export default SearchPage;