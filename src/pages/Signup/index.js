import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { signup, checkDuplicateId } from '../../apis/auth';

const MainContainer = styled.div`
  width: 100%;
  min-width: var(--min-viewport-width);
  max-width: var(--max-viewport-width);
  min-height: calc(100vh - 60px);  // 전체 높이에서 헤더 높이만큼 빼기
  margin: 0 auto;
  padding-top: var(--spacing-medium);  // 상단 여백 축소
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
`;

const SignupContainer = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding: var(--spacing-medium);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-small);
`;

const Label = styled.label`
  display: block;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-small);
`;

const Input = styled.input`
  width: 100%;
  height: 60px;
  border: 1px solid rgba(26, 26, 26, 0.23);
  border-radius: 8px;
  padding: 0 16px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  color: var(--color-text-primary);
  box-sizing: border-box;
  
  &::placeholder {
    color: var(--color-text-secondary);
  }

  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
  margin: 0 0 var(--spacing-small) 0;
  box-sizing: border-box;
`;

const IdInputGroup = styled(InputGroup)`
  display: flex;
  gap: var(--spacing-small);
  margin: 0;
`;

const IdInput = styled(Input)`
  flex: 1;
`;

const CheckButton = styled.button`
  width: 100px;
  height: 60px;
  border: 1px solid var(--color-accent);
  border-radius: 8px;
  background-color: ${({ isDuplicate }) => isDuplicate ? '#FF3B30' : '#fff'};
  color: ${({ isDuplicate }) => isDuplicate ? '#fff' : 'var(--color-accent)'};
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ isDuplicate }) => isDuplicate ? '#FF3B30' : 'var(--color-accent)'};
    color: #fff;
  }
`;

const ErrorMessage = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  color: #FF3B30;
  margin: 4px 0 0 0;
  padding: 0;
`;

const TermsContainer = styled.div`
  width: 100%;
  margin-top: var(--spacing-medium);
`;

const TermsTitle = styled.h3`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-small);
`;

const TermsCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
  margin-bottom: var(--spacing-small);
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  margin: 0;
`;

const TermsLabel = styled.label`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-normal);
  color: var(--color-text-primary);
`;

const SignupButton = styled.button`
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
  margin-top: var(--spacing-medium);
`;

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    realName: '',
    username: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const [isDuplicateId, setIsDuplicateId] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [terms, setTerms] = useState({
    service: false,
    privacy: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userId') {
      setIsIdChecked(false);  // 아이디 변경 시 중복체크 상태 초기화
      setIsDuplicateId(false);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIdCheck = async () => {
    if (!formData.username) {
      setError('아이디를 입력해주세요.');
      return;
    }

    const response = await checkDuplicateId(formData.username);
    setIsDuplicateId(!response.available);
    setIsIdChecked(true);
    setError(response.available ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.');
  };

  const handleTermsChange = (e) => {
    const { name, checked } = e.target;
    setTerms(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.realName || !formData.username || !formData.password) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isIdChecked || isDuplicateId) {
      setError('아이디 중복 확인이 필요합니다.');
      return;
    }

    if (!terms.service || !terms.privacy) {
      setError('필수 약관에 동의해주세요.');
      return;
    }

    try {
      await signup({
        userName: formData.username,
        password: formData.password,
        realName: formData.realName
      });
      
      // 회원가입 성공 시 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <Header type="login" title="회원가입" />
      <MainContainer>
        <SignupContainer>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>이름</Label>
              <Input
                type="text"
                name="realName"
                placeholder="이름을 입력해주세요"
                value={formData.realName}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Label>아이디</Label>
              <IdInputGroup>
                <IdInput
                  type="text"
                  name="username"
                  placeholder="아이디를 입력해주세요"
                  value={formData.username}
                  onChange={handleChange}
                />
                <CheckButton 
                  type="button"
                  onClick={handleIdCheck}
                  isDuplicate={isDuplicateId && isIdChecked}
                >
                  중복확인
                </CheckButton>
              </IdInputGroup>
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </InputGroup>
            <InputGroup>
              <Label>비밀번호</Label>
              <Input
                type="password"
                name="password"
                placeholder="비밀번호를 입력해주세요"
                value={formData.password}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Label>비밀번호 확인</Label>
              <Input
                type="password"
                name="passwordConfirm"
                placeholder="비밀번호를 다시 입력해주세요"
                value={formData.passwordConfirm}
                onChange={handleChange}
              />
            </InputGroup>
            <TermsContainer>
              <TermsTitle>약관동의</TermsTitle>
              <TermsCheckbox>
                <Checkbox
                  type="checkbox"
                  name="service"
                  checked={terms.service}
                  onChange={handleTermsChange}
                />
                <TermsLabel>서비스 이용약관 동의 (필수)</TermsLabel>
              </TermsCheckbox>
              <TermsCheckbox>
                <Checkbox
                  type="checkbox"
                  name="privacy"
                  checked={terms.privacy}
                  onChange={handleTermsChange}
                />
                <TermsLabel>개인정보 처리방침 동의 (필수)</TermsLabel>
              </TermsCheckbox>
            </TermsContainer>
            <SignupButton type="submit">가입하기</SignupButton>
          </Form>
        </SignupContainer>
      </MainContainer>
    </>
  );
}

export default SignupPage;