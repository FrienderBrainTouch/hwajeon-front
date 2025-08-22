import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function AdminRoute({ children }) {
  const { isAuthenticated, isLoading, userRole } = useAuth();
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
    // Admin 페이지 접근 시 /admin/login으로 리다이렉트
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // TEACHER 또는 ADMIN 역할만 접근 가능
  if (userRole !== 'TEACHER' && userRole !== 'ADMIN') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

export default AdminRoute;
