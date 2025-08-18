import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';
import { login as loginApi } from '../../apis/auth';

const MainContainer = styled.div`
  width: 100%;
  min-width: var(--min-viewport-width);
  max-width: var(--max-viewport-width);
  min-height: 100vh;
  margin: 0 auto;
  padding-top: 60px;  // 헤더 높이만큼
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding: var(--spacing-large) var(--spacing-medium);
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 480px) {
    padding: var(--spacing-medium);
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-small);
  margin-top: var(--spacing-large);
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
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

const LoginButton = styled.button`
  width: 100%;
  height: 60px;
  background-color: var(--color-accent);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-subtitle);
  font-weight: 500;
  cursor: pointer;
  margin-top: var(--spacing-small);
  box-sizing: border-box;
`;

const SignupLink = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-small);
  margin-top: var(--spacing-medium);  // spacing-large에서 spacing-medium으로 변경
  cursor: pointer;
`;



const SignupText = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-subtitle);
  color: var(--color-text-primary);
`;

const NoticeContainer = styled.div`
  width: 100%;
  padding: var(--spacing-medium);
  margin-top: var(--spacing-large);
  display: flex;
  justify-content: center;
`;

const Notice = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  color: var(--color-text-secondary);
  line-height: 1.4;
  letter-spacing: -0.02em;
  margin: 0;
  padding: 0 var(--spacing-medium);
  text-align: center;
  max-width: 376px;
`;

const ErrorMessage = styled.div`
  width: 100%;
  padding: var(--spacing-medium);
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  color: #c62828;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  text-align: center;
  margin-bottom: var(--spacing-medium);
  display: ${props => props.show ? 'block' : 'none'};
`;

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await loginApi(formData.username, formData.password);
      login(accessToken); // JWT 토큰 저장
      
      // 이전에 접근하려던 페이지가 있으면 그곳으로 이동, 없으면 메인 페이지로 이동
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      
      // 백엔드 응답 상태에 따른 에러 메시지 설정
      if (err.response) {
        const { status } = err.response;
        if (status === 400) {
          setError('아이디나 비밀번호를 다시 한번 확인해주세요.');
        } else if (status === 401) {
          setError('인증에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
        } else if (status === 500) {
          setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else {
          setError('로그인에 실패했습니다. 다시 시도해주세요.');
        }
      } else if (err.request) {
        // 네트워크 오류
        setError('네트워크 연결을 확인해주세요.');
      } else {
        // 기타 오류
        setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      }
    }
  };

  return (
    <>
      <Header type="login" title="로그인/회원가입" />
      <MainContainer>
        <LoginContainer>
          <Form onSubmit={handleSubmit}>
            <ErrorMessage show={!!error}>
              {error}
            </ErrorMessage>
            <InputGroup>
              <Input
                type="text"
                name="username"
                placeholder="아이디"
                value={formData.username}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
              />
            </InputGroup>
            <LoginButton type="submit">저장 및 로그인</LoginButton>
          </Form>
          <SignupLink onClick={() => navigate('/signup')}>
            <SignupText>회원가입</SignupText>
          </SignupLink>
        </LoginContainer>
        <NoticeContainer>
          <Notice>
            로그인 후 자동으로 로그인 상태가 유지됩니다. 공용 기기 사용 시 [마이페이지]에서 로그아웃해 주세요.
          </Notice>
        </NoticeContainer>
      </MainContainer>
    </>
  );
}

export default LoginPage;