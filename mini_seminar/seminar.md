- 세미나
    
    ### REST란 무엇인가요? 그리고 어떻게하면 통신 모델 잘 만들까요
    
    REST (Representational State Transfer)는 2000년 로이 필딩(Roy Fielding)이 박사 논문에서 제시한 웹 아키텍처 스타일입니다. 웹의 장점을 최대한 활용할 수 있는 아키텍처로, HTTP 프로토콜을 그대로 활용합니다.
    
    ```mermaid
    graph TB
        subgraph "REST 아키텍처 제약조건"
            CS[Client-Server<br/>클라이언트-서버]
            ST[Stateless<br/>무상태성]
            CA[Cacheable<br/>캐시 가능]
            LS[Layered System<br/>계층화 시스템]
            UI[Uniform Interface<br/>통합 인터페이스]
            COD[Code on Demand<br/>코드 온 디맨드 - 선택적]
        end
    
        CS --> ST
        ST --> CA
        CA --> LS
        LS --> UI
        UI -.-> COD
    
        style CS fill:#FFE4B5
        style ST fill:#E6E6FA
        style CA fill:#90EE90
        style LS fill:#FFB6C1
        style UI fill:#87CEEB
        style COD fill:#F0E68C,stroke-dasharray: 5 5
    
    ```
    
    > 📚 참고: Roy Fielding의 박사 논문 "Architectural Styles and the Design of Network-based Software Architectures" (2000)
    > 
    > - [원문 보기](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
    1. **클라이언트-서버 구조**
        - 사용자 인터페이스와 데이터 저장 관심사를 분리
        - 프론트엔드와 백엔드가 독립적으로 개발 가능

1. **무상태성 (Stateless)**
    - 서버는 클라이언트의 상태를 저장하지 않음
    - 각 요청은 독립적이며 완전한 정보를 포함해야 함
2. **캐시 가능**
    - 응답에 캐시 가능 여부를 명시
    - 성능 향상과 네트워크 트래픽 감소
3. **계층화 시스템**
    - 중간 서버(프록시, 게이트웨이 등) 사용 가능
    - 보안, 로드밸런싱 등의 기능 추가 가능
4. **통합 인터페이스**
    - 모든 자원에 대해 일관된 인터페이스 제공
    - HTTP 메소드의 의미가 명확함
5. **코드 온 디맨드 (선택)**
    - 서버가 클라이언트로 실행 가능한 코드 전송 가능

### HTTP 메소드와 CRUD 매핑

**HTTP 메소드와 CRUD 매핑:**

| HTTP Method | CRUD Operation | 설명 | 예시 |
| --- | --- | --- | --- |
| **GET** | Read | 자원 조회 | `GET /users/123` |
| **POST** | Create | 새 자원 생성 | `POST /users` |
| **PUT** | Update | 전체 수정 | `PUT /users/123` |
| **PATCH** | Update | 부분 수정 | `PATCH /users/123` |
| **DELETE** | Delete | 자원 삭제 | `DELETE /users/123` |

> 📚 참고: Martin Fowler의 Richardson Maturity Model
> 
> - [원문 보기](https://martinfowler.com/articles/richardsonMaturityModel.html)
> - Level 0: The Swamp of POX
> - Level 1: Resources
> - Level 2: HTTP Verbs
> - Level 3: Hypermedia Controls

각 레벨의 의미

- Level 1 tackles the question of handling complexity by using divide and conquer, breaking a large service endpoint down into multiple resources.
- Level 2 introduces a standard set of verbs so that we handle similar situations in the same way, removing unnecessary variation.
- Level 3 introduces discoverability, providing a way of making a protocol more self-documenting.

### 상태 코드 활용

- `200 OK`: 성공
- `201 Created`: 생성 성공
    - `400 Bad Request`: 잘못된 요청
    - `404 Not Found`: 자원 없음
    - `500 Internal Server Error`: 서버 오류

### **RESTful API 예시**

### **1. 사용자 관리**

```
GET    /api/users              # 모든 사용자 목록 조회
GET    /api/users/123          # 특정 사용자 조회
POST   /api/users              # 새 사용자 생성
PUT    /api/users/123          # 사용자 전체 정보 수정
PATCH  /api/users/123          # 사용자 일부 정보 수정
DELETE /api/users/123          # 사용자 삭제
```

### **2. 게시글 관리**

```
GET    /api/posts              # 모든 게시글 목록
GET    /api/posts/456          # 특정 게시글 조회
POST   /api/posts              # 새 게시글 생성
PUT    /api/posts/456          # 게시글 수정
DELETE /api/posts/456          # 게시글 삭제
```

### **3. 댓글 관리 (중첩 자원)**

```
GET    /api/posts/456/comments         # 특정 게시글의 댓글 목록
GET    /api/posts/456/comments/789     # 특정 댓글 조회
POST   /api/posts/456/comments         # 새 댓글 생성
PUT    /api/posts/456/comments/789     # 댓글 수정
DELETE /api/posts/456/comments/789     # 댓글 삭제
```

### **4. 할일 관리**

```
GET    /api/todos              # 모든 할일 목록
GET    /api/todos?status=pending       # 상태별 필터링
POST   /api/todos              # 새 할일 생성
PATCH  /api/todos/123/complete # 할일 완료 처리
DELETE /api/todos/123          # 할일 삭제
```

### **5. 파일 관리**

```
GET    /api/files              # 파일 목록
POST   /api/files              # 파일 업로드
GET    /api/files/abc123/download      # 파일 다운로드
DELETE /api/files/abc123       # 파일 삭제
```

### HTTP 메소드 → FE 코드에서 어떤 패턴으로 이어진당

예:

- GET → useQuery / 실시간 캐싱
- POST → Optimistic UI
- PATCH → Form 수정 로직
- DELETE → 목록에서 제거

REST ==  FE 상태관리 설계

- restAPI에 따른 통신 모델 설계!
    
    ## 0. 공통 fetch 유틸
    
    ```tsx
    // api/fetcher.ts
    export async function apiFetch<T>(
      url: string,
      options?: RequestInit
    ): Promise<T> {
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });
    
      if (!res.ok) {
        // 상태코드 기반 에러 처리 가능
        const text = await res.text();
        throw new Error(`HTTP ${res.status} - ${text}`);
      }
    
      if (res.status === 204) {
        // no content
        return null as T;
      }
    
      return res.json() as Promise<T>;
    }
    
    ```
    
    ```tsx
    // types/todo.ts -> 타입 선언 미리
    export interface Todo {
      id: number;
      title: string;
      completed: boolean;
    }
    
    ```
    
    ---
    
    ## 1. **GET → useQuery / 캐싱**
    
    ```tsx
    // hooks/useTodos.ts
    import { useQuery } from "@tanstack/react-query";
    import { apiFetch } from "../api/fetcher";
    import type { Todo } from "../types/todo";
    
    async function fetchTodos(): Promise<Todo[]> {
      return apiFetch<Todo[]>("/api/todos");
    }
    
    export function useTodos() {
      return useQuery({
        queryKey: ["todos"],      // 이 키 기준으로 자동 캐싱
        queryFn: fetchTodos,
        staleTime: 1000 * 30,     // 30초 동안은 fresh
      });
    }
    
    ```
    
    ```tsx
    // components/TodoList.tsx
    import { useTodos } from "../hooks/useTodos";
    
    export function TodoList() {
      const { data, isLoading, isError } = useTodos();
    
      if (isLoading) return <div>로딩 중…</div>;
      if (isError) return <div>에러가 발생했습니다.</div>;
    
      return (
        <ul>
          {data?.map((todo) => (
            <li key={todo.id}>
              {todo.title} {todo.completed ? "OK" : "Wait"}
            </li>
          ))}
        </ul>
      );
    }
    
    ```
    
    ---
    
    ## 2. **POST → Optimistic UI**
    
    > 새 Todo를 추가할 때, 서버 응답을 기다리지 않고 업데이트 먼저 한 후, 실패 시 롤백(다시 돌아갑니다)
    > 
    
    ```tsx
    // hooks/useCreateTodo.ts
    import { useMutation, useQueryClient } from "@tanstack/react-query";
    import { apiFetch } from "../api/fetcher";
    import type { Todo } from "../types/todo";
    
    interface CreateTodoInput {
      title: string;
    }
    
    async function createTodo(input: CreateTodoInput): Promise<Todo> {
      return apiFetch<Todo>("/api/todos", {
        method: "POST",
        body: JSON.stringify(input),
      });
    }
    
    export function useCreateTodo() {
      const queryClient = useQueryClient();
    
      return useMutation({
        mutationFn: createTodo,
        //Optimistic Update (낙관적 업데이트 : 아 모르겠다 업데이트! -> 실패시 다시 돌려!)
        onMutate: async (newTodo) => {
          await queryClient.cancelQueries({ queryKey: ["todos"] });
    
          const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);
    
          const optimisticTodo: Todo = {
            id: Date.now(), // 임시 ID
            title: newTodo.title,
            completed: false,
          };
    
          queryClient.setQueryData<Todo[]>(["todos"], (old) =>
            old ? [...old, optimisticTodo] : [optimisticTodo]
          );
    
          return { previousTodos };
        },
        //에러 발생 시 롤백
        onError: (_err, _variables, context) => {
          if (context?.previousTodos) {
            queryClient.setQueryData(["todos"], context.previousTodos);
          }
        },
        //성공/실패 상관없이 refetch로 맞추기
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
      });
    }
    
    ```
    
    ```tsx
    // components/TodoForm.tsx
    import { FormEvent, useState } from "react";
    import { useCreateTodo } from "../hooks/useCreateTodo";
    
    export function TodoForm() {
      const [title, setTitle] = useState("");
      const { mutate, isPending } = useCreateTodo();
    
      const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        mutate({ title });
        setTitle(""); //낙관적 업데이트라서 바로 비워도 됨
      };
    
      return (
        <form onSubmit={handleSubmit}>
          <inputvalue={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="할 일을 입력하세요"
          />
          <button type="submit" disabled={isPending}>
            {isPending ? "추가 중…" : "추가"}
          </button>
        </form>
      );
    }
    
    ```
    
    ---
    
    ## 3. **PATCH → Form 수정 로직**
    
    > 기존 Todo의 일부 필드만 수정 (예: completed만 토글, 제목만 수정 등)
    > 
    
    ```tsx
    // hooks/useUpdateTodo.ts
    import { useMutation, useQueryClient } from "@tanstack/react-query";
    import { apiFetch } from "../api/fetcher";
    import type { Todo } from "../types/todo";
    
    interface UpdateTodoInput {
      id: number;
      patch: Partial<Pick<Todo, "title" | "completed">>;
    }
    
    async function patchTodo({ id, patch }: UpdateTodoInput): Promise<Todo> {
      return apiFetch<Todo>(`/api/todos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
    }
    
    export function useUpdateTodo() {
      const queryClient = useQueryClient();
    
      return useMutation({
        mutationFn: patchTodo,
        onSuccess: (updated) => {
          queryClient.setQueryData<Todo[]>(["todos"], (old) =>
            old?.map((t) => (t.id === updated.id ? updated : t)) ?? []
          );
        },
      });
    }
    
    ```
    
    ```tsx
    // components/TodoItem.tsx
    import type { Todo } from "../types/todo";
    import { useUpdateTodo } from "../hooks/useUpdateTodo";
    
    interface Props {
      todo: Todo;
    }
    
    export function TodoItem({ todo }: Props) {
      const { mutate: updateTodo, isPending } = useUpdateTodo();
    
      const toggleCompleted = () => {
        updateTodo({ id: todo.id, patch: { completed: !todo.completed } });
      };
    
      return (
        <li>
          <label>
            <inputtype="checkbox"
              checked={todo.completed}
              onChange={toggleCompleted}
              disabled={isPending}
            />
            {todo.title}
          </label>
        </li>
      );
    }
    
    ```
    
    폼 전체 수정(제목 등)은 `patch`에 `title`만 넣어서 보내면 됨.
    
    ---
    
    ## 4. **DELETE → 목록에서 제거**
    
    > 삭제 성공 시, 캐시된 리스트에서 해당 아이템 제거.
    > 
    
    ```tsx
    // hooks/useDeleteTodo.ts
    import { useMutation, useQueryClient } from "@tanstack/react-query";
    import { apiFetch } from "../api/fetcher";
    import type { Todo } from "../types/todo";
    
    async function deleteTodo(id: number): Promise<void> {
      await apiFetch<void>(`/api/todos/${id}`, {
        method: "DELETE",
      });
    }
    
    export function useDeleteTodo() {
      const queryClient = useQueryClient();
    
      return useMutation({
        mutationFn: deleteTodo,
        onSuccess: (_data, id) => {
          queryClient.setQueryData<Todo[]>(["todos"], (old) =>
            old?.filter((t) => t.id !== id) ?? []
          );
        },
      });
    }
    
    ```
    
    ```tsx
    // components/TodoItemWithDelete.tsx
    import type { Todo } from "../types/todo";
    import { useDeleteTodo } from "../hooks/useDeleteTodo";
    
    interface Props {
      todo: Todo;
    }
    
    export function TodoItemWithDelete({ todo }: Props) {
      const { mutate: removeTodo, isPending } = useDeleteTodo();
    
      return (
        <li>
          {todo.title}
          <button onClick={() => removeTodo(todo.id)} disabled={isPending}>
            삭제
          </button>
        </li>
      );
    }
    
    ```
    
    ---
