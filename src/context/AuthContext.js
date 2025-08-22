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
  const [isTokenExpiredHandling, setIsTokenExpiredHandling] = useState(false); // 토큰 만료 처리 중 상태

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
    // 이미 토큰 만료 처리가 진행 중이면 중복 실행 방지
    if (isTokenExpiredHandling) {
      return;
    }

    // 로그인 페이지에 있을 때는 모달을 표시하지 않고 바로 로그아웃
    const isLoginPage = window.location.pathname === '/login' || window.location.pathname === '/admin/login';
    
    console.log('토큰 만료로 인한 자동 로그아웃을 실행합니다.');
    
    if (!isLoginPage) {
      setShowTokenExpiredModal(true);
      setIsTokenExpiredHandling(true);
      // 3초 타이머 제거 - 모달에서 바로 처리
    } else {
      // 로그인 페이지에 있을 때는 바로 로그아웃
      // logout 함수를 직접 호출하지 않고 로그아웃 로직을 여기에 작성
      const logoutImmediately = async () => {
        try {
          await logoutApi();
        } catch (error) {
          console.error('Logout API failed:', error);
        } finally {
          localStorage.clear();
          sessionStorage.clear();
          setToken(null);
          setIsAuthenticated(false);
          setUserRole(null);
          setUserName(null);
          setIsLoading(false);
          setShowTokenExpiredModal(false);
          setIsTokenExpiredHandling(false);
          
          const currentPath = window.location.pathname;
          const isAdminPage = currentPath.startsWith('/admin');
          const loginPath = isAdminPage ? '/admin/login' : '/login';
          window.location.href = loginPath;
        }
      };
      logoutImmediately();
    }
  }, [isTokenExpiredHandling]);

  // 토큰 저장 및 인증 상태 업데이트
  const login = (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
    setIsAuthenticated(true);
    setIsLoading(true);
    setIsTokenExpiredHandling(false); // 로그인 시 토큰 만료 처리 상태 초기화
    parseTokenAndSetUserInfo(accessToken);
  };

  // 토큰 제거 및 인증 상태 초기화
  const logout = async () => {
    console.log('=== AuthContext logout 함수 시작 ===');
    console.log('현재 경로:', window.location.pathname);
    console.log('현재 인증 상태:', isAuthenticated);
    console.log('현재 토큰:', token);
    
    try {
      console.log('백엔드 로그아웃 API 호출 시작');
      await logoutApi(); // 백엔드 로그아웃 API 호출
      console.log('백엔드 로그아웃 API 호출 성공');
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      console.log('=== 로컬 상태 정리 시작 ===');
      // 로컬 스토리지 및 세션 스토리지 초기화
      localStorage.clear(); // 모든 인증 관련 데이터 삭제
      sessionStorage.clear(); // 세션 데이터도 삭제
      
      // 상태 초기화
      setToken(null);
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName(null);
      setIsLoading(false);
      setShowTokenExpiredModal(false);
      setIsTokenExpiredHandling(false);

      console.log('=== 브라우저 히스토리 정리 시작 ===');
      
      // 브라우저 히스토리 완전 정리 (순차적으로 처리)
      setTimeout(() => {
        if (window.history && window.history.pushState) {
          // 현재 히스토리 길이 확인
          console.log('현재 히스토리 길이:', window.history.length);
          
          // 모든 히스토리를 정리하고 홈으로 교체
          window.history.replaceState(null, '', '/');
          
          // 뒤로가기/앞으로가기 버튼 비활성화
          window.onpopstate = function () {
            window.history.pushState(null, '', '/');
          };
          
          // 앞으로가기 방지
          window.onbeforeunload = function () {
            return null;
          };
        }

        console.log('=== 페이지 이동 준비 ===');
        // 현재 경로에 따라 적절한 로그인 페이지로 이동
        const currentPath = window.location.pathname;
        console.log('현재 경로:', currentPath);
        const isAdminPage = currentPath.startsWith('/admin');
        console.log('관리자 페이지 여부:', isAdminPage);
        const loginPath = isAdminPage ? '/admin/login' : '/login';
        console.log('이동할 로그인 경로:', loginPath);
        console.log('=== 페이지 이동 실행 ===');
        window.location.href = loginPath;
      }, 100); // 100ms 지연으로 순차 처리
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
        onClose={() => {
          setShowTokenExpiredModal(false);
          setIsTokenExpiredHandling(false);
          // 모달이 닫힐 때 로그아웃 처리
          logout();
        }}
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