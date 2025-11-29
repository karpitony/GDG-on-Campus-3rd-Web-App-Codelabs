import { useState, useEffect } from 'react';
import './App.css';
import GoogleLoginButton from './components/GoogleLoginButton';
import KakaoLoginButton from './components/KakaoLoginButton';

const SERVER_URL = 'http://localhost:4000';

const GOOGLE_COLOR = '#4285F4'; // 구글 파란색
const KAKAO_COLOR = '#FEE500'; // 카카오 노란색

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const [loginMethod, setLoginMethod] = useState(null); // 'google' 또는 'kakao'
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태

  // 1. 로그인 성공 시 상태 업데이트 함수
  const handleLoginSuccess = (method, data) => {
    setIsLoggedIn(true);
    setLoginMethod(method);
    setUserInfo(data);
    setIsLoading(false);

    // 로그인 후 URL 쿼리 파라미터 정리
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  // 2. 서버를 통해 로그아웃 처리
  const handleLogout = () => {
    // 백엔드 서버의 로그아웃 엔드포인트 호출
    fetch(`${SERVER_URL}/logout`, { credentials: 'include' })
      .then(() => {
        setIsLoggedIn(false);
        setLoginMethod(null);
        setUserInfo(null);

        // Google GSI 자동 로그인 방지 기능 비활성화
        if (window.google && window.google.accounts.id) {
          window.google.accounts.id.disableAutoSelect();
        }
      })
      .catch((error) => console.error('로그아웃 요청 실패:', error));
  };

  // 3. 컴포넌트 마운트 시/새로고침 시 로그인 상태 확인
  useEffect(() => {
    // 백엔드 서버의 상태 조회 엔드포인트 호출
    fetch(`${SERVER_URL}/api/status`, {
      method: 'GET', // 또는 POST
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isLoggedIn) {
          handleLoginSuccess(data.loginMethod, data.userInfo);
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('초기 상태 확인 실패:', error);
        setIsLoading(false);
      });
  }, []); // 최초 렌더링 시 한 번만 실행

  if (isLoading) {
    return <p>로그인 상태 확인 중...</p>;
  }

  // 4. 로그인 성공 시
  if (isLoggedIn) {
    const methodText = loginMethod === 'google' ? '구글' : '카카오';
    const userName = userInfo?.name || userInfo?.email || userInfo?.nickname || '사용자';

    // 로그인 방식에 따른 동적 색상 설정
    const btnBgColor = loginMethod === 'google' ? GOOGLE_COLOR : KAKAO_COLOR;
    const btnTextColor = loginMethod === 'google' ? 'white' : '#3C1E1E';
    return (
      <div className="logged-in_container">
        <h1>{methodText} 계정으로 로그인 성공!</h1>
        <p>{userName}님! 환영해요😊</p>
        <button
          onClick={handleLogout}
          className="logout_button"
          style={{
            backgroundColor: btnBgColor,
            color: btnTextColor,
          }}
        >
          로그아웃
        </button>
      </div>
    );
  }

  // 5. 로그인 전
  return (
    <div className="App_all">
      <h1>소셜 로그인</h1>
      <div>
        <GoogleLoginButton onLoginSuccess={handleLoginSuccess} />
      </div>
      <div>
        <KakaoLoginButton onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}

export default App;
