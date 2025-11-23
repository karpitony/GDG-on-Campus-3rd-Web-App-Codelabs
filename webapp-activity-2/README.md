# 🧩 Web/App Codelab — Activity 2

---

## Firebase에서 데이터가 어떻게 저장되는지 확인하기

이번 Activity 2에서는 **클라이언트 → 서버(Firebase)**로 데이터가 전달되는 흐름을 직접 경험합니다.  
Firebase Authentication, Firestore, Security Rules를 활용하여  
기본적인 앱의 데이터 흐름과 인증/권한 구조를 이해하는 것이 목표입니다.

## 📘 학습 목표

- Firebas 인증 및 FirebaseUI로 사용자 인증 처리
- Cloud Firestore를 사용하여 데이터 동기화
- Firebase 보안 규칙(Security Rules) 작성 및 적용

## 🛠 진행 방법

1. 아래 Firebase Codelab 링크로 접속하여 실습을 진행합니다.
2. 실습 과정과 캡처 화면을 포함해 구현한 내용을 제출해주세요.
3. 자신의 기술 스택(React, Next.js, Flutter 등)으로 자유로운 확장 구현도 가능합니다.

📎 **실습 링크**  
https://firebase.google.com/codelabs/firebase-get-to-know-web?hl=ko#0

## 🧱 심화 과제 (선택)

---

### 🔐 1) 로그인 화면

- Firebase Auth(Google) 로그인 버튼 구현

### 📝 2) 메모 화면 기능

- Text input 1개
- “저장하기” 버튼 1개
- 메모 저장 후 화면에 즉시 반영
- 앱 새로고침 시 Firestore에서 메모 불러와서 렌더링
- 업데이트 시간도 함께 표시  
  예: `마지막 수정: 2025-11-14 13:45`

### 🔄 3) 로딩 / 에러 처리

- 메모 불러오는 동안 로딩 UI: “불러오는 중…”
- 저장 실패 시 에러 UI: “저장 실패. 다시 시도해주세요.”

### 🗂 4) Firestore Document 구조

```
users/{uid}/memoDoc
{
    memo: “string”,
    updatedAt: serverTimestamp()
}
```

### 🛡 5) Security Rules 요구사항

- 로그인한 사용자는 본인 uid에 해당하는 문서만 read/write 가능
- `memo` 길이 제한: 문자열 최대 100자
- `updatedAt` 필드는 반드시 존재해야 함

예시:

```jsx
match /users/{uid}/memoDoc {
  allow read, write: if
    request.auth != null &&
    request.auth.uid == uid &&
    request.resource.data.memo is string &&
    request.resource.data.memo.size() <= 100 &&
    request.resource.data.updatedAt is timestamp;
}
```

### 🎨 6) UI 요구사항

- 화면 중앙 정렬 UI
- “Saved memo:” 컴포넌트 구현
- 메모가 없을 경우: 아직 작성된 메모가 없습니다 출력

---

## 📤 제출 방법

- **제출 마감:** 11월 24일(월)
- **제출 방법:** README 참고

---

Happy Coding! 🚀  
GDGoC DGU Web/App 파트
