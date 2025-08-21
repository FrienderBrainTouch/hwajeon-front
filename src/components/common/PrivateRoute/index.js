import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 인증 정보가 아직 로딩 중인 경우
  if (isLoading) {
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
    // 현재 시도한 경로를 state로 전달하여 로그인 후 원래 가려던 페이지로 이동할 수 있게 함
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute;