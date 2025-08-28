import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/common/Header';
import { uploadMusic, getAllUsers } from '../../../apis/music';

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

// const PageTitle = styled.h1`
//   font-family: 'Noto Sans KR', sans-serif;
//   font-size: 28px;
//   font-weight: 600;
//   color: var(--color-text-primary);
//   text-align: center;
//   margin: 0 0 var(--spacing-medium) 0;
// `;

// const Divider = styled.div`
//   width: 100%;
//   height: 1px;
//   background-color: #E9E9E9;
//   margin-bottom: var(--spacing-large);
// `;

const SectionTitle = styled.h2`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-medium) 0;
`;

const FileDropZone = styled.div`
  width: 100%;
  height: 120px;
  border: 2px dashed #E9E9E9;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-small);
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #FAFAFA;

  &:hover {
    border-color: var(--color-accent);
    background-color: #F0F8FF;
  }

  &.drag-over {
    border-color: var(--color-accent);
    background-color: #E3F2FD;
  }
`;

const PlusIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: #000;
  border-radius: 50%;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: #fff;
  }
  
  &::before {
    width: 2px;
    height: 16px;
    top: 8px;
    left: 15px;
  }
  
  &::after {
    width: 16px;
    height: 2px;
    top: 15px;
    left: 8px;
  }
`;

const DropZoneText = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  color: var(--color-text-secondary);
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-small);
  margin-top: var(--spacing-medium);
`;

const FileItem = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: var(--spacing-medium);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
`;

const FileIcon = styled.div`
  font-size: 24px;
  color: var(--color-accent);
`;

const FileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FileName = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  font-weight: 500;
  color: var(--color-text-primary);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #E9E9E9;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: var(--color-accent);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  min-width: 40px;
  text-align: right;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #999;
  font-size: 18px;
  font-weight: bold;
  
  &:hover {
    color: #FF3B30;
  }
`;

const CreatorSection = styled.div`
  margin-top: var(--spacing-large);
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  border: 1px solid #E9E9E9;
  border-radius: 8px;
  padding: 0 var(--spacing-medium);
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  color: var(--color-text-primary);
  background-color: #fff;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }
`;

const Select = styled.select`
  flex: 1;
  height: 48px;
  border: 1px solid #E9E9E9;
  border-radius: 8px;
  padding: 0 var(--spacing-medium);
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  color: var(--color-text-primary);
  background-color: #fff;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }
`;

const CreatorRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
`;

const SearchButton = styled.button`
  width: auto;
  height: 48px;
  padding: 0 var(--spacing-medium);
  background-color: #f5f5f5;
  border: 1px solid #E9E9E9;
  border-radius: 8px;
  color: var(--color-text-primary);
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
    border-color: var(--color-accent);
  }
`;

const UploadButton = styled.button`
  width: 100%;
  height: 56px;
  background-color: var(--color-accent);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-subtitle);
  font-weight: 500;
  cursor: pointer;
  margin-top: var(--spacing-large);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1976d2;
  }

  &:disabled {
    background-color: #CCCCCC;
    cursor: not-allowed;
  }
`;

// 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: var(--spacing-large);
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-medium);
`;

const ModalTitle = styled.h3`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  
  &:hover {
    color: #333;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 48px;
  border: 1px solid #E9E9E9;
  border-radius: 8px;
  padding: 0 var(--spacing-medium);
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  color: var(--color-text-primary);
  background-color: #fff;
  margin-bottom: var(--spacing-medium);
  
  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }
`;

const UserList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const UserItem = styled.div`
  padding: var(--spacing-medium);
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserName = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  font-weight: 500;
  color: var(--color-text-primary);
`;

const UserId = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin-top: 4px;
`;

function UploadFilePage() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const fileInputRef = useRef(null);
  
  const [files, setFiles] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [local, setLocal] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // TEACHER 권한일 때 사용자 목록 가져오기
  useEffect(() => {
    if (userRole === 'TEACHER') {
      fetchUsers();
    }
  }, [userRole]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setUsersError(null);
    
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('사용자 목록 조회 실패:', error);
      setUsersError('사용자 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      progress: 0,
      status: 'pending' // pending, uploading, completed, error
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // 파일 업로드 시뮬레이션 (실제로는 백엔드 API 호출)
    newFiles.forEach(fileItem => {
      simulateFileUpload(fileItem.id);
    });
  };

  const simulateFileUpload = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: 100, status: 'completed' }
            : f
        ));
      } else {
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: Math.round(progress) }
            : f
        ));
      }
    }, 200);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('업로드할 파일을 선택해주세요.');
      return;
    }
    
    // TEACHER 권한이 있는 경우에만 만든 사람 선택 필수
    if (userRole === 'TEACHER' && !selectedCreator) {
      alert('만든 사람을 선택해주세요.');
      return;
    }

    try {
      // TEACHER 권한일 때는 selectedUserId, 일반 유저일 때는 null 전달
      // TEACHER: api/users/{userId} 호출, 일반 유저: api/musics 호출 (토큰에서 사용자 정보 추출)
      const userIdToSend = userRole === 'TEACHER' ? selectedUserId : null;
      await uploadMusic(files, userIdToSend, local);
      
      // 업로드 완료 후 처리
      alert('파일 업로드가 완료되었습니다.');
      // 업로드 완료 후 필드 초기화
      setFiles([]);
      setSelectedCreator('');
      setSelectedUserId('');
      setLocal('');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('파일 업로드에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCreatorChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedCreator(selectedValue);
    
    // 선택된 사용자의 userId 찾기
    if (selectedValue) {
      const selectedUser = users.find(user => user.userId.toString() === selectedValue);
      setSelectedUserId(selectedUser ? selectedUser.userId : '');
    } else {
      setSelectedUserId('');
    }
  };

  const openUserSearchModal = () => {
    setIsModalOpen(true);
    setSearchTerm('');
    setFilteredUsers(users.slice(0, 10));
  };

  const closeUserSearchModal = () => {
    setIsModalOpen(false);
    setSearchTerm('');
  };

  const handleSearchInput = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredUsers(users.slice(0, 10));
    } else {
      const filtered = users.filter(user => 
        user.userName.toLowerCase().includes(term.toLowerCase()) ||
        user.loginId.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered.slice(0, 10));
    }
  };

  const selectUserFromModal = (user) => {
    setSelectedCreator(user.userId.toString());
    setSelectedUserId(user.userId);
    closeUserSearchModal();
  };

  return (
    <>
      <Header type="login" title="파일 업로드" onBack={() => navigate('/mypage/upload')} />
      <MainContainer>
        <Content>
          
          <div>
            <SectionTitle>업로드</SectionTitle>
            <FileDropZone
              onClick={handleFileInputClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={isDragging ? 'drag-over' : ''}
            >
              <PlusIcon />
              <DropZoneText>파일을 선택하거나 여기에 드래그하세요</DropZoneText>
            </FileDropZone>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="audio/*"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
            
            {files.length > 0 && (
              <FileList>
                {files.map(fileItem => (
                  <FileItem key={fileItem.id}>
                    <FileIcon>🎵</FileIcon>
                    <FileInfo>
                      <FileName>{fileItem.name}</FileName>
                      <ProgressBar>
                        <ProgressFill progress={fileItem.progress} />
                      </ProgressBar>
                    </FileInfo>
                    <ProgressText>{fileItem.progress}%</ProgressText>
                    <DeleteButton onClick={() => removeFile(fileItem.id)}>
                      ✕
                    </DeleteButton>
                  </FileItem>
                ))}
              </FileList>
            )}
          </div>

          {userRole === 'TEACHER' && (
            <CreatorSection>
              <SectionTitle>만든 사람</SectionTitle>
              {isLoadingUsers ? (
                <p>사용자 목록을 불러오는 중입니다...</p>
              ) : usersError ? (
                <div>
                  <p style={{ color: 'red' }}>{usersError}</p>
                  <button 
                    onClick={fetchUsers}
                    style={{ 
                      marginTop: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    다시 시도
                  </button>
                </div>
              ) : (
                <CreatorRow>
                  <Select 
                    value={selectedCreator} 
                    onChange={handleCreatorChange}
                  >
                    <option value="">선택해주세요</option>
                    {users.slice(0, 10).map(user => (
                      <option key={user.userId} value={user.userId}>
                        {user.userName}({user.loginId})
                      </option>
                    ))}
                  </Select>
                  <SearchButton onClick={openUserSearchModal}>
                    🔍 검색
                  </SearchButton>
                </CreatorRow>
              )}
              
              <div style={{ marginTop: 'var(--spacing-medium)' }}>
                <SectionTitle>지역</SectionTitle>
                <Input
                  type="text"
                  placeholder="지역을 입력해주세요"
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                />
              </div>
            </CreatorSection>
          )}

          <UploadButton 
            onClick={handleUpload}
            disabled={files.length === 0 || (userRole === 'TEACHER' && (!selectedCreator || !local.trim()))}
          >
            업로드
          </UploadButton>
        </Content>
      </MainContainer>

      {/* 사용자 검색 모달 */}
      {isModalOpen && (
        <ModalOverlay onClick={closeUserSearchModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>사용자 검색</ModalTitle>
              <CloseButton onClick={closeUserSearchModal}>×</CloseButton>
            </ModalHeader>
            
            <SearchInput
              type="text"
              placeholder="사용자명 또는 로그인 ID로 검색"
              value={searchTerm}
              onChange={handleSearchInput}
            />
            
            <UserList>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <UserItem key={user.userId} onClick={() => selectUserFromModal(user)}>
                    <UserName>{user.userName}</UserName>
                    <UserId>{user.loginId}</UserId>
                  </UserItem>
                ))
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: 'var(--spacing-medium)',
                  color: 'var(--color-text-secondary)'
                }}>
                  검색 결과가 없습니다.
                </div>
              )}
            </UserList>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}

export default UploadFilePage;
