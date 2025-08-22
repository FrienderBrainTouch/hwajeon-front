import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';

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

const AdminInfoSection = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AdminInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Greeting = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 24px;
  font-weight: 350;
  color: var(--color-text-primary);
  letter-spacing: -2%;
`;

const AdminTitle = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 28px;
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: -2%;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 16px;
  margin-top: 30px;
`;

const UploadSection = styled.div`
  width: 100%;
  height: 180px;
  background: rgba(233, 233, 233, 0.4);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const ManageSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const ManageBox = styled.div`
  height: 180px;
  background: rgba(30, 136, 229, 0.1);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  box-shadow: 0px 0px 3px rgba(30, 136, 229, 0.1);
  cursor: pointer;
`;

const SectionIcon = styled.img`
  width: 60px;
  height: 60px;
`;

const SectionTitle = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 24px;
  font-weight: 500;
  color: #000000;
  letter-spacing: -2%;
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #f5f5f5;
  color: var(--color-text-primary);
  font-size: 16px;
  font-weight: 500;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  &:hover {
    background-color: #e8e8e8;
  }
`;

function AdminPage() {
  const navigate = useNavigate();
  const { userName, logout } = useAuth();

  const handleUploadClick = () => {
    navigate('/admin/upload-file');
  };

  const handleFileManageClick = () => {
    navigate('/admin/files');
  };

  const handleUserManageClick = () => {
    navigate('/admin/users');
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      <Header type="admin" title="관리자 페이지" />
      <MainContainer>
        <Content>
          <AdminInfoSection>
            <AdminInfoWrapper>
              <Greeting>안녕하세요.</Greeting>
              <AdminTitle>
                {userName ? `${userName}님` : '관리자님'}
              </AdminTitle>
            </AdminInfoWrapper>
          </AdminInfoSection>

          <MenuGrid>
            <UploadSection onClick={handleUploadClick}>
              <SectionIcon src="/icons/file_upload.svg" alt="파일 업로드" />
              <SectionTitle>파일 업로드</SectionTitle>
            </UploadSection>

            <ManageSection>
              <ManageBox onClick={handleUserManageClick}>
                <SectionIcon src="/icons/file_manage_user.svg" alt="회원 관리" />
                <SectionTitle>회원 관리</SectionTitle>
              </ManageBox>
              <ManageBox onClick={handleFileManageClick}>
                <SectionIcon src="/icons/file_manage.svg" alt="파일 관리" />
                <SectionTitle>파일 관리</SectionTitle>
              </ManageBox>
            </ManageSection>
          </MenuGrid>

          <LogoutButton onClick={handleLogout}>
            로그아웃
          </LogoutButton>
        </Content>
      </MainContainer>
    </>
  );
}

export default AdminPage;
