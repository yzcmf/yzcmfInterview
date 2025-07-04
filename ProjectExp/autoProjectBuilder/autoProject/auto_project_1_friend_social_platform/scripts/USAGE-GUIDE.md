# 🚀 智能服务监控和自动修复系统 - 使用指南

## 📋 概述

本系统提供了完整的服务监控和自动修复解决方案，包含三个核心脚本：

1. **`quick-monitor.sh`** - 快速监控脚本 (推荐日常使用)
2. **`auto-repair-monitor.sh`** - 完整功能监控脚本
3. **`start-monitoring.sh`** - 一键启动所有监控服务

## 🎯 快速开始

### 方法一：一键启动 (推荐)

```bash
# 启动所有监控服务
./scripts/start-monitoring.sh start

# 查看状态
./scripts/start-monitoring.sh status

# 停止所有监控
./scripts/start-monitoring.sh stop
```

### 方法二：单独使用

```bash
# 快速检查 (推荐日常使用)
./scripts/quick-monitor.sh check

# 持续监控 (30秒间隔)
./scripts/quick-monitor.sh monitor 30

# 完整功能监控 (5分钟间隔)
./scripts/auto-repair-monitor.sh monitor --interval 300
```

## 🔧 核心功能

### ✨ 智能检测
- **端口检查**: 自动检测服务端口占用情况
- **健康检查**: 验证服务健康状态 (支持 /health 接口)
- **状态分类**: 运行中/已停止/不健康
- **实时更新**: 动态状态监控

### 🛠️ 自动修复
- **并行修复**: 同时修复多个服务，提高效率
- **智能重试**: 可配置最大重试次数
- **失败识别**: 自动识别无法修复的服务
- **修复历史**: 记录所有修复操作

### 📊 详细报告
- **JSON报告**: 结构化的修复报告
- **健康统计**: 服务健康度统计
- **修复建议**: 针对失败服务的建议
- **历史追踪**: 完整的修复历史记录

### 🔄 持续监控
- **可配置间隔**: 支持自定义检查间隔
- **后台运行**: 支持后台持续监控
- **优雅停止**: 支持 Ctrl+C 优雅停止
- **系统通知**: 集成系统通知功能

## 📈 使用场景

### 🏠 开发环境
```bash
# 快速检查开发环境
./scripts/quick-monitor.sh check

# 持续监控 (30秒间隔)
./scripts/quick-monitor.sh monitor 30

# 查看状态
./scripts/start-monitoring.sh status
```

### 🏭 生产环境
```bash
# 启动完整监控 (5分钟间隔)
./scripts/auto-repair-monitor.sh monitor --interval 300

# 后台运行
nohup ./scripts/auto-repair-monitor.sh monitor > monitor.log 2>&1 &

# 生成详细报告
./scripts/auto-repair-monitor.sh report
```

### 🔍 故障排查
```bash
# 快速诊断
./scripts/quick-monitor.sh check

# 详细分析
./scripts/auto-repair-monitor.sh check

# 查看修复报告
cat reports/repair-report-*.json | jq '.summary'

# 查看日志
./scripts/start-monitoring.sh logs quick-monitor
```

## 🎛️ 配置选项

### 环境变量配置
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

## 📊 监控的服务

| 服务 | 端口 | 检查方式 | 修复方式 | 状态 |
|------|------|----------|----------|------|
| 后端服务 | 8000 | 端口 + 健康检查 | 重启服务 | ✅ |
| AI服务 | 8001 | 端口 + 健康检查 | 重启服务 | ✅ |
| Redis | 6379 | 端口检查 | 启动服务 | ✅ |
| 前端服务 | 3000 | 端口检查 | 前端管理器 | ⚠️ |

## 🚀 一键启动脚本

### 完整功能
```bash
# 启动所有监控服务
./scripts/start-monitoring.sh start

# 查看服务状态
./scripts/start-monitoring.sh status

# 查看日志
./scripts/start-monitoring.sh logs quick-monitor

# 快速检查
./scripts/start-monitoring.sh check

# 停止所有服务
./scripts/start-monitoring.sh stop

# 重启所有服务
./scripts/start-monitoring.sh restart
```

### 启动的服务
1. **服务管理器**: 自动启动基础服务
2. **快速监控**: 30秒间隔的快速检查
3. **完整监控**: 5分钟间隔的详细监控

## 📝 输出示例

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

## 🔧 故障排除

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

## 🎯 最佳实践

### 开发环境
- 使用 `quick-monitor.sh` 进行快速检查
- 设置30-60秒的检查间隔
- 关注实时状态变化

### 生产环境
- 使用 `auto-repair-monitor.sh` 进行完整监控
- 设置5-15分钟的检查间隔
- 启用详细报告和通知

### 监控策略
- **高频检查**: 开发环境，快速发现问题
- **低频检查**: 生产环境，减少资源消耗
- **智能修复**: 自动修复常见问题
- **人工干预**: 复杂问题需要手动处理

## 🔄 集成建议

### 系统服务集成
```bash
# 创建系统服务文件
sudo nano /etc/systemd/system/auto-repair-monitor.service

# 启动服务
sudo systemctl enable auto-repair-monitor
sudo systemctl start auto-repair-monitor
```

### Cron 任务集成
```bash
# 编辑 crontab
crontab -e

# 每5分钟检查一次
*/5 * * * * /path/to/project/scripts/quick-monitor.sh check
```

### CI/CD 集成
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

## 📚 扩展功能

### 自定义服务监控
1. 在端口配置中添加新端口
2. 在 `get_service_status()` 函数中添加服务检查逻辑
3. 在 `auto_repair_service()` 函数中添加修复逻辑

### 自定义修复策略
- **数据库服务**: 检查连接池状态
- **缓存服务**: 检查内存使用情况
- **前端服务**: 检查构建状态

## 🆘 支持

### 日志文件
- 监控日志: `logs/auto-repair-monitor.log`
- 快速监控: `logs/quick-monitor.log`
- 服务管理器: `logs/service-manager.log`

### 修复报告
- 位置: `reports/repair-report-*.json`
- 格式: JSON格式，包含详细统计
- 保留: 自动清理旧报告

### 诊断命令
```bash
# 服务诊断
./scripts/service-manager.sh diagnose [service]

# 状态检查
./scripts/start-monitoring.sh status

# 日志查看
./scripts/start-monitoring.sh logs [service]
```

## 🎉 总结

这个智能监控系统提供了：

1. **快速响应**: 30秒内检测和修复问题
2. **智能修复**: 自动处理常见故障
3. **详细报告**: 完整的修复历史和统计
4. **易于使用**: 一键启动，简单配置
5. **高度可定制**: 支持自定义服务和修复策略

**推荐使用流程**:
1. 开发环境: `./scripts/quick-monitor.sh monitor 30`
2. 生产环境: `./scripts/start-monitoring.sh start`
3. 故障排查: `./scripts/auto-repair-monitor.sh check`
4. 定期维护: `./scripts/auto-repair-monitor.sh cleanup` 