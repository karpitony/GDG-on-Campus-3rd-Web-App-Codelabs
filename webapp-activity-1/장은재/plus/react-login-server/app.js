const express = require('express');
const session = require('express-session');
const qs = require('qs');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const app = express();
const port = 4000;

// ------------------------------------
// 1. 공통 미들웨어 설정
// ------------------------------------

// CORS 설정 : React(3000)와 서버(4000) 간 통신 허용
const cors = require('cors');
app.use(
  cors({
    origin: 'http://localhost:3000', // React 개발 서버 주소
    credentials: true, // 쿠키 허용
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON 파싱 (Google/Kakao JS SDK 토큰 수신용)

// 로그인 상태 유지를 위한 세션 설정
app.use(
  session({
    secret: 'your session secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24, path: '/' }, // 24시간 세션 유지
  })
);

// ------------------------------------
// 2. 카카오 로그인 설정 및 엔드포인트 (JS SDK 처리)
// ------------------------------------

const api_host = 'https://kapi.kakao.com'; // 카카오 API 호출 서버 주소

// [POST /api/kakao-login]: 클라이언트에서 전송된 액세스 토큰 처리
app.post('/api/kakao-login', async (req, res) => {
  const { access_token } = req.body; // 클라이언트에서 전송한 액세스 토큰

  if (!access_token) {
    return res.status(400).json({ success: false, message: '토큰이 제공되지 않았습니다.' });
  }

  try {
    // 1. 토큰을 사용하여 카카오에 사용자 정보 조회 요청
    const uri = api_host + '/v2/user/me';
    const header = { Authorization: 'Bearer ' + access_token };

    const kakaoResponse = await axios.post(uri, null, { headers: header });
    const userInfo = kakaoResponse.data;

    const nickname = userInfo.properties.nickname;
    const email = userInfo.kakao_account?.email;
    const userId = userInfo.id; // 카카오 고유 ID

    // 2. 서버 세션에 로그인 정보 저장
    req.session.key = userId;
    req.session.loginMethod = 'kakao';
    req.session.userInfo = { userId, nickname, email };

    // 3. React 클라이언트에게 성공 응답 전송
    res.json({
      success: true,
      message: 'Kakao 로그인 성공',
      userInfo: { nickname, email },
      loginMethod: 'kakao',
    });
  } catch (error) {
    console.error('카카오 토큰 검증 또는 사용자 정보 조회 실패:', error.response?.data || error.message);
    res.status(401).json({ success: false, message: '인증 실패' });
  }
});

// ------------------------------------
// 3. Google 로그인 설정 및 엔드포인트
// ------------------------------------

const google_client_id = '167703882495-umrv9ro5g3moej90fbn56t0fej11f2hu.apps.googleusercontent.com'; // React 코드와 동일한 ID 사용
const client = new OAuth2Client(google_client_id);

// [POST /api/google-login]: 클라이언트에서 전송된 JWT 토큰 처리
app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    // 1. Google ID 토큰 검증
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: google_client_id,
    });

    const payload = ticket.getPayload();
    const userId = payload['sub'];
    const email = payload['email'];
    const name = payload['name'];

    // 2. 서버 세션에 로그인 정보 저장
    req.session.key = userId;
    req.session.loginMethod = 'google';
    req.session.userInfo = { userId, email, name };

    // 3. 클라이언트에게 성공 응답 전송
    res.json({
      success: true,
      message: 'Google 로그인 성공',
      userInfo: { name, email },
      loginMethod: 'google',
    });
  } catch (error) {
    console.error('Google 토큰 검증 실패:', error);
    res.status(401).json({ success: false, message: 'Google 인증 실패: 토큰 오류' });
  }
});

// ------------------------------------
// 4. 공통 기능 엔드포인트 (상태, 로그아웃)
// ------------------------------------

// [GET /api/status]: 새로고침 시 로그인 상태 조회
app.get('/api/status', (req, res) => {
  if (req.session.key && req.session.loginMethod) {
    res.json({
      isLoggedIn: true,
      loginMethod: req.session.loginMethod,
      userInfo: req.session.userInfo || {},
    });
  } else {
    res.json({ isLoggedIn: false });
  }
});

// [GET /logout]: 공통 로그아웃 처리
app.get('/logout', async function (req, res) {
  // 카카오 로그인 상태라면 카카오 서버에도 로그아웃 요청 (선택적)
  if (req.session.loginMethod === 'kakao' && req.session.key) {
    const uri = api_host + '/v1/user/logout';
    const header = { Authorization: 'Bearer ' + req.session.key };

    try {
      await axios.post(uri, null, { headers: header });
    } catch (e) {
      console.warn('카카오 API 로그아웃 실패, 서버 세션만 삭제:', e.response?.data);
    }
  }

  // 서버 세션 삭제 (공통 로그아웃 처리)
  req.session.destroy(() => {
    res.json({ success: true, message: '로그아웃 완료' });
  });
});

// ------------------------------------
// 5. 서버 시작
// ------------------------------------

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
