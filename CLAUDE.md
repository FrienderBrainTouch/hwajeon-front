# CLAUDE.md — hwajeon-front (청춘백년 음악 웹, CRA/React)

전체 구성·계정·배포 기준 문서는 `통합_운영_문서.md`(4개 저장소 동일 사본). 비밀번호·키 원문은 저장소에 쓰지 않는다.
청춘백년 안드로이드 앱(`bublle-wrap-build`, TWA)은 이 웹(`https://music.100youth.kr`)을 그대로 띄운다. **웹 배포만으로 앱 화면도 바뀐다.**

## 작업 후 사용자에게 반드시 안내할 것
- **`prod` 브랜치에 push하면 바로 운영과 앱에 자동 배포된다.** push 전에 이 점을 사용자에게 알리고 확인받는다.
- 코드를 수정해 push했다면 답변 마지막에 아래 확인 절차를 안내한다:
  1. GitHub `hwajeon-front` → Actions가 초록색인지 (3~5분)
  2. PuTTY → `118.219.233.155` (root, 호스트명 `hwajeon6755`)에서
     `ls -la --time-style=+"%F %T" /var/www/music_app | head -5` → 파일 시각이 방금 시각
  3. `curl -s -o /dev/null -w "%{http_code}\n" https://music.100youth.kr/` → 200
     `curl -s -o /dev/null -w "%{http_code}\n" https://music.100youth.kr/.well-known/assetlinks.json` → 200
  4. 브라우저 강력 새로고침, 앱은 완전히 종료 후 재실행해서 확인
- 백엔드 API를 함께 바꿨다면 `hawjeon`의 `./deploy.sh` 절차도 같이 안내한다 (`hawjeon/CLAUDE.md`).

## 알아둘 것
- `public/.well-known/assetlinks.json`의 지문 2개(업로드 키 `DF:C9…`, 앱 서명 키 `A6:07…`)는 지우지 않는다. 지우면 앱 상단에 주소창이 생긴다.
- 반영 여부를 번들에서 한글로 검색하면 인코딩 때문에 안 잡힌다. `/static/js/main.*.js.map`(소스맵)에서 확인한다.
- 회원 탈퇴 화면이 `DELETE /api/users/{id}`를 호출하지만 백엔드에 없다 (Google Play 계정 삭제 정책 위험). 관련 작업 시 백엔드와 함께 처리.
- 앱 자체(버전·targetSdk·매니페스트)를 바꿔야 하면 `bublle-wrap-build`에서 작업한다.
- `통합_운영_문서.md`를 고치면 `hawjeon`, `bublle-wrap-build`, `hwajeon-main-web`의 사본도 같이 고친다.
