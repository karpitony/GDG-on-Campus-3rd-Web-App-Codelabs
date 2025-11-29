# Mock Server

## 왜 Mock Server가 필요한가?

### Mock Server의 필요성

- 백엔드 API가 준비되기 전에 FE 개발이 가능 - FE/BE 병렬 개발 가능
  - 백엔드가 배포 및 구현될 때까지 기다릴 필요가 없다!
- 예외 상황(에러, 지연, 빈 데이터 등)을 안전하게 테스트 가능
  - 예외 상황에 대해 직접 서버에 요청을 보내지 않고도 mock server를 사용하여 안전하게 테스트가 가능하다!
- 자동 테스트(Jest/Vitest)에서 외부 API 의존성 제거
  - 테스트 코드가 백엔드 API 코드에 의존하지 않도록 하여 테스트를 더 안정적으로 수행할 수 있다.
- 백엔드에 의존하지 않고 프론트엔드 코드 리펙토링 가능!
  - 내가 이 Mock Server를 주제로 삼게 된 이유!

---

## Mock Server란 무엇인가?

### 정의

실제 서버를 모방하여 미리 정의된 응답을 반환하는 가짜 서버

### Mock Server의 활용 범위

- 개발 환경: 빠르게 FE 전체 기능 구현 가능
  - 백엔드가 없어도, 리스트 UI, pagination, 검색 필터 같은 걸 다 구현 가능
  - 나중에 실제 API가 생겨도, **엔드포인트와 응답 형태만 맞으면** 바로 연동 가능
  - 팀 단위로는 FE/BE가 **병렬 개발**이 가능해짐
- 테스트 환경: 에러, 지연 등 다양한 상황 재현
  - 현실에서 잘 안나오는 상황을 mock server를 통해 의도적으로 만들 수 있다
  - 덕분에 **테스트가 훨씬 현실적인 시나리오를 다루게 된다**
    “서버에서 500 에러가 났을 때 UI가 어떻게 보이나?”
    “에러 메시지가 제대로 뜨는지?”
    “로딩 스피너가 언제까지 도는지?”
    “네트워크가 느릴 때, 버튼이 중복 클릭되는 건 아닌지?”

---

## Mock Server 구현 방식의 종류

### 1) 간단한 **정적 JSON Mocking**

- public/data.json 등의 파일을 fetch
- 가장 단순하지만 유연성이 부족
- 에러/조건부 응답 구현 어려움

---

### 2) **JSON Server**

- 가짜 REST API 서버를 쉽게 생성하는 도구
- JSON 파일을 데이터베이스처럼 사용하여 CRUD 기능 지원
- 빠르고 간편하지만 커스텀이 어려움
- Json 데이터 파일 생성 + json server 실행 → JSON 파일의 데이터를 기반으로 REST API 서버 생성

---

### 3) **MirageJS**

- 클라이언트에서 mock API 구축
- 아예 가짜 서버를 클라이언트 단 안에서 만드는 방식
- 브라우저 내에서 상세한 서버 시뮬레이션 가능
- 다만 복잡하고 학습 비용이 높기 때문에 프론트 개발만으로 백엔드까지 흉내 내야 할 때 유용함

---

### 4) **Mock Service Worker (MSW)**

- 실제 네트워크 요청을 가로채서 mock 응답을 반환하는 방식
- 브라우저에서는 Service Worker, Node에서는 Request Interceptor 사용
- 프론트엔드 코드 수정 없이 실제 API처럼 동작

---

## 대표 예시: Mock Service Worker(MSW) 상세 설명

### MSW의 동작 구조

![image.png](attachment:4e20e89c-7f5c-4d9b-ac43-8cdf94aaeadb:image.png)

1. 브라우저가 Service Worker에 요청을 보냄

2. Service Worker가 해당 요청을 가로채서 복사함

3. 서버에 요청을 보내지 않고, MSW 라이브러리의 핸들러와 매칭시킴

4. MSW가 등록된 핸들러에서 모의 응답 (mocked response)를 Service Worker에게 전달함

5. 마지막으로, Service Worker가 모의 응답을 브라우저에게 전달함

---

### 장점

#### 1) FE 코드 수정 불필요

api 요청 코드(axios/fetch)를 수정할 필요가 없다.

보통 Mocking을 하기 위해서는,

- 특정 환경에서는 mock API 서버를 바라보게 baseURL을 바꾸거나
- 개발/운영 환경에 따라 if문으로 분기하거나
- axios interceptor를 따로 설정하거나

이런 ‘추가적인 로직’이 들어가기 마련이다.

하지만 **MSW는 네트워크 요청이 실제 서버로 나가기 직전에 가로채기 때문에**,

프론트엔드 코드는 일반적인 네트워크 요청 코드를 수정할 필요 없이 그대로 유지하면 된다.

#### 2) 다양한 상황 Mock 가능

지연, 에러, 조건부 응답 등 쉽게 테스트

```jsx
// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

http.get("/api/user", () => {
  return HttpResponse.json({
    id: 1,
    name: "Jung sun",
  });
});

http.get("/api/products", async () => {
  await new Promise((r) => setTimeout(r, 2000)); // 2초 지연
  return HttpResponse.json({
    products: ["Keyboard", "Mouse", "Monitor"],
  });
});
// 로딩 스피너 테스트할 때 유용

http.get("/api/fail", () => {
  return HttpResponse.json(
    { message: "Internal Server Error" },
    { status: 500 }
  );
});
// 서버 에러 응답을 만들 수도 있음

http.get("/api/profile", () => {
  return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
});
// 각종 에러 응답 가능

http.post("/api/login", async ({ request }) => {
  const body = await request.json();

  return HttpResponse.json({
    status: true,
    data: {
      token: "token-123",
      user: {
        id: 1,
        name: body.username,
      },
    },
  });
});
```

---

### 구현 예시

1. msw 설치하기

```jsx
npm install msw --save-dev
# or
yarn add msw --dev
```

1. 서비스워커 파일 생성

브라우저에서 사용하기 위해서는 MSW를 서비스 워커에 등록하는 과정이 필요한데, 아래의 명령어를 실행하면 서비스 워커 등록을 위한 파일이 `public` 폴더에 추가된다.

```jsx
npx msw init public/ --save
```

- mockServiceWorker.js라는 파일 생성
  ![image.png](attachment:dbc78f02-19f8-4d0a-ad06-46189d93435a:image.png)

1. 핸들러 정의

api 명세에 맞게 엔드포인트와 데이터 형식에 유의하여 핸들러를 정의한다.

```jsx
// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/artists", () => {
    return HttpResponse.json({
      status: true,
      data: [
        {
          id: 1,
          name: "name",
          bio: "bio",
          number_of_members: 1,
          categories: ["category"],
          categories_display: ["category"],
          custom_category: "category",
          equipments: ["equipment"],
          equipments_display: ["equipment"],
          portfolio_links: ["link"],
          portfolio_links_display: ["link"],
          profile_image_url: "url",
          region: ["region"],
          region_display: ["region"],
          desired_pay: 0,
          is_free_allowed: true,
          phone_number: "010-0000-0000",
          is_liked: true,
        },
      ],
    });
  }),
];
```

1. **브라우저용 worker 설정**

```jsx
// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

handlers를 받아서 실제로 브라우저의 Service Worker를 세팅하는 worker 객체를 만들어 줌

1. **앱 진입점에서 개발 환경일 때만 MSW 실행**

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./styles/theme";
import { GlobalStyles } from "@styles/globalStyles.tsx";

async function enableMocking() {
  // 개발 환경일 때만 MSW 실행
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    await worker.start();
  }
}

// MSW 준비가 끝난 뒤에 앱 렌더링
enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </StrictMode>
  );
});
```

### 실행 시 다음과 같이 동작합니다

1. 세팅 완료 후 브라우저에서 콘솔을 열면 다음과 같이 “[MSW] Mocking enabled”라고 모킹이 활성화되었다는 메시지가 뜹니다.

![image.png](attachment:46ea0da5-5b45-41e5-a55e-b0e9b12f5187:image.png)

1. 요청을 보내게 되면 실제 네트워크 요청에 대한 응답과 동일한 형식으로 응답이 오는 것을 확인할 수 있습니다.

![image.png](attachment:1f4bb731-5429-4349-9a4e-1a515cf53c72:image.png)

→ 응답의 형태는 제가 설정해 둔 mock data로 오는 것을 확인할 수 있습니다.

### 참고 자료

https://velog.io/@khy226/msw%EB%A1%9C-%EB%AA%A8%EC%9D%98-%EC%84%9C%EB%B2%84-%EB%A7%8C%EB%93%A4%EA%B8%B0

https://cjy00n.tistory.com/m/116

https://mswjs.io/docs/quick-start
