import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function AdminRoute({ children }) {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const location = useLocation();

  console.log('=== AdminRoute 체크 ===');
  console.log('현재 경로:', location.pathname);
  console.log('인증 상태:', isAuthenticated);
  console.log('로딩 상태:', isLoading);
  console.log('사용자 역할:', userRole);

  // 인증 정보가 아직 로딩 중인 경우
  if (isLoading) {
    console.log('AdminRoute: 로딩 중...');
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
    console.log('AdminRoute: 인증되지 않음 - /admin/login으로 리다이렉트');
    // Admin 페이지 접근 시 /admin/login으로 리다이렉트
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // TEACHER 또는 ADMIN 역할만 접근 가능
  if (userRole !== 'TEACHER' && userRole !== 'ADMIN') {
    console.log('AdminRoute: 권한 없음 - /admin/login으로 리다이렉트');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log('AdminRoute: 접근 허용');
  return children;
}

export default AdminRoute;
