# 服务管理指南

## 📋 概述

本项目提供了完整的服务管理脚本，用于检查、启动、停止和调试所有服务。

## 🛠️ 可用脚本

### 1. 服务管理器 (`scripts/service-manager.sh`)

功能最全面的服务管理脚本，支持所有操作。

#### 基本用法

```bash
# 检查所有服务状态
./scripts/service-manager.sh check

# 启动所有服务
./scripts/service-manager.sh start

# 启动特定服务
./scripts/service-manager.sh start backend
./scripts/service-manager.sh start ai
./scripts/service-manager.sh start redis

# 停止所有服务
./scripts/service-manager.sh stop

# 停止特定服务
./scripts/service-manager.sh stop backend

# 重启特定服务
./scripts/service-manager.sh restart backend
./scripts/service-manager.sh restart ai

# 查看服务日志
./scripts/service-manager.sh logs backend
./scripts/service-manager.sh logs ai
./scripts/service-manager.sh logs redis

# 调试服务
./scripts/service-manager.sh debug backend
./scripts/service-manager.sh debug ai
./scripts/service-manager.sh debug redis

# 显示帮助
./scripts/service-manager.sh help
```

### 2. 快速启动脚本 (`scripts/quick-start.sh`)

一键启动所有服务的简化脚本。

```bash
# 快速启动所有服务
./scripts/quick-start.sh
```

## 🔧 服务配置

### 服务端口

| 服务 | 端口 | 说明 |
|------|------|------|
| 后端API | 8000 | Node.js Express服务 |
| AI服务 | 8001 | Python FastAPI服务 |
| Redis | 6379 | 缓存服务 |
| PostgreSQL | 5432 | 数据库服务（可选） |
| 前端 | 3000 | Next.js前端服务 |

### 环境变量

确保 `.env` 文件包含以下配置：

```env
# 后端服务
PORT=8000
NODE_ENV=development
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# 数据库
DATABASE_URL=postgresql://postgres:password@localhost:5432/social_platform
# 或者使用SQLite
# DATABASE_URL=file:./dev.db

# Redis
REDIS_URL=redis://localhost:6379

# AI服务
AI_SERVICE_URL=http://localhost:8001

# 前端
FRONTEND_URL=http://localhost:3000
```

## 🚀 快速开始

### 1. 首次启动

```bash
# 设置开发环境
./scripts/setup-local.sh

# 快速启动所有服务
./scripts/quick-start.sh
```

### 2. 日常开发

```bash
# 检查服务状态
./scripts/service-manager.sh check

# 启动所有服务
./scripts/service-manager.sh start

# 查看后端日志
./scripts/service-manager.sh logs backend

# 重启AI服务
./scripts/service-manager.sh restart ai
```

## 🔍 故障排除

### 常见问题

#### 1. 端口被占用

```bash
# 查看端口占用情况
lsof -i :8000
lsof -i :8001
lsof -i :6379

# 停止占用端口的进程
kill -9 <PID>
```

#### 2. 服务启动失败

```bash
# 查看服务日志
./scripts/service-manager.sh logs backend
./scripts/service-manager.sh logs ai

# 调试服务
./scripts/service-manager.sh debug backend
```

#### 3. 依赖问题

```bash
# 重新安装后端依赖
cd backend && npm install

# 重新安装AI服务依赖
cd ai-service && pip3 install -r requirements.txt
```

#### 4. Redis连接问题

```bash
# 检查Redis是否运行
redis-cli ping

# 重启Redis
./scripts/service-manager.sh restart redis
```

### 调试命令

#### 检查服务状态

```bash
# 检查所有服务
./scripts/service-manager.sh check

# 检查特定服务
lsof -i :8000  # 后端
lsof -i :8001  # AI服务
lsof -i :6379  # Redis
```

#### 查看进程

```bash
# 查看Node.js进程
ps aux | grep node

# 查看Python进程
ps aux | grep python

# 查看Redis进程
ps aux | grep redis
```

#### 查看日志

```bash
# 实时查看后端日志
tail -f logs/backend.log

# 实时查看AI服务日志
tail -f logs/ai-service.log

# 实时查看Redis日志
tail -f logs/redis.log
```

## 📊 监控和健康检查

### 健康检查端点

- 后端服务: `http://localhost:8000/health`
- AI服务: `http://localhost:8001/health`

### 手动健康检查

```bash
# 检查后端服务
curl http://localhost:8000/health

# 检查AI服务
curl http://localhost:8001/health

# 检查Redis
redis-cli ping
```

## 🔄 服务重启策略

### 开发环境重启

```bash
# 重启单个服务
./scripts/service-manager.sh restart backend

# 重启所有服务
./scripts/service-manager.sh stop
./scripts/service-manager.sh start
```

### 生产环境重启

```bash
# 优雅重启（保持服务可用）
./scripts/service-manager.sh restart backend
./scripts/service-manager.sh restart ai

# 强制重启
./scripts/service-manager.sh stop
sleep 5
./scripts/service-manager.sh start
```

## 📝 日志管理

### 日志文件位置

- 后端日志: `logs/backend.log`
- AI服务日志: `logs/ai-service.log`
- Redis日志: `logs/redis.log`

### 日志查看命令

```bash
# 查看最新日志
tail -n 100 logs/backend.log

# 实时查看日志
tail -f logs/backend.log

# 搜索错误日志
grep "ERROR" logs/backend.log

# 查看特定时间段的日志
sed -n '/2024-01-01 10:00/,/2024-01-01 11:00/p' logs/backend.log
```

## 🛡️ 安全注意事项

### 开发环境

1. 使用强密码和密钥
2. 不要将敏感信息提交到版本控制
3. 定期更新依赖包
4. 使用环境变量管理配置

### 生产环境

1. 启用HTTPS
2. 配置防火墙
3. 使用强认证
4. 定期备份数据
5. 监控服务状态

## 📞 获取帮助

### 脚本帮助

```bash
./scripts/service-manager.sh help
```

### 文档资源

- 项目结构: `project-structure.md`
- API文档: `docs/api-documentation.md`
- 前端开发: `FRONTEND_V0_GUIDE.md`

### 常见错误代码

| 错误代码 | 描述 | 解决方案 |
|----------|------|----------|
| EADDRINUSE | 端口被占用 | 停止占用端口的进程 |
| ECONNREFUSED | 连接被拒绝 | 检查服务是否启动 |
| ENOENT | 文件不存在 | 检查文件路径 |
| EACCES | 权限不足 | 检查文件权限 |

---

*最后更新时间: 2024年12月* 