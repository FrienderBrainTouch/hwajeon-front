import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/common/Header';

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
  flex-direction: column;
  gap: 16px;
`;

const UserInfoWrapper = styled.div`
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

const UserName = styled.span`
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
  background: ${props => props.isTeacher ? 'rgba(30, 136, 229, 0.1)' : 'rgba(30, 136, 229, 0.05)'};
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

function UploadPage() {
  const navigate = useNavigate();
  const { userRole, userName } = useAuth();
  const isTeacher = userRole === 'TEACHER';

  const handleUploadClick = () => {
    navigate('/mypage/upload-file');
  };

  const handleFileManageClick = () => {
    navigate('/files');
  };

  const handleUserManageClick = () => {
    if (isTeacher) {
      navigate('/users');
    }
  };

  return (
    <>
      <Header type="login" title="음악 업로드" />
      <MainContainer>
        <Content>
          <UserInfoSection>
            <UserInfoWrapper>
              <Greeting>안녕하세요.</Greeting>
              <UserName>
                {userName ? `${userName}님` : `${isTeacher ? '선생님' : '사용자'}님`}
              </UserName>
            </UserInfoWrapper>
          </UserInfoSection>

          <MenuGrid>
            <UploadSection onClick={handleUploadClick}>
              <SectionIcon src="/icons/file_upload.svg" alt="파일 업로드" />
              <SectionTitle>파일 업로드</SectionTitle>
            </UploadSection>

            {isTeacher && (
              <ManageSection>
                <ManageBox onClick={handleUserManageClick} isTeacher={true}>
                  <SectionIcon src="/icons/file_manage_user.svg" alt="회원 관리" />
                  <SectionTitle>회원 관리</SectionTitle>
                </ManageBox>
                <ManageBox onClick={handleFileManageClick} isTeacher={true}>
                  <SectionIcon src="/icons/file_manage.svg" alt="파일 관리" />
                  <SectionTitle>파일 관리</SectionTitle>
                </ManageBox>
              </ManageSection>
            )}
          </MenuGrid>
        </Content>
      </MainContainer>
    </>
  );
}

export default UploadPage;