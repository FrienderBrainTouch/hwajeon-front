import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

import Header from '../../components/common/Header';
import { getAllMusicFiles, deleteMusicFile, updateMusicTitle } from '../../apis/music';

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
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--spacing-medium);
`;

const PageTitle = styled.h1`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 28px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 24px 0;
  text-align: center;
`;

const SearchSection = styled.div`
  width: 100%;
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Noto Sans KR', sans-serif;
  
  &:focus {
    outline: none;
    border-color: #1e88e5;
    box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.1);
  }
`;

const SearchButton = styled.button`
  padding: 12px 24px;
  background-color: #1e88e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1976d2;
  }
  
  &:active {
    background-color: #1565c0;
  }
`;

const MusicTable = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 80px;
  gap: 12px;
  padding: 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 600;
  font-size: 14px;
  color: #666;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 80px;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const MusicInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MusicTitle = styled.span`
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  cursor: pointer;
  
  &:hover {
    color: #1e88e5;
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #666;
`;

const EditModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
  margin-bottom: 16px;
  
  &:focus {
    outline: none;
    border-color: #1e88e5;
    box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.1);
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  ${props => {
    if (props.variant === 'secondary') {
      return `
        background-color: #f5f5f5;
        color: #666;
        border: 1px solid #ddd;
        
        &:hover {
          background-color: #e0e0e0;
        }
      `;
    } else {
      return `
        background-color: #1e88e5;
        color: white;
        border: 1px solid #1976d2;
        
        &:hover {
          background-color: #1976d2;
        }
      `;
    }
  }}
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  ${props => props.active && `
    background-color: #1e88e5;
    color: white;
    border-color: #1e88e5;
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;



function AdminFilesPage() {
  const [musicFiles, setMusicFiles] = useState([]);
  const [filteredMusicFiles, setFilteredMusicFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  // 음악 파일 목록 가져오기
  useEffect(() => {
    const fetchMusicFiles = async () => {
      try {
        const musicData = await getAllMusicFiles(currentPage, pageSize);
        setMusicFiles(musicData.content || musicData);
        setFilteredMusicFiles(musicData.content || musicData);
        
        // Pageable 정보 설정
        if (musicData.totalPages !== undefined) {
          setTotalPages(musicData.totalPages);
        }
      } catch (error) {
        console.error('음악 파일 목록을 가져오는데 실패했습니다:', error);
      }
    };

    fetchMusicFiles();
  }, [currentPage, pageSize]);

  // 검색 필터링
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMusicFiles(musicFiles);
      return;
    }

    let filtered = musicFiles.filter(music => {
      const searchLower = searchTerm.toLowerCase().trim();
      const titleLower = music.title.toLowerCase();
      const ownerLower = music.owner.toLowerCase();
      
      // 제목에서 검색
      const titleMatch = titleLower.includes(searchLower);
      
      // 작곡가에서 검색
      const ownerMatch = ownerLower.includes(searchLower);
      
      // 공백으로 분리된 단어들로도 검색 (예: "바삭한 파전" -> "바삭", "파전" 각각 검색)
      const searchWords = searchLower.split(/\s+/).filter(word => word.length > 0);
      const titleWordMatch = searchWords.some(word => titleLower.includes(word));
      const ownerWordMatch = searchWords.some(word => ownerLower.includes(word));
      
      return titleMatch || ownerMatch || titleWordMatch || ownerWordMatch;
    });
    
    setFilteredMusicFiles(filtered);
  }, [musicFiles, searchTerm]);

  const handleSearch = () => {
    // 검색 로직은 이미 useEffect에서 처리됨
  };

  const handleMusicClick = (music) => {
    setSelectedMusic(music);
    setNewTitle(music.title);
    setShowModal(true);
  };

  const handleTitleUpdate = async () => {
    if (!selectedMusic || !newTitle.trim()) return;

    try {
      console.log('제목 변경 요청 시작:', selectedMusic.musicId, newTitle.trim());
      const result = await updateMusicTitle(selectedMusic.musicId, newTitle.trim());
      console.log('제목 변경 성공:', result);
      
      // 로컬 상태 업데이트
      setMusicFiles(prevMusic => 
        prevMusic.map(music => 
          music.musicId === selectedMusic.musicId 
            ? { ...music, title: newTitle.trim() }
            : music
        )
      );
      
      setFilteredMusicFiles(prevMusic => 
        prevMusic.map(music => 
          music.musicId === selectedMusic.musicId 
            ? { ...music, title: newTitle.trim() }
            : music
        )
      );
      
      // 성공 메시지
      alert('제목이 성공적으로 변경되었습니다!');
      
      // 모달 닫기 및 상태 초기화
      setShowModal(false);
      setSelectedMusic(null);
      setNewTitle('');
      
    } catch (error) {
      console.error('제목 변경 실패:', error);
      alert(`제목 변경에 실패했습니다: ${error.message}`);
    }
  };

  const handleDeleteMusic = async (musicId) => {
    if (window.confirm('정말로 이 음악 파일을 삭제하시겠습니까?')) {
      try {
        await deleteMusicFile(musicId);
        
        // 로컬 상태에서 제거
        setMusicFiles(prevMusic => prevMusic.filter(music => music.musicId !== musicId));
        setFilteredMusicFiles(prevMusic => prevMusic.filter(music => music.musicId !== musicId));
        
        alert('음악 파일이 성공적으로 삭제되었습니다!');
      } catch (error) {
        console.error('음악 파일 삭제 실패:', error);
        alert(`음악 파일 삭제에 실패했습니다: ${error.message}`);
      }
    }
  };

  const handleCancelEdit = () => {
    setShowModal(false);
    setSelectedMusic(null);
    setNewTitle('');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };



  return (
    <>
      <Header type="login" title="파일 관리" />
      <MainContainer>
        <Content>
          <PageTitle>파일 관리</PageTitle>
          
          <SearchSection>
            <SearchInput
              type="text"
              placeholder="음악 제목 또는 작곡가 이름으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton onClick={handleSearch}>검색</SearchButton>
          </SearchSection>

          <MusicTable>
            <TableHeader>
              <div>제목</div>
              <div>작곡가</div>
            </TableHeader>
            
            {filteredMusicFiles.length > 0 ? (
              filteredMusicFiles.map(music => (
                <TableRow key={music.musicId}>
                  <MusicInfo>
                    <MusicTitle onClick={() => handleMusicClick(music)}>
                      {music.title.length > 10 ? music.title.substring(0, 10) + '...' : music.title}
                    </MusicTitle>
                  </MusicInfo>
                  
                  <div>{music.owner}</div>
                </TableRow>
              ))
            ) : (
              <EmptyState>
                검색 결과가 없습니다.
              </EmptyState>
            )}
          </MusicTable>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Pagination>
              <PageButton
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                이전
              </PageButton>
              
              {Array.from({ length: totalPages }, (_, i) => i).map(page => (
                <PageButton
                  key={page}
                  active={currentPage === page}
                  onClick={() => handlePageChange(page)}
                >
                  {page + 1}
                </PageButton>
              ))}
              
              <PageButton
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
              >
                다음
              </PageButton>
            </Pagination>
          )}
        </Content>
      </MainContainer>
      
      {/* 음악 관리 모달 */}
      {showModal && (
        <EditModal>
          <ModalContent>
            <ModalTitle>음악 관리</ModalTitle>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>현재 제목:</strong> {selectedMusic?.title}
            </div>
            
            <ModalInput
              type="text"
              placeholder="새로운 제목을 입력하세요"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
            
            <ModalButtons>
              <ModalButton variant="secondary" onClick={handleCancelEdit}>
                취소
              </ModalButton>
              <ModalButton 
                variant="danger" 
                onClick={() => {
                  if (selectedMusic) {
                    handleDeleteMusic(selectedMusic.musicId);
                    setShowModal(false);
                  }
                }}
                style={{ backgroundColor: '#f44336', borderColor: '#d32f2f' }}
              >
                삭제
              </ModalButton>
              <ModalButton onClick={handleTitleUpdate}>
                제목 수정
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </EditModal>
      )}
    </>
  );
}

export default AdminFilesPage;
