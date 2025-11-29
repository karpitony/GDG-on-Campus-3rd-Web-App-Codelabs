import { useEffect } from 'react';

const client_id = '167703882495-umrv9ro5g3moej90fbn56t0fej11f2hu.apps.googleusercontent.com'; // 실제 클라이언트 ID로 변경

function handleCredentialResponse(response, onLoginSuccess) {
  const jwtToken = response.credential;

  console.log('Encoded JWT ID token:', jwtToken);

  // 백엔드로 JWT 토큰을 전송하여 서버 측 로그인을 처리
  fetch('http://localhost:4000/api/google-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: jwtToken }),
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        console.log('Google 로그인 성공:', data.userInfo);
        if (onLoginSuccess) onLoginSuccess(data.loginMethod, data.userInfo);
      } else {
        console.error('Google 로그인 실패:', data.message || '알 수 없는 오류');
      }
    })
    .catch((error) => {
      console.error('백엔드 로그인 요청 실패:', error);
    });
}

const GoogleLoginButton = ({ onLoginSuccess }) => {
  useEffect(() => {
    // Google SDK 객체가 로드되었는지 확인
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: client_id,
        callback: (response) => handleCredentialResponse(response, onLoginSuccess), // Google 인증 응답 처리 함수 연결
        auto_select: false, // 자동 로그인 방지 및 버튼에 사용자 정보 표시하지 X
      });

      // Google 버튼을 DIV 엘리먼트에 렌더링
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-div'),
        { theme: 'filled_blue', size: 'large', text: 'signin_with', type: 'standard', width: 240, height: 45 } // 원하는 스타일로 커스터마이징
      );
    }
  }, [onLoginSuccess]); // onLoginSuccess 변경 시 useEffect 재실행

  return <div id="google-signin-div"></div>;
};

export default GoogleLoginButton;
