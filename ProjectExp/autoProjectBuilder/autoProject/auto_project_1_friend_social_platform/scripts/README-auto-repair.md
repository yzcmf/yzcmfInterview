# 智能服务监控和自动修复系统

## 概述

本项目提供了两个智能监控脚本，用于自动检测和修复服务问题：

1. **`auto-repair-monitor.sh`** - 完整功能版本，包含详细报告和高级功能
2. **`quick-monitor.sh`** - 简化版本，专注于快速检查和修复

## 快速开始

### 1. 快速监控脚本 (推荐日常使用)

```bash
# 单次检查
./scripts/quick-monitor.sh check

# 持续监控 (60秒间隔)
./scripts/quick-monitor.sh monitor

# 持续监控 (30秒间隔)
./scripts/quick-monitor.sh monitor 30
```

### 2. 完整功能监控脚本

```bash
# 单次检查和修复
./scripts/auto-repair-monitor.sh check

# 持续监控 (5分钟间隔)
./scripts/auto-repair-monitor.sh monitor

# 自定义间隔监控 (2分钟)
./scripts/auto-repair-monitor.sh monitor --interval 120

# 生成状态报告
./scripts/auto-repair-monitor.sh report

# 清理旧报告
./scripts/auto-repair-monitor.sh cleanup
```

## 功能特性

### ✨ 智能检测
- 自动检测服务运行状态
- 端口占用检查
- 健康状态验证
- 实时状态更新

### 🔧 自动修复
- 并行修复多个服务
- 智能重试机制
- 失败服务识别
- 修复历史记录

### 📊 详细报告
- JSON格式修复报告
- 服务健康度统计
- 修复建议生成
- 历史记录追踪

### 🔄 持续监控
- 可配置检查间隔
- 后台运行支持
- 优雅停止处理
- 系统通知集成

### ⚡ 性能优化
- 并行处理
- 非阻塞操作
- 资源使用优化
- 快速响应

## 监控的服务

| 服务 | 端口 | 检查方式 | 修复方式 |
|------|------|----------|----------|
| 后端服务 | 8000 | 端口 + 健康检查 | 重启服务 |
| AI服务 | 8001 | 端口 + 健康检查 | 重启服务 |
| Redis | 6379 | 端口检查 | 启动服务 |
| 前端服务 | 3000 | 端口检查 | 前端管理器 |

## 配置选项

### 环境变量

```bash
# 检查间隔 (秒)
export CHECK_INTERVAL=300

# 最大修复尝试次数
export MAX_REPAIR_ATTEMPTS=3

# 是否启用通知
export ENABLE_NOTIFICATIONS=true

# 保留的最大报告数
export MAX_REPORTS=10
```

### 命令行选项

```bash
# 设置检查间隔
--interval SECONDS

# 设置最大修复尝试次数
--max-attempts NUM

# 禁用通知
--no-notifications

# 设置保留的最大报告数
--max-reports NUM
```

## 使用场景

### 1. 开发环境监控
```bash
# 快速检查开发环境
./scripts/quick-monitor.sh check

# 持续监控 (30秒间隔)
./scripts/quick-monitor.sh monitor 30
```

### 2. 生产环境监控
```bash
# 完整监控 (5分钟间隔)
./scripts/auto-repair-monitor.sh monitor --interval 300

# 后台运行
nohup ./scripts/auto-repair-monitor.sh monitor > monitor.log 2>&1 &
```

### 3. 故障排查
```bash
# 生成详细报告
./scripts/auto-repair-monitor.sh report

# 查看修复历史
cat reports/repair-report-*.json | jq '.summary'
```

### 4. 定期维护
```bash
# 清理旧报告
./scripts/auto-repair-monitor.sh cleanup

# 检查系统状态
./scripts/auto-repair-monitor.sh check
```

## 输出示例

### 快速监控输出
```
[14:30:15] 🔍 快速检查服务状态...
✅ backend: 运行中
⚠️  ai: 已停止
✅ redis: 运行中
✅ frontend: 运行中

[14:30:15] 📊 状态摘要: 3/4 个服务正常运行

[14:30:15] 🔧 开始自动修复...
[14:30:15] 修复 ai...
✅ ai 修复成功

[14:30:16] 成功修复 1 个服务
```

### 完整监控输出
```
[2024-01-15 14:30:15] [INFO] 🔍 检查所有服务状态...
[2024-01-15 14:30:15] [SUCCESS] ✅ backend: healthy
[2024-01-15 14:30:15] [WARNING] ⚠️  ai: stopped
[2024-01-15 14:30:15] [SUCCESS] ✅ redis: running
[2024-01-15 14:30:15] [INFO] 服务健康度: 2/4

[2024-01-15 14:30:15] [INFO] 🔧 开始批量修复 2 个服务...
[2024-01-15 14:30:16] [SUCCESS] 服务 ai 修复成功
[2024-01-15 14:30:16] [SUCCESS] 成功修复 1 个服务

==================================
📋 修复报告摘要
==================================
检查时间: 2024-01-15 14:30:15
总服务数: 4
健康服务: 3
修复服务: 1
失败服务: 0
==================================
```

## 故障排除

### 常见问题

1. **权限问题**
   ```bash
   chmod +x scripts/*.sh
   ```

2. **依赖缺失**
   ```bash
   # 安装 jq (用于JSON处理)
   brew install jq  # macOS
   apt-get install jq  # Ubuntu
   ```

3. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :8000
   
   # 停止冲突进程
   kill -9 $(lsof -ti :8000)
   ```

4. **服务启动失败**
   ```bash
   # 查看详细日志
   tail -f logs/backend.log
   tail -f logs/ai-service.log
   ```

### 调试模式

```bash
# 启用详细日志
DEBUG=true ./scripts/auto-repair-monitor.sh check

# 查看监控日志
tail -f logs/auto-repair-monitor.log
```

## 集成建议

### 1. 系统服务集成
```bash
# 创建系统服务文件
sudo nano /etc/systemd/system/auto-repair-monitor.service

# 启动服务
sudo systemctl enable auto-repair-monitor
sudo systemctl start auto-repair-monitor
```

### 2. Cron 任务集成
```bash
# 编辑 crontab
crontab -e

# 每5分钟检查一次
*/5 * * * * /path/to/project/scripts/quick-monitor.sh check
```

### 3. CI/CD 集成
```yaml
# GitHub Actions 示例
- name: Service Health Check
  run: |
    ./scripts/auto-repair-monitor.sh check
    if [ $? -ne 0 ]; then
      echo "Service health check failed"
      exit 1
    fi
```

## 最佳实践

1. **开发环境**: 使用 `quick-monitor.sh` 进行快速检查
2. **生产环境**: 使用 `auto-repair-monitor.sh` 进行完整监控
3. **监控间隔**: 开发环境30-60秒，生产环境5-15分钟
4. **日志管理**: 定期清理旧日志和报告文件
5. **通知配置**: 根据环境配置适当的通知方式

## 扩展功能

### 自定义服务监控
在脚本中添加新的服务监控：

1. 在端口配置中添加新端口
2. 在 `get_service_status()` 函数中添加服务检查逻辑
3. 在 `auto_repair_service()` 函数中添加修复逻辑

### 自定义修复策略
根据服务特点定制修复策略：

1. 数据库服务: 检查连接池状态
2. 缓存服务: 检查内存使用情况
3. 前端服务: 检查构建状态

## 支持

如有问题或建议，请：

1. 查看日志文件: `logs/auto-repair-monitor.log`
2. 检查修复报告: `reports/repair-report-*.json`
3. 运行诊断命令: `./scripts/service-manager.sh diagnose [service]` 