const fs = require('fs');
const path = require('path');

// 서비스 워커 파일 경로
const swPath = path.join(__dirname, '../public/sw.js');

// 현재 시간을 기반으로 한 고유한 버전 생성
function generateVersion() {
  const now = new Date();
  const timestamp = now.getTime();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
  
  return `hwajeon-music-${dateStr}-${timeStr}`;
}

// 서비스 워커 파일 읽기 및 버전 업데이트
function updateServiceWorkerVersion() {
  try {
    // 파일 읽기
    let content = fs.readFileSync(swPath, 'utf8');
    
    // 현재 버전 찾기
    const versionRegex = /const CACHE_NAME = '([^']+)';/;
    const match = content.match(versionRegex);
    
    if (match) {
      const oldVersion = match[1];
      const newVersion = generateVersion();
      
      // 버전 교체
      content = content.replace(versionRegex, `const CACHE_NAME = '${newVersion}';`);
      
      // 파일에 쓰기
      fs.writeFileSync(swPath, content, 'utf8');
      
      console.log(`✅ Service Worker 버전 업데이트 완료:`);
      console.log(`   이전: ${oldVersion}`);
      console.log(`   새로운: ${newVersion}`);
      
      // 배포 정보 로그
      console.log(`📦 배포 준비 완료 - ${new Date().toLocaleString('ko-KR')}`);
    } else {
      console.error('❌ CACHE_NAME을 찾을 수 없습니다.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ 서비스 워커 버전 업데이트 실패:', error.message);
    process.exit(1);
  }
}

// 스크립트 실행
updateServiceWorkerVersion();
