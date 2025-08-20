import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function TeacherRoute({ children }) {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // 로그인하지 않은 경우 로그인 페이지로 이동
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userRole !== 'TEACHER') {
    // TEACHER 권한이 아닌 경우 업로드 페이지로 이동
    return <Navigate to="/mypage/upload" replace />;
  }

  return children;
}

export default TeacherRoute;
