# tmap-coding-test

--- 

### 1. 프로젝트 구조
```text
tmap-coding-test/
├── app/
│   ├── controllers/
│   │   └── indexController.js          # 메인 컨트롤러
│   ├── mapper/
│   │   └── index-mapper.xml            # MyBatis SQL 매퍼
│   ├── models/
│   │   ├── baseModel.js               # 베이스 모델
│   │   └── indexModel.js              # 인덱스 모델
│   ├── modules/
│   │   ├── db.psql.js                 # PostgreSQL 연결 모듈
│   │   └── func-common.js             # 공통 함수 모듈
│   ├── routes/
│   │   └── index.js                   # 라우터 설정
│   └── views/
│       ├── index.ejs                  # 메인 페이지
│       └── error.ejs                  # 에러 페이지
├── public/
│   ├── images/
│   │   ├── pin-location.svg           # POI 마커 아이콘
│   │   └── pin-red.svg               # 현재 위치 마커 아이콘
│   └── stylesheets/
│       └── style.css                  # 스타일시트
├── package.json                       # 의존성 관리
├── app.js                            # Express 앱 설정
├── config.json                       # 설정 파일
└── .env                              # 환경 변수 (T-map API 키 포함)
```

### 2. DB Schema
```sql
-- excel import -> 기존 데이터 덮어쓰기
CREATE TABLE poi_data (
    title VARCHAR(255) PRIMARY KEY,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8)
);
```


### 3. 프로젝트 실행
#### 1) 사전 설정
```text
# .env 파일에 Tmap Api key 꼭 설정해주세요.
TMAP_APP_KEY=*appKey*
```

#### 2) install & run
```
# 패키지 의존성 설치
npm install

# 서버 실행 (default port : 3535)
npm start
```

#### 3) 접속
`http://localhost:3535/index` 접속


#### 4. Controller List
- getScript : Tmap api 데이터 조회 후 return
- uploadPoi : 엑셀 데이터 DB 입력
- getPoiList : DB 에 입력된 데이터 조회 후 return
