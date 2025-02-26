# 在线测试系统数据库设计文档

##  deepseek prompt:
```md
请设计一个在线测试系统的数据库, 要求:
1. 用户表 (user), 包含用户ID, 用户名, 邮箱, 密码等字段。
2. 角色表 (role), 包含角色ID, 角色名称(tutor, tutee)等字段. 一个用户只能属于一个角色.
3. 测试表 (test), 包含测试ID, 测试名称, 创建时间等字段.
4. 题目表 (question), 包含题目ID, 题目内容, 选项A, 选项B, 选项C, 选项D, 正确答案, 原因解释, 难度(easy, medium, hard)等字段.
5. 用户角色关联表 (user_role), 包含用户ID和角色ID, 表示用户拥有某个角色.
6. 测试题目关联表 (test_question), 包含测试ID和题目ID, 表示测试包含哪些题目.
7. 分类表 (category), 包含分类ID, 分类名称等字段.
8. 题目分类关联表 (category_question), 包含分类ID和题目ID, 表示某个分类包含哪些题目. 一个题目只属于一个分类.
9. 测试结果表 (test_result), 包含测试结果ID, 用户ID, 测试ID, 得分, 出错题目ID列表, 提交时间等字段.
10. 系统使用PostgreSQL数据库。
```

## 数据库架构概览
本系统采用PostgreSQL 12+版本，包含10张核心表，支持用户管理、角色控制、试题管理、测试组织和结果分析等功能。

## 数据表结构设计

### 1. 用户表 (user)
```sql
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL CHECK (length(password_hash) >= 60),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```
**字段说明**：
- `user_id`: 自增主键
- `username`: 唯一用户名（不区分大小写）
- `email`: 唯一邮箱地址
- `password_hash`: BCrypt加密后的密码（最小60字符）
- `created_at`: 带时区的创建时间戳

### 2. 角色表 (role)
```sql
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(20) NOT NULL CHECK (role_name IN ('tutor', 'tutee')),
    UNIQUE(role_name)
);
```
**预置数据**：
```sql
INSERT INTO role (role_name) VALUES ('tutor'), ('tutee');
```

### 3. 用户角色关联表 (user_role)
```sql
CREATE TABLE user_role (
    user_id INT PRIMARY KEY REFERENCES "user"(user_id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES role(role_id) ON DELETE RESTRICT
);
```
**约束**：
- 每个用户只能有一个角色（通过主键约束实现）
- 删除用户时自动删除关联
- 禁止删除正在使用的角色

### 4. 测试表 (test)
```sql
CREATE TABLE test (
    test_id SERIAL PRIMARY KEY,
    test_name VARCHAR(255) NOT NULL,
    created_by INT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### 5. 题目表 (question)
```sql
CREATE TABLE question (
    question_id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A','B','C','D')),
    explanation TEXT,
    difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
    category_id INT REFERENCES category(category_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_modified_by INT REFERENCES "user"(user_id);
);
```

### 6. 测试题目关联表 (test_question)
```sql
CREATE TABLE test_question (
    test_id INT REFERENCES test(test_id) ON DELETE CASCADE,
    question_id INT REFERENCES question(question_id) ON DELETE CASCADE,
    question_order SMALLINT NOT NULL CHECK (question_order > 0),
    PRIMARY KEY (test_id, question_id)
);
```

### 7. 分类表 (category)
```sql
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    parent_id INT REFERENCES category(category_id) ON DELETE CASCADE
);
```

### 8. 测试结果表 (test_result)
```sql
CREATE TABLE test_result (
    result_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    test_id INT NOT NULL REFERENCES test(test_id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 0),
    wrong_questions JSONB,
    time_used INTERVAL,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_attempt UNIQUE (user_id, test_id, submitted_at)
);
```

### 9. 添加试卷难度分析视图 (test_difficulty_analysis)
```sql
CREATE VIEW test_difficulty_analysis AS
SELECT 
    t.test_id,
    COUNT(*) AS total_questions,
    COUNT(*) FILTER (WHERE q.difficulty = 'easy') AS easy_count,
    COUNT(*) FILTER (WHERE q.difficulty = 'medium') AS medium_count,
    COUNT(*) FILTER (WHERE q.difficulty = 'hard') AS hard_count
FROM test t
JOIN test_question tq ON t.test_id = tq.test_id
JOIN question q ON tq.question_id = q.question_id
GROUP BY t.test_id;
```

## 高级功能实现

### 自动更新时间戳
```sql
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_test_modtime 
BEFORE UPDATE ON test 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
```

### 性能优化索引
```sql
-- 用户表
CREATE INDEX idx_user_username ON "user"(username);

-- 题目表
CREATE INDEX idx_question_difficulty ON question(difficulty);
CREATE INDEX idx_question_category ON question(category_id);

-- 测试表
CREATE INDEX idx_test_created_by ON test(created_by);

-- 分类表
CREATE INDEX idx_category_parent ON category(parent_id);

-- 测试结果表
CREATE INDEX idx_test_result_user_test ON test_result(user_id, test_id);
CREATE INDEX idx_test_result_submitted ON test_result USING BRIN (submitted_at);
```

## 数据表示例

### 创建导师用户
```sql
WITH new_user AS (
  INSERT INTO "user" (username, email, password_hash)
  VALUES ('prof_zhang', 'zhang@univ.edu', '$2a$12$...')
  RETURNING user_id
)
INSERT INTO user_role (user_id, role_id)
SELECT user_id, (SELECT role_id FROM role WHERE role_name = 'tutor')
FROM new_user;
```

### 记录测试结果
```sql
INSERT INTO test_result (user_id, test_id, score, wrong_questions, time_used)
VALUES (123, 456, 85, 
'{
  "wrong_questions": [
    {
      "question_id": 789,
      "selected": "B",
      "correct": "C",
      "time_spent": "00:01:23"
    }
  ]
}', 
'00:45:00');
```

## 数据库部署建议

1. **分区策略**：
```sql
-- 按年分区的测试结果表
CREATE TABLE test_result_2023 PARTITION OF test_result
FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
```

2. **连接池配置**：
- 推荐使用PgBouncer连接池
- 设置最大连接数= CPU核心数 * 2 + 1

3. **备份策略**：
```bash
# 每日全量备份
pg_dump -Fc -d exam_system > exam_backup.dump
```

4. **监控指标**：
- 查询延迟（P99）
- 活跃连接数
- 缓存命中率
- 死锁发生率
