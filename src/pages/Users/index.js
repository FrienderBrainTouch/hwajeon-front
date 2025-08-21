import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Header from '../../components/common/Header';
import { getAllUsers, updateUserName } from '../../apis/users';

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

const GuideText = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  color: #666;
  text-align: center;
  margin: 0 0 24px 0;
  line-height: 1.4;
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
    border-color: var(--color-primary);
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



const UserTable = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 16px;
  padding: 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 600;
  font-size: 14px;
  color: #666;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;



const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UserName = styled.span`
  font-weight: 500;
  color: var(--color-text-primary);
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
    border-color: var(--color-primary);
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


function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');

  // TeacherRoute에서 이미 권한을 체크하므로 여기서는 제거

  // API에서 사용자 데이터 가져오기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getAllUsers();
        setUsers(userData);
        setFilteredUsers(userData);
      } catch (error) {
        console.error('사용자 데이터를 가져오는데 실패했습니다:', error);
        // 에러 처리 (예: 토큰 만료 등)
        if (error.message === 'TOKEN_EXPIRED') {
          // 토큰 만료 시 처리
          console.log('토큰이 만료되었습니다.');
        }
      }
    };

    fetchUsers();
  }, []);

  // 검색 필터링
  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.loginId.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
    
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const handleSearch = () => {
    // 검색 로직은 이미 useEffect에서 처리됨
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setNewName(user.userName);
    setShowModal(true);
  };

  const handleNameUpdate = async () => {
    if (!selectedUser || !newName.trim()) return;

    try {
      console.log('이름 변경 요청 시작:', selectedUser.userId, newName.trim());
      const result = await updateUserName(selectedUser.userId, newName.trim());
      console.log('이름 변경 성공:', result);
      
      // 로컬 상태 업데이트
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.userId === selectedUser.userId 
            ? { ...user, userName: newName.trim() }
            : user
        )
      );
      
      setFilteredUsers(prevUsers => 
        prevUsers.map(user => 
          user.userId === selectedUser.userId 
            ? { ...user, userName: newName.trim() }
            : user
        )
      );
      
      // 성공 메시지
      alert('이름이 성공적으로 변경되었습니다!');
      
      // 모달 닫기 및 상태 초기화
      setShowModal(false);
      setSelectedUser(null);
      setNewName('');
      
    } catch (error) {
      console.error('이름 변경 실패:', error);
      console.error('에러 상세:', error.message, error.stack);
      alert(`이름 변경에 실패했습니다: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setShowModal(false);
    setSelectedUser(null);
    setNewName('');
  };

  // TeacherRoute에서 이미 권한을 체크하므로 여기서는 제거

  return (
    <>
      <Header type="login" title="회원 관리" />
      <MainContainer>
        <Content>
          <PageTitle>회원 관리</PageTitle>
          
          <GuideText>
            사용자 이름을 클릭하시면 이름을 변경하실 수 있습니다.
          </GuideText>
          
          <SearchSection>
            <SearchInput
              type="text"
              placeholder="이름 또는 로그인 ID로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton onClick={handleSearch}>검색</SearchButton>
          </SearchSection>



          <UserTable>
            <TableHeader>
              <div>사용자 정보</div>
              <div>로그인 ID</div>
            </TableHeader>
            
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <TableRow 
                  key={user.userId}
                  onClick={() => handleUserSelect(user)}
                >
                  <UserInfo>
                    <UserName>{user.userName}</UserName>
                  </UserInfo>
                  
                  <div>{user.loginId}</div>
                </TableRow>
              ))
            ) : (
              <EmptyState>
                검색 결과가 없습니다.
              </EmptyState>
            )}
          </UserTable>


        </Content>
      </MainContainer>
      
      {/* 이름 변경 모달 */}
      {showModal && (
        <EditModal>
          <ModalContent>
            <ModalTitle>사용자 이름 변경</ModalTitle>
            <ModalInput
              type="text"
              placeholder="새로운 이름을 입력하세요"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
            <ModalButtons>
              <ModalButton variant="secondary" onClick={handleCancelEdit}>
                취소
              </ModalButton>
              <ModalButton onClick={handleNameUpdate}>
                확인
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </EditModal>
      )}
    </>
  );
}

export default UsersPage;
