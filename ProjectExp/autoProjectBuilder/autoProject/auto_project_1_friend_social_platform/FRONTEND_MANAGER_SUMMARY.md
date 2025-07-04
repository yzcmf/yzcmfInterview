# 前端管理器 (Frontend Manager) 总结

## 概述

我已经为你的项目创建了一个强大的前端管理脚本，允许你轻松管理多个前端项目。这个脚本位于 `scripts/frontend-manager.sh`，提供了完整的前端项目管理功能。

## 🎯 主要功能

### 1. 多前端项目管理
- 在 `frontends/` 目录下管理多个前端项目
- 自动检测和验证前端项目
- 显示项目详细信息（名称、版本、路径、依赖状态）

### 2. 智能包管理器支持
- 自动检测 npm、yarn、pnpm
- 根据 lock 文件选择合适的包管理器
- 自动安装缺失的包管理器

### 3. 项目模板选择
- **Next.js** (推荐) - 全栈 React 框架
- **React + Vite** - 快速 React 开发
- **Vue + Vite** - Vue.js 开发
- **空白项目** - 自定义配置

### 4. 服务管理
- 启动、停止、重启前端服务
- 端口冲突检测和解决
- 自动依赖安装
- 日志管理和监控

## 🚀 快速开始

### 基本命令

```bash
# 列出所有前端项目
./scripts/frontend-manager.sh list

# 交互式选择前端
./scripts/frontend-manager.sh select

# 创建新的前端项目
./scripts/frontend-manager.sh create my-new-frontend

# 启动前端服务
./scripts/frontend-manager.sh start

# 检查状态
./scripts/frontend-manager.sh status
```

### 通过服务管理器使用

```bash
# 列出所有前端项目
./scripts/service-manager.sh frontend list

# 交互式选择前端
./scripts/service-manager.sh frontend select

# 创建新的前端项目
./scripts/service-manager.sh frontend create

# 启动前端服务
./scripts/service-manager.sh frontend start
```

## 📁 项目结构

```
frontends/
├── frondend1/          # 现有的前端项目
│   ├── package.json
│   ├── app/
│   ├── components/
│   └── ...
├── my-new-frontend/    # 新创建的前端项目
│   ├── package.json
│   ├── src/
│   └── ...
└── ...
```

## 🔧 当前状态

### 检测到的项目
- **frondend1**: my-v0-project (v0.1.0)
  - 状态: 依赖未安装
  - 路径: `frontends/frondend1`

### 激活状态
- 当前没有设置激活的前端项目

## 📋 完整命令列表

| 命令 | 描述 | 示例 |
|------|------|------|
| `list` | 列出所有前端项目 | `./scripts/frontend-manager.sh list` |
| `select` | 交互式选择前端项目 | `./scripts/frontend-manager.sh select` |
| `switch <name>` | 切换到指定前端项目 | `./scripts/frontend-manager.sh switch frondend1` |
| `start [name]` | 启动前端服务 | `./scripts/frontend-manager.sh start` |
| `stop` | 停止前端服务 | `./scripts/frontend-manager.sh stop` |
| `restart` | 重启前端服务 | `./scripts/frontend-manager.sh restart` |
| `status` | 检查前端状态 | `./scripts/frontend-manager.sh status` |
| `logs` | 显示前端日志 | `./scripts/frontend-manager.sh logs` |
| `create [name]` | 创建新的前端项目 | `./scripts/frontend-manager.sh create my-app` |
| `delete <name>` | 删除前端项目 | `./scripts/frontend-manager.sh delete old-app` |
| `install <name>` | 安装前端依赖 | `./scripts/frontend-manager.sh install frondend1` |

## 🎨 特性亮点

### ✨ 智能检测
- 自动检测项目类型和包管理器
- 验证项目完整性
- 检查依赖安装状态

### ✨ 用户友好
- 彩色输出和状态指示
- 交互式选择界面
- 详细的错误信息和解决建议

### ✨ 集成化
- 与现有服务管理器完美集成
- 统一的日志管理
- 端口冲突自动处理

### ✨ 可扩展
- 支持多种项目模板
- 可自定义配置
- 易于扩展新功能

## 🔄 工作流程示例

### 1. 首次使用
```bash
# 查看现有项目
./scripts/frontend-manager.sh list

# 选择并激活项目
./scripts/frontend-manager.sh select

# 安装依赖并启动
./scripts/frontend-manager.sh install
./scripts/frontend-manager.sh start
```

### 2. 创建新项目
```bash
# 创建新的 Next.js 项目
./scripts/frontend-manager.sh create my-nextjs-app

# 自动设置为激活项目并启动
```

### 3. 切换项目
```bash
# 切换到不同项目
./scripts/frontend-manager.sh switch frondend1

# 自动停止当前项目并启动新项目
```

## 📊 集成到现有系统

### 服务管理器集成
- 前端管理器已集成到 `service-manager.sh`
- 使用 `./scripts/service-manager.sh frontend [command]` 访问
- 自动启动时优先使用前端管理器

### 日志系统
- 前端日志保存在 `logs/frontend.log`
- 统一的日志格式和管理
- 实时日志查看功能

### 状态管理
- 激活的前端信息保存在 `.active-frontend`
- 持久化配置
- 状态检查和恢复

## 🛠️ 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   ./scripts/frontend-manager.sh stop
   ./scripts/frontend-manager.sh start
   ```

2. **依赖安装失败**
   ```bash
   ./scripts/frontend-manager.sh install <frontend-name>
   ```

3. **项目验证失败**
   - 确保项目包含 `package.json`
   - 检查目录权限

### 调试命令
```bash
# 检查状态
./scripts/frontend-manager.sh status

# 查看日志
./scripts/frontend-manager.sh logs

# 重启服务
./scripts/frontend-manager.sh restart
```

## 📚 文档

- **详细文档**: `scripts/README-frontend-manager.md`
- **演示脚本**: `scripts/demo-frontend-manager.sh`
- **帮助信息**: `./scripts/frontend-manager.sh help`

## 🎯 下一步建议

1. **激活现有项目**: 使用 `./scripts/frontend-manager.sh select` 选择 `frondend1`
2. **安装依赖**: 运行 `./scripts/frontend-manager.sh install frondend1`
3. **启动服务**: 执行 `./scripts/frontend-manager.sh start`
4. **创建新项目**: 使用 `./scripts/frontend-manager.sh create` 创建新的前端项目

## 🔗 相关文件

- `scripts/frontend-manager.sh` - 主脚本
- `scripts/README-frontend-manager.md` - 详细文档
- `scripts/demo-frontend-manager.sh` - 演示脚本
- `scripts/service-manager.sh` - 集成服务管理器
- `frontends/` - 前端项目目录
- `.active-frontend` - 激活前端配置
- `logs/frontend.log` - 前端日志文件

---

**开始使用**: `./scripts/frontend-manager.sh help` 