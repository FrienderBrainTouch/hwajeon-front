import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header';
import { useAuth } from '../../../context/AuthContext';

const Content = styled.div`
  padding-top: 60px;
  background-color: var(--color-background);
  min-height: 100vh;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding: 0 var(--spacing-medium);
`;





const WarningBox = styled.div`
  background-color: #F8F8F8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  
  &:first-of-type {
    margin-top: 16px;
  }
`;

const WarningBoxTitle = styled.h3`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
`;

const WarningBoxText = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-small);
  margin-top: 40px;
`;

const Button = styled.button`
  flex: 1;
  height: 60px;
  border-radius: 8px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-subtitle);
  font-weight: 500;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background-color: #F8F8F8;
  border: none;
  color: var(--color-text-primary);
`;

const WithdrawButton = styled(Button)`
  background-color: var(--color-accent);
  border: none;
  color: #fff;
`;

function WithdrawPage() {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 회원 탈퇴 API 직접 호출 (JSON 파싱 에러 방지)
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://api.100youth.kr'}/api/users/${Number(userId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('사용자 삭제에 실패했습니다.');
      }
      
      // 탈퇴 성공 후 로컬 상태 정리
      console.log('탈퇴 성공 - 로컬 상태 정리 시작');
      
      // localStorage와 sessionStorage 정리
      localStorage.clear();
      sessionStorage.clear();
      
      // 탈퇴 성공 메시지 표시
      alert('회원탈퇴가 완료되었습니다.');
      
      // 강제로 로그인 페이지로 이동 (새로고침 포함)
      window.location.href = '/login';
      
    } catch (err) {
      console.error('Withdraw error:', err);
      alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <Header type="login" title="회원탈퇴" onBack={() => navigate('/mypage')} />
      <Content>
          <WarningBox>
          <WarningBoxTitle>내가 담아둔 음악이 사라져요</WarningBoxTitle>
          <WarningBoxText>
            그동안 감상하신 음악 목록과 '즐겨찾기'한 곡들이 모두 사라집니다.
          </WarningBoxText>
          </WarningBox>

          <WarningBox>
            <WarningBoxTitle>다시 들으시려면 처음부터 시작해야 해요</WarningBoxTitle>
            <WarningBoxText>
              즐겨듣던 곡들을 다시 찾으려면 처음부터 다시 등록해야 합니다
            </WarningBoxText>
          </WarningBox>

          <WarningBox>
            <WarningBoxTitle>마음이 바뀌셨다면 로그아웃도 가능해요</WarningBoxTitle>
            <WarningBoxText>
              탈퇴가 아니더라도 잠시 로그아웃하실 수 있어요
            </WarningBoxText>
          </WarningBox>
          <form onSubmit={handleSubmit}>
            <ButtonGroup>
              <CancelButton type="button" onClick={() => navigate('/mypage')}>
                취소
              </CancelButton>
              <WithdrawButton type="submit">
                탈퇴하기
              </WithdrawButton>
            </ButtonGroup>
          </form>
      </Content>
    </>
  );
}

export default WithdrawPage;