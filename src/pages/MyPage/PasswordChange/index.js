import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header';
import { useAuth } from '../../../context/AuthContext';
import { changePassword } from '../../../apis/auth';

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

const GuideText = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 20px;
  color: var(--color-text-primary);
  margin: var(--spacing-large) 0 var(--spacing-medium);
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-medium);
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InputLabel = styled.label`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  color: var(--color-text-primary);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  height: 60px;
  border: 1px solid rgba(26, 26, 26, 0.23);
  border-radius: 8px;
  padding: 0 16px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 20px;
  color: #1A1A1A;
  box-sizing: border-box;
  
  &::placeholder {
    color: rgba(0, 0, 0, 0.6);
  }

  &:focus {
    outline: none;
    border-color: #1E88E5;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 60px;
  background-color: ${props => props.disabled ? '#CCCCCC' : 'var(--color-accent)'};
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-subtitle);
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-top: var(--spacing-small);
  box-sizing: border-box;
  opacity: ${props => props.disabled ? 0.7 : 1};
`;

function PasswordChangePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const isPasswordMatch = formData.newPassword && formData.newPassword === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPasswordMatch) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );
      
      // 비밀번호 변경 성공 시 로그아웃
      logout();
      alert('비밀번호가 변경되었습니다. 새로운 비밀번호로 다시 로그인해주세요.');
      navigate('/login');
    } catch (err) {
      setError('비밀번호 변경에 실패했습니다.');
      console.error('Password change error:', err);
    }
  };

  return (
    <>
      <Header type="login" title="비밀번호 변경" onBack={() => navigate('/mypage')} />
      <MainContainer>
        <Content>
          <GuideText>변경하실 비밀번호를 입력해주세요.</GuideText>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <InputLabel>현재 비밀번호</InputLabel>
              <Input
                type="password"
                name="oldPassword"
                placeholder="입력"
                value={formData.oldPassword}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <InputLabel>새로운 비밀번호</InputLabel>
              <Input
                type="password"
                name="newPassword"
                placeholder="입력"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <InputLabel>비밀번호 확인</InputLabel>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="입력"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </InputGroup>
            <SubmitButton type="submit" disabled={!isPasswordMatch}>변경하기</SubmitButton>
          </Form>
        </Content>
      </MainContainer>
    </>
  );
}

export default PasswordChangePage;