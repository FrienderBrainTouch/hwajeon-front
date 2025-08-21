const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 서비스 워커 파일 경로
const swPath = path.join(__dirname, '../public/sw.js');

// Git 커밋 해시 기반 버전 생성
function generateGitVersion() {
  try {
    // 현재 Git 커밋 해시 가져오기 (짧은 버전)
    const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    
    // 브랜치 이름 가져오기
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    
    // 현재 시간
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    
    return `hwajeon-music-${branch}-${commitHash}-${dateStr}`;
  } catch (error) {
    console.warn('⚠️ Git 정보를 가져올 수 없어 타임스탬프 기반 버전을 사용합니다.');
    const now = new Date();
    const timestamp = now.getTime();
    return `hwajeon-music-${timestamp}`;
  }
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
      const newVersion = generateGitVersion();
      
      // 현재 타임스탬프
      const timestamp = new Date().toISOString();
      
      // 버전 교체
      content = content.replace(versionRegex, `const CACHE_NAME = '${newVersion}';`);
      
      // 파일 상단에 타임스탬프 주석 추가/업데이트
      const timestampComment = `// Last updated: ${timestamp}\n`;
      
      // 기존 타임스탬프 주석이 있는지 확인하고 교체
      if (content.includes('// Last updated:')) {
        content = content.replace(/\/\/ Last updated: .*\n/, timestampComment);
      } else {
        // 파일 맨 위에 타임스탬프 주석 추가
        content = timestampComment + content;
      }
      
      // 파일에 쓰기
      fs.writeFileSync(swPath, content, 'utf8');
      
      console.log(`✅ Service Worker 버전 업데이트 완료:`);
      console.log(`   이전: ${oldVersion}`);
      console.log(`   새로운: ${newVersion}`);
      console.log(`   타임스탬프: ${timestamp}`);
      
      // Git 정보 출력
      try {
        const commitMessage = execSync('git log -1 --pretty=format:"%s"', { encoding: 'utf8' }).trim();
        console.log(`📝 최근 커밋: ${commitMessage}`);
      } catch (e) {
        // Git 정보가 없어도 무시
      }
      
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
