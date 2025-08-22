import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as loginApi } from '../../apis/auth';
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

const Title = styled.h1`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 28px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 40px 0 20px 0;
  text-align: center;
`;

const Subtitle = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 40px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const Input = styled.input`
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Noto Sans KR', sans-serif;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  background-color: #1e88e5;
  color: white;
  font-size: 16px;
  font-weight: 500;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #1565c0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuthToken } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // 입력 시 에러 메시지 제거
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginApi(formData.username, formData.password);
      
      if (response && response.accessToken) {
        // 로그인 성공 시 토큰을 AuthContext에 저장
        setAuthToken(response.accessToken);
        
        // 원래 가려던 페이지로 이동하거나 admin 메인 페이지로 이동
        const from = location.state?.from?.pathname || '/admin';
        navigate(from);
      } else {
        setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header type="admin" title="관리자 로그인" />
      <MainContainer>
        <Content>
          <Title>관리자 로그인</Title>
          <Subtitle>PC에서 관리자 페이지에 접속하려면 로그인이 필요합니다.</Subtitle>
          
          <LoginForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username">아이디</Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="관리자 아이디를 입력하세요"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <LoginButton type="submit" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </LoginButton>
          </LoginForm>
        </Content>
      </MainContainer>
    </>
  );
}

export default AdminLoginPage;
