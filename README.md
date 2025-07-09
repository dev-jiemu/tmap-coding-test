# tmap-coding-test

### DB Schema
```sql
-- excel import -> 기존 데이터 덮어쓰기
CREATE TABLE poi_data (
    title VARCHAR(255) PRIMARY KEY,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8)
);
```

