import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainPage from './pages/Main';
import SearchPage from './pages/Search';
import PlaylistPage from './pages/Playlist';
import PlayHistoryPage from './pages/Playlist/PlayHistory';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import SearchResultPage from './pages/SearchResult';
import MusicDetailPage from './pages/MusicDetail';
import MyPage from './pages/MyPage';
import PasswordChangePage from './pages/MyPage/PasswordChange';
import WithdrawPage from './pages/MyPage/Withdraw';
import UploadPage from './pages/MyPage/Upload';
import UploadFilePage from './pages/MyPage/UploadFile';
import UsersPage from './pages/Users';
import FilesPage from './pages/Files';
import PrivateRoute from './components/common/PrivateRoute';
import TeacherRoute from './components/common/TeacherRoute';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { MusicProvider } from './context/MusicContext';
import { AuthProvider } from './context/AuthContext';
import styled from '@emotion/styled';

const PageContainer = styled.div`
  width: 100%;
  max-width: var(--max-viewport-width);
  margin: 0 auto;
  padding-top: 60px;  // 헤더 높이만큼 상단 여백
  padding-bottom: 70px;  // 푸터 높이만큼 하단 여백
  
  @media (max-width: 480px) {
    padding-left: var(--spacing-small);
    padding-right: var(--spacing-small);
    padding-bottom: 60px;  // 모바일에서 푸터 높이만큼 하단 여백
  }
`;

// Search 페이지용 컨테이너 (헤더가 없으므로 상단 패딩 제거)
const SearchPageContainer = styled.div`
  width: 100%;
  max-width: var(--max-viewport-width);
  margin: 0 auto;
  padding-bottom: 70px;  // 푸터 높이만큼 하단 여백만
  
  @media (max-width: 480px) {
    padding-left: var(--spacing-small);
    padding-right: var(--spacing-small);
    padding-bottom: 60px;  // 모바일에서 푸터 높이만큼 하단 여백
  }
`;

// 헤더와 푸터를 조건부로 렌더링하는 컴포넌트
const AppContent = () => {
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const isSearchResultPage = location.pathname === '/search/result';
  const isMusicDetailPage = location.pathname === '/music/detail';
  
  // 커스텀 헤더를 사용하는 페이지들
  const hasCustomHeader = isSearchPage || isSearchResultPage || isMusicDetailPage;
  
  // 푸터를 숨기는 페이지들 (MusicDetail은 자체 재생 컨트롤이 있음)
  const hideFooter = isMusicDetailPage;
  
  return (
    <>
      {!hasCustomHeader && <Header />}
      {hasCustomHeader ? (
        <SearchPageContainer>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/search/result" element={<SearchResultPage />} />
            <Route path="/music/detail" element={<MusicDetailPage />} />
          </Routes>
        </SearchPageContainer>
      ) : (
        <PageContainer>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/playlist" element={<PlaylistPage />} />
            <Route path="/playlist/my-music" element={<PlaylistPage />} />
            <Route path="/playlist/recent-music" element={<PlaylistPage />} />
            <Route path="/playlist/favorites" element={<PlaylistPage />} /> 
            <Route path="/playlist/play-history" element={<PlayHistoryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* 보호된 라우트들 */}
            <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
            <Route path="/mypage/password" element={<PrivateRoute><PasswordChangePage /></PrivateRoute>} />
            <Route path="/mypage/withdraw" element={<PrivateRoute><WithdrawPage /></PrivateRoute>} />
            <Route path="/mypage/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
            <Route path="/mypage/upload-file" element={<PrivateRoute><UploadFilePage /></PrivateRoute>} />
            <Route path="/users" element={<TeacherRoute><UsersPage /></TeacherRoute>} />
            <Route path="/files" element={<TeacherRoute><FilesPage /></TeacherRoute>} />
          </Routes>
        </PageContainer>
      )}
      {!hideFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <Router>
          <AppContent />
        </Router>
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;