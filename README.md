# ✳ 모스라이트 마을 · Mosslight Village

**오늘은, 느긋하게.** 집과 숲, 작은 광장과 바다가 있는 오리지널 3D 섬 생활 웹앱입니다.

## 설치 없이 실행하기 (추천)

1. [실행용 다운로드](https://github.com/gang84444-ctrl/mosslight-village/releases/latest)에서 **mosslight-village-play.zip**을 받으세요.
2. 압축을 완전히 푼 다음 **mosslight-village-play.html**을 Chrome 또는 Edge로 여세요.
3. 인터넷 연결이나 Node.js 설치 없이 혼자 플레이할 수 있습니다. 개발용 `index.html`은 더블 클릭해서 실행하는 파일이 아닙니다.

글자만 나오거나 흰 화면이면 개발용 소스의 HTML만 열린 상태일 수 있습니다. 실행용 HTML에는 디자인과 3D 코드가 모두 포함됩니다. 설치 없이 웹에서 쓰려면 아래의 마을 플레이 링크를 사용하세요.
[마을 플레이](https://gang84444-ctrl.github.io/mosslight-village/) · [GitHub 저장소](https://github.com/gang84444-ctrl/mosslight-village)

동물의 숲에서 연상되는 편안한 일상을 참고하되 캐릭터·지형·가구는 코드로 직접 만든 독립적인 창작물입니다. 닌텐도와 관계가 없습니다.

## 시작하기

Node.js 22.12 이상(24 권장)을 설치하고 이 폴더에서 터미널을 열어 실행하세요.

```sh
npm ci
npm run dev
```

터미널에 표시되는 주소(보통 http://localhost:5173)를 브라우저로 엽니다. HTML 파일을 직접 더블 클릭하면 실행되지 않습니다.

### 친구와 같은 마을에서 만나기

```sh
npm run build
npm start
```

http://localhost:3000 에 접속하세요. 두 개의 탭을 열면 다른 여행자가 보이고 대화할 수 있습니다. 같은 와이파이의 기기에서는 서버 컴퓨터의 LAN IP와 3000번 포트를 사용합니다. 운영체제가 요청하면 사설 네트워크 접근을 허용합니다.

- 서버는 최대 40개 세션의 위치와 채팅을 공유합니다. 가구, 잎사귀, 수확, 미션은 각 브라우저의 개인 데이터입니다.
- 서버 재시작 시 접속자와 채팅은 초기화됩니다. 채팅 기록은 영구 저장하지 않습니다.
- 실시간 개발: 한 터미널에서 `npm start`, 다른 터미널에서 `npm run dev`를 실행하면 Vite가 API 요청을 3000번 서버로 전달합니다.
- 로그인·운영자 기능·영구 DB가 없는 소규모 체험용입니다. 일반 공개 서비스로 확장할 때는 인증, 저장소, 신고 및 운영 기능을 추가하세요.

## 무엇을 할 수 있나요?

| 기능 | 사용 방법 |
| --- | --- |
| 섬 산책 | WASD / 방향키 또는 빈 땅 클릭. 건물과 나무는 돌아서 가세요. 클릭 이동은 직선 이동입니다. |
| 시점 바꾸기 | 드래그로 회전, 휠 또는 두 손가락으로 확대/축소 |
| 주민 대화 | 모모·보리·루루 가까이에서 E 또는 모바일 상호작용 버튼 |
| 열매 수확 | 열매 나무 가까이에서 E. 잎사귀 25개 획득. 1분 후 재수확 |
| 마을 꾸미기 | 꾸미기 → 가구 선택 → 빈 땅 클릭. Esc로 취소 |
| 첫 방문 목표 | 주민 인사, 열매 3개, 가구 1개 → 잎사귀 100개 보상 |
| 내 모습 | 오른쪽 위 설정에서 이름과 옷 색 선택 |
| 낮과 밤 | 아래 낮 / 밤 버튼 |
| 사진 | 오른쪽 위 사진 버튼으로 UI 없는 PNG 저장 |
| 주머니 | 수확 개수와 잎사귀 확인 |
| 자동 저장 | 현재 브라우저의 localStorage. 브라우저 데이터를 지우면 초기화 |

모바일에서는 왼쪽 아래 방향 버튼을 사용합니다. WebGL을 지원하는 최신 브라우저가 필요합니다. 화면이 나타나지 않으면 하드웨어 가속 설정을 확인하세요.

## GitHub에 올리기

1. GitHub에서 새 빈 저장소를 만듭니다. 예: `mosslight-village`.
2. 이 프로젝트 폴더에서 아래 명령을 실행합니다. 주소의 `gang84444-ctrl`을 본인 계정으로 바꾸세요.

```sh
git init -b main
git add .
git commit -m "Create Mosslight 3D village"
git remote add origin https://github.com/gang84444-ctrl/mosslight-village.git
git push -u origin main
```

`node_modules`, `dist`, 환경변수 파일은 `.gitignore`로 제외됩니다. `package-lock.json`은 함께 올려야 같은 버전으로 설치됩니다.

### 무료 웹 주소로 공개하기 — GitHub Pages

1. GitHub 저장소 → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. 저장소의 **Actions → Publish village to GitHub Pages → Run workflow**를 실행합니다. 이후 `main`에 올릴 때마다 자동 테스트·빌드·배포됩니다.
3. 성공하면 Pages 화면 또는 작업 결과의 주소로 접속합니다. 일반적인 형식: `https://gang84444-ctrl.github.io/mosslight-village/`.

**GitHub Pages에서는 혼자 플레이합니다.** GitHub Pages는 정적 호스팅이므로 Node 실시간 서버를 실행하지 않습니다. 실시간 만남을 외부에 제공하려면 Node 프로세스와 SSE 연결을 유지할 수 있는 서버에서 `npm ci && npm run build` 후 `npm start`를 실행하세요. 서버 플랫폼이 지정한 `PORT` 환경변수를 지원합니다.

공식 안내: [GitHub Pages 배포 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Netlify 배포

연결된 프로젝트: [Netlify 마을](https://thriving-froyo-3b5d46.netlify.app/). 현재 프로젝트 접근 설정에 따라 Netlify 로그인이 필요할 수 있습니다.

저장소의 `netlify.toml`이 `npm run build` 실행 후 `dist` 폴더만 배포하도록 지정합니다. 소스 폴더 전체를 배포하면 개발용 HTML만 표시될 수 있으므로 완성된 빌드 결과를 배포하세요. 연결된 GitHub `main` 브랜치를 수정하면 자동으로 다시 배포됩니다. 이 정적 배포는 혼자 플레이하는 버전입니다.

## 구조와 확장 방법

```text
src/world.js       3D 지형, 건물, 주민, 조명, 카메라와 모델
src/game.js        이동/충돌, 잎사귀, 수확, 가구 배치, 저장 복원
src/main.js        조작, 미션, 화면, 사진, 개인 저장
src/network.js     실시간 접속과 채팅
src/style.css      반응형 한국어 UI
server.js          정적 파일 + Node HTTP/SSE 마을 서버
tests/             게임 규칙 및 실제 HTTP 통합 테스트
.github/workflows/ GitHub Pages 자동 배포
```

- 집이나 나무 위치를 바꿀 때 `world.js`와 `game.js`의 충돌 데이터를 함께 수정하세요.
- 가구 추가: `game.js`의 `SHOP`에 가격 등록 → `world.js`의 `decoration()`에 모델 추가.
- 주민 추가: `world.js`의 `npcs`, `game.js`의 저장 복원 허용 목록 수정.
- 외부 3D 모델을 쓰려면 GLB를 `public/models`에 놓고 Three.js의 GLTFLoader로 교체할 수 있습니다. 사용 권한을 가진 에셋을 사용하세요.
- 다음 확장 후보: 집 내부, 사용자 계정, 서버 저장 DB, 공유 가구 배치, 낚시, 시간/날씨 동기화.

## 검증

```sh
npm test
npm run build
```

실행용 단일 HTML을 다시 만들려면 `npm run build:download`를 실행하세요. 결과는 `artifacts/mosslight-village-play.html`에 생성됩니다. 이 파일은 의존 파일과 외부 글꼴 없이 실행하며, 실시간 방문/채팅은 서버 버전에서만 지원합니다.

Three.js와 Vite를 사용합니다. 외부 폰트 연결이 없으면 시스템 글꼴로 표시됩니다. 배포 빌드에는 Three.js가 포함되므로 3D 실행에 외부 CDN이 필요하지 않습니다.

라이선스: [MIT](LICENSE). 의존 라이브러리와 Google Fonts는 각자의 라이선스를 따릅니다.
