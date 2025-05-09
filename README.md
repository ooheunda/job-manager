# Job Manager

## 📌 개요

NestJS로 구축된 간단한 **작업(Job) 관리 REST API 서버**입니다.

- API를 통해 작업을 조회, 검색, 생성할 수 있습니다. [[API Spec]](#-api-spec)
- `@nestjs/scheduler` 모듈을 통한 주기적인 작업 상태 업데이트 작업을 수행합니다. [[Comment](#배치-작업-관련)]
- 데이터는 `node-json-db` 를 통해 `api/data` 에 파일로 저장됩니다. 현재는 100개의 샘플 데이터가 저장되어 있습니다. [[DB Model]](#-db-model)
- 성공 요청을 로깅하며, `/logs/${date}` 파일에 최대 7일간 저장됩니다. 에러 로그는 `/logs/error.log`에 따로 저장합니다.

## 🚀 프로젝트 실행 방법

1. 이 리포지토리를 다운받습니다.
   ```bash
   git clone https://github.com/ooheunda/job-manager.git
   ```
2. 디렉토리 이동 후 필요한 의존성을 다운받습니다.

   ```bash
   cd job-manager
   npm ci

   mv .env.sample .env # 필수 X
   ```

3. 서버를 실행합니다.
   ```bash
   npm run start
   ```

## 📝 API Spec

> 위 절차에 따라 서버 실행 후, `api/api-docs` 경로의 Swagger UI를 통해 테스트할 수 있습니다.  
> [**[기본 PORT를 사용하는 경우 바로가기]**](http://localhost:3000/api-docs)

### GET `api/jobs`

- 모든 작업 목록을 조회합니다.
- **요청**
  ```jsx
  Request query {
    page?: number, // default = 1
    limit?: number // default = 10
  }
  ```
- **응답**
  ```jsx
  Response {
    success: true,
    message: '요청이 성공하였습니다.',
    data: {
      jobs: [
        {
          id: "uuid-uuid-uuid-uuid",
          title: "title",
          description: "description",
          status: "pending",
          createdAt: "2025-05-09T12:10:52.971Z",
        },
        // more
      ]
    },
    error: null
  }
  ```

### GET `api/jobs/search`

- 상태나 제목으로 작업을 검색합니다.
- **요청**
  ```jsx
  Request query {
    page?: number, // default = 1
    limit?: number // default = 10
    search?: "title", // default = (every title)
    status?: "completed" // default = (every status)
  }
  ```
- **응답**
  ```jsx
  Response {
    success: true,
    message: '요청이 성공하였습니다.',
    data: {
      jobs: [
        {
          id: "uuid-uuid",
          title: "title",
          description: "description",
          status: "status",
          createdAt: "2025-05-09T12:10:52.971Z",
        },
        // more
      ]
    },
    error: null
  }
  ```

### GET `api/jobs/:id`

- 특정 작업의 상세 정보를 조회합니다.
- **응답**
  ```jsx
  Response {
    success: true,
    message: '요청이 성공하였습니다.',
    data: {
      job: {
        id: "uuid-uuid",
        title: "title",
        description: "description",
        status: "status",
        createdAt: "2025-05-09T12:10:52.971Z",
      }
    },
    error: null
  }
  ```

### POST `api/jobs`

- 새로운 작업을 생성합니다.
- **요청**
  ```jsx
  Request body {
    title: "title",
    description: "description",
    status?: "completed" // default = 'pending'
  }
  ```
- **응답**
  ```jsx
  Response {
    success: true,
    message: '요청이 성공하였습니다.',
    data: {
      id: "uuid-uuid-uuid-uuid",
      title: "title",
      description: "description",
      status: "completed",
      createdAt: "2025-05-09T12:10:52.971Z",
    },
    error: null
  }
  ```

## 💾 DB Model

### Job

- `/data/jobs.json` 파일에 위치합니다.
- 해당 파일의 **`jobs`** 키로, **배열 형태**로 저장됩니다.

```json
"jobs": [
  {
    "id": "f5a5342d-5181-4009-8226-4bd273c3c950",
    "title": "빨래하기",
    "description": "옷을 세탁기에 넣는다. 세제를 넣는다. 세탁기를 작동시킨다. 비가 오지 않길 기도한다.",
    "status": "pending",
    "createdAt": "2025-05-09T13:01:38.867Z"
  }
]
```

### JobIndex

- `/data/jobs-index.json` 파일에 위치합니다.
- 해당 파일의 **`jobsIndex`** 키로, **객체 형태**로 저장됩니다.
- `Job`의 UUID와 배열 내 index 값을 매핑하며, 상세 조회시 사용됩니다.

```json
"jobsIndex": {
  "f5a5342d-5181-4009-8226-4bd273c3c950": 0,
  "42f396da-59c5-4381-80af-b1d4361736c5": 1,
  "d521f134-90bd-4df1-ab5c-035dc00030dc": 2
}
```

## 👩‍💻 구현 세부사항 및 코멘트

### API 디자인 및 서빙 전략

- 각 기능별 책임 분리를 명확히 하기 위해 **Controller - Service - Repository 구조**를 적용했습니다.
- 작업 목록 조회 API와 작업 검색 API는 기능상 겹칠 수 있지만, 요구사항에 따라 별도의 API로 분리하였습니다.
- 목록 조회/검색 API에서, UX 향상 및 클라이언트 통신 비용을 고려해 **페이지네이션을 도입**하였습니다.
- `/src/common/dto/base-res.dto`를 통해 모든 응답을 통일 시켰습니다.
- API는 **Swagger**로 문서화하였습니다.

### 데이터 처리 및 성능 관리 전략

- 요구사항에 따라, 파일 기반 DB인 `node-json-db` 모듈을 통해 `/data` 파일에 데이터가 저장됩니다.
- `jobs.json`에는 작업 데이터를 배열 형태로 저장합니다.
  - 시간 순으로 생성되며, 목록 전체를 조회하거나 배치 처리하는 작업이 주이므로 배열이 더 자연스럽고 직관적이라고 생각했습니다.
  - 삭제나 중간 삽입 요구사항이 없었기에 충분히 효율적일 것이라고 생각했습니다.
- `jobs-index.json`은 (uuid -> 배열 index) 매핑 정보를 담아, **상세 조회 시 O(1) 수준의 빠른 접근**이 가능하도록 했습니다.
- 데이터의 길이가 필요할때 `node-json-db`의 `count` 메서드를 사용하면 되는데, 내부 동작이 궁금해 코드를 보다 중복되는 부분이 있음을 발견하였습니다. ([[해당 코드](https://github.com/Belphemur/node-json-db/blob/645d326ab4a961e4ce4987c963d18ae984b1583e/src/JsonDB.ts#L206)]) 따라서 **db가 제공해주는 메서드는 `getData`, `push` 두 개만 사용**하였습니다.

#### 배치 작업 관련

- 짧은 간격(1분)으로 실행되는 배치 작업에서, pending 상태의 작업을 그떄마다 필터링하는 비용이 클 거라고 생각했습니다.
- 따라서 서버 시작시 **`onModuleInit`** 훅을 활용해 비동기적으로 `pending 작업 목록`을 메모리에 올려(멤버 변수로 사용) **반복적인 파일 접근대신 상태처럼 관리**합니다.

### 기타 디테일

- `/src/common/interceptors/logging.interceptor`를 통해 **모든 성공 요청을 로깅**하도록 설계하였습니다.
- `/src/common/exceptions`에선, **커스텀 예외 클래스**를 구현해 비즈니스 로직에서 사용하고 있습니다. 또한 전역 예외 필터 구현을 통해 **에러 응답 포맷팅과 에러 로깅을 한 곳에서 관리**하도록 설계하였습니다.
- 위 인터셉터, 필터 관련은 Best Practice Repository([1](https://github.com/monstar-lab-oss/nestjs-starter-rest-api), [2](https://github.com/DevCamp-TeamSparta/backend-material))를 참고하여 작성하였습니다.
- **`winston`**을 사용해 앱 로거를 설정하였고, `winston-daily-rotate-file`을 통해 **매일(최대 7일간) 파일로 저장**되도록 설정하였습니다.
- Issue(Ticket) 발행 -> 작업별 브랜치 생성 -> PR -> main으로 Squash Merge 플로우로 작업하였습니다.
- `@typescript-eslint`, `prettier`, `import`, `jest` 등 주요 lint 플러그인을 활용하여 코드 품질을 자동 검사합니다.

### 코멘트

- 고민을 많이 하고, 작업 단위를 나눈 뒤 구현을 시작하였는데, 생각했던 것보다 늘어져서 시간 관계상 구현하지 못한 부분이 있어 아쉽습니다. 언제나 투자 시간을 넉넉히 생각해야 함을 다시금 깨닫게 되었습니다.
- 생각은 있었으나 미처 구현하지 못한 부분은 이렇습니다.
  - **Mutex**를 통한 동시 요청시 파일 데이터 무결성 보장
  - **k6**와 같은 도구를 통한 성능 테스트
  - **견고한 테스트 코드** 작성
    - 이를 위해 초반에 CI 스크립트도 도입하여서 아쉬움이 많이 남습니다.
      repo 계층 테스트 코드 작성중, `new`를 통해 생성되는 인스턴스에 대한 모킹은 아직 미흡하여 실DB와 연결되는 문제가 있었습니다. 시간 관계상 API 구현으로 넘어가 아직 해결하지 못하여서, 해당 부분은 다시 볼 예정입니다.
- 늘 DBMS만 쓰다가 파일 DB에 대해 고민할 수 있었던 좋은 기회였고, DBMS가 정말정말 쓰기 편하다는 생각이 들었습니다.

## 📁 디렉토리 구조

```
.
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── src
│   ├── app.module.ts
│   ├── app.option.ts
│   ├── common
│   │   ├── dto
│   │   │   ├── base-res.dto.ts
│   │   │   ├── error-res.dto.ts
│   │   │   ├── page-query.dto.ts
│   │   │   └── index.ts
│   │   ├── exceptions
│   │   │   ├── business.exception.ts
│   │   │   ├── db.exception.ts
│   │   │   ├── global-exception.filter.ts
│   │   │   └── index.ts
│   │   └── interceptors
│   │       ├── logging.interceptor.ts
│   │       └── index.ts
│   ├── jobs
│   │   ├── __test__
│   │   │   ├── jobs.repository.spec.ts
│   │   │   └── jobs.service.spec.ts
│   │   ├── dto
│   │   │   ├── create-job.dto.ts
│   │   │   ├── search-job-query.dto.ts
│   │   │   ├── job-res.dto.ts
│   │   │   └── index.ts
│   │   ├── types
│   │   │   ├── job.interface.ts
│   │   │   └── index.ts
│   │   ├── jobs.controller.ts
│   │   ├── jobs.module.ts
│   │   ├── jobs.repository.ts
│   │   └── jobs.service.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```
