import { useEffect } from 'react';

const KAKAO_JAVASCRIPT_KEY = '52ef263b85197e505ebaaecd103bf2e6';

const KakaoLoginButton = ({ onLoginSuccess }) => {
  // 1. 로그인 성공 후 카카오 토큰을 백엔드 서버로 전송하는 함수
  const sendTokenToServer = (token) => {
    // 토큰을 백엔드(4000)의 새로운 엔드포인트로 전송
    fetch('http://localhost:4000/api/kakao-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: token }), // 액세스 토큰 전송
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && onLoginSuccess) {
          // 서버에서 로그인 성공 응답을 받으면 React 상태 업데이트
          onLoginSuccess(data.loginMethod, data.userInfo);
        }
      })
      .catch((error) => console.error('카카오 토큰 서버 전송 실패:', error));
  };

  // 2. 카카오 로그인 버튼 클릭 시 호출되어 인증 과정을 시작하는 함수
  const kakaoLogin = () => {
    // Kakao SDK가 로드되었는지 확인
    if (window.Kakao) {
      window.Kakao.Auth.login({
        scope: 'profile_nickname', // 필요한 사용자 동의 항목
        success: function (authObj) {
          console.log('카카오 로그인 성공! Access Token:', authObj.access_token);
          // 토큰 발급 후 바로 서버로 전송하여 최종 로그인 처리
          sendTokenToServer(authObj.access_token);
        },
        fail: function (err) {
          console.error('카카오 로그인 실패:', err);
        },
      });
    }
  };

  // 3. 컴포넌트가 마운트될 때 카카오 SDK를 초기화 (앱 키 설정)
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_JAVASCRIPT_KEY);
    }
  }, []); // 컴포넌트 최초 렌더링 시 한 번만 실행

  return (
    <div style={{ margin: '10px 0' }}>
      <button
        onClick={kakaoLogin}
        style={{
          width: '240px',
          height: '40px',
          backgroundColor: '#FEE500',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '5px',
          fontWeight: 'bold',
          padding: 0,
        }}
      >
        <img
          src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
          alt="카카오 계정으로 로그인"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            height: 'auto',
          }}
        />
      </button>
    </div>
  );
};

export default KakaoLoginButton;
