import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('=== PrivateRoute 체크 ===');
  console.log('현재 경로:', location.pathname);
  console.log('인증 상태:', isAuthenticated);
  console.log('로딩 상태:', isLoading);

  // 인증 정보가 아직 로딩 중인 경우
  if (isLoading) {
    console.log('PrivateRoute: 로딩 중...');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        인증 정보를 확인하는 중...
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('PrivateRoute: 인증되지 않음 - /login으로 리다이렉트');
    // 현재 시도한 경로를 state로 전달하여 로그인 후 원래 가려던 페이지로 이동할 수 있게 함
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('PrivateRoute: 접근 허용');
  return children;
}

export default PrivateRoute;