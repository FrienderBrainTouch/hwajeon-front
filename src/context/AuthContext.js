import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { logout as logoutApi } from '../apis/auth';
import { setTokenExpiredCallback } from '../apis/config';
import TokenExpiredModal from '../components/common/TokenExpiredModal';

const AuthContext = createContext();

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [showTokenExpiredModal, setShowTokenExpiredModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  // 토큰 파싱 및 사용자 정보 설정 함수
  const parseTokenAndSetUserInfo = useCallback((accessToken) => {
    if (!accessToken) {
      setUserRole(null);
      setUserName(null);
      setIsLoading(false);
      return;
    }

    const decoded = parseJwt(accessToken);
    if (decoded) {
      if (decoded.role) {
        setUserRole(decoded.role);
      }
      if (decoded.realName || decoded.username) {
        setUserName(decoded.realName || decoded.username);
      }
    }
    setIsLoading(false);
  }, []);

  // 토큰 만료 시 자동 로그아웃 처리
  const handleTokenExpired = useCallback(() => {
    console.log('토큰 만료로 인한 자동 로그아웃을 실행합니다.');
    setShowTokenExpiredModal(true);
    
    // 3초 후 자동으로 로그아웃 실행
    setTimeout(() => {
      logout();
    }, 3000);
  }, []);

  // 토큰 저장 및 인증 상태 업데이트
  const login = (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
    setIsAuthenticated(true);
    setIsLoading(true);
    parseTokenAndSetUserInfo(accessToken);
  };

  // 토큰 제거 및 인증 상태 초기화
  const logout = async () => {
    try {
      await logoutApi(); // 백엔드 로그아웃 API 호출
      
      // 로컬 스토리지 초기화
      localStorage.clear(); // 모든 인증 관련 데이터 삭제
      
      // 상태 초기화
      setToken(null);
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName(null);
      setIsLoading(false);

      // 브라우저 캐시 초기화 및 뒤로가기 방지
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', window.location.href);
        window.onpopstate = function () {
          window.history.go(1);
        };
      }

      // 로그인 페이지로 강제 이동
      window.location.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // 에러가 발생해도 로컬의 인증 상태는 초기화
      localStorage.clear();
      setToken(null);
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName(null);
      setIsLoading(false);
      window.location.replace('/login');
    }
  };

  // 토큰이 있는지 확인
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      parseTokenAndSetUserInfo(storedToken);
    } else {
      setIsLoading(false);
    }
  }, [parseTokenAndSetUserInfo]);

  // 토큰 만료 콜백 설정
  useEffect(() => {
    setTokenExpiredCallback(handleTokenExpired);
  }, [handleTokenExpired]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        userRole,
        userName,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
      <TokenExpiredModal 
        isVisible={showTokenExpiredModal}
        onClose={() => setShowTokenExpiredModal(false)}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};