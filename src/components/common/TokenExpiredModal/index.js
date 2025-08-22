import React from 'react';
import './styles.css';

const TokenExpiredModal = ({ isVisible, onClose }) => {
  const handleLoginRedirect = () => {
    // 모달 닫기
    onClose();
    // 로그인 페이지로 이동
    window.location.href = '/login';
  };

  if (!isVisible) return null;

  return (
    <div className="token-expired-modal-overlay">
      <div className="token-expired-modal">
        <div className="modal-header">
          <h3>세션이 만료되었습니다</h3>
        </div>
        <div className="modal-body">
          <p>보안을 위해 자동으로 로그아웃되었습니다.</p>
          <p>다시 로그인해 주세요.</p>
        </div>
        <div className="modal-footer">
          <button 
            className="login-button"
            onClick={handleLoginRedirect}
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenExpiredModal;
