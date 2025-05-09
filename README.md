# Job Manager

## 📌 개요

NestJS로 구축된 간단한 **작업(Job) 관리 REST API 서버**입니다.  
API를 통해 작업을 조회, 검색, 생성할 수 있고, `@nestjs/scheduler` 모듈을 통한 주기적인 작업 상태 업데이트 작업을 수행합니다. 데이터는 `node-json-db` 를 통해 `api/data` 에 파일로 저장됩니다. 성공 요청을 로깅하며, `/logs/${date}` 파일에 최대 7일간 저장됩니다. 에러 로그는 `/logs/error.log`에 따로 저장합니다.

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

- 설명: 모든 작업 목록을 조회합니다.
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

- 설명: 상태나 제목으로 작업을 검색합니다.
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

- 설명: 특정 작업의 상세 정보를 조회합니다.
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

- 설명: 새로운 작업을 생성합니다.
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
- 해당 파일의 `jobsIndex` 키로, 객체 형태로 저장됩니다.
- `Job`의 인덱스 역할을 하며, 상세 조회시 사용됩니다.

```json
"jobsIndex": {
  "f5a5342d-5181-4009-8226-4bd273c3c950": 0,
  "42f396da-59c5-4381-80af-b1d4361736c5": 1,
  "d521f134-90bd-4df1-ab5c-035dc00030dc": 2
}
```

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
