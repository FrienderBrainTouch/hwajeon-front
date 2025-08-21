import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function TeacherRoute({ children }) {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // 로그인하지 않은 경우 로그인 페이지로 이동
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

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
        권한을 확인하는 중...
      </div>
    );
  }

  // userRole이 아직 로딩 중인 경우 (null 또는 undefined)
  if (userRole === null || userRole === undefined) {
    // 로딩 상태를 표시하거나 잠시 대기
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        권한을 확인하는 중...
      </div>
    );
  }

  if (userRole !== 'TEACHER') {
    // TEACHER 권한이 아닌 경우 업로드 페이지로 이동
    return <Navigate to="/mypage/upload" replace />;
  }

  return children;
}

export default TeacherRoute;
