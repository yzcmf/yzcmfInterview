# 前端管理脚本 (Frontend Manager)

这个脚本允许你管理多个前端项目，轻松切换不同的前端实现。

## 功能特性

✨ **多前端项目管理** - 在 `frontends/` 目录下管理多个前端项目
✨ **智能包管理器检测** - 自动检测并使用 npm、yarn 或 pnpm
✨ **项目模板选择** - 支持 Next.js、React、Vue 等模板
✨ **端口冲突处理** - 自动检测和解决端口冲突
✨ **依赖自动安装** - 自动安装缺失的依赖
✨ **日志管理** - 统一的前端日志管理

## 快速开始

### 1. 列出所有前端项目
```bash
./scripts/frontend-manager.sh list
```

### 2. 交互式选择前端
```bash
./scripts/frontend-manager.sh select
```

### 3. 创建新的前端项目
```bash
./scripts/frontend-manager.sh create my-new-frontend
```

### 4. 启动前端服务
```bash
./scripts/frontend-manager.sh start
```

## 完整命令列表

| 命令 | 描述 | 示例 |
|------|------|------|
| `list` | 列出所有前端项目 | `./scripts/frontend-manager.sh list` |
| `select` | 交互式选择前端项目 | `./scripts/frontend-manager.sh select` |
| `switch <name>` | 切换到指定前端项目 | `./scripts/frontend-manager.sh switch frontend1` |
| `start [name]` | 启动前端服务 | `./scripts/frontend-manager.sh start` |
| `stop` | 停止前端服务 | `./scripts/frontend-manager.sh stop` |
| `restart` | 重启前端服务 | `./scripts/frontend-manager.sh restart` |
| `status` | 检查前端状态 | `./scripts/frontend-manager.sh status` |
| `logs` | 显示前端日志 | `./scripts/frontend-manager.sh logs` |
| `create [name]` | 创建新的前端项目 | `./scripts/frontend-manager.sh create my-app` |
| `delete <name>` | 删除前端项目 | `./scripts/frontend-manager.sh delete old-app` |
| `install <name>` | 安装前端依赖 | `./scripts/frontend-manager.sh install frontend1` |

## 通过服务管理器使用

你也可以通过主服务管理器来使用前端管理功能：

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

## 项目结构

```
frontends/
├── frontend1/          # 第一个前端项目
│   ├── package.json
│   ├── src/
│   └── ...
├── frontend2/          # 第二个前端项目
│   ├── package.json
│   ├── src/
│   └── ...
└── ...
```

## 支持的项目模板

创建新项目时，你可以选择以下模板：

1. **Next.js** (推荐) - 全栈 React 框架
2. **React + Vite** - 快速 React 开发
3. **Vue + Vite** - Vue.js 开发
4. **空白项目** - 自定义配置

## 包管理器支持

脚本会自动检测项目使用的包管理器：

- **npm** - 默认包管理器
- **yarn** - 检测 `yarn.lock` 文件
- **pnpm** - 检测 `pnpm-lock.yaml` 文件

## 端口配置

默认前端端口：`3000`

如果端口被占用，脚本会提示你停止现有进程或选择其他操作。

## 日志文件

前端日志保存在：`logs/frontend.log`

## 激活前端

当前激活的前端信息保存在：`.active-frontend`

## 故障排除

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
   - 确保项目目录包含 `package.json`
   - 检查项目目录权限

4. **包管理器未安装**
   - npm: 通常随 Node.js 安装
   - yarn: `npm install -g yarn`
   - pnpm: `npm install -g pnpm`

### 调试命令

```bash
# 检查前端状态
./scripts/frontend-manager.sh status

# 查看日志
./scripts/frontend-manager.sh logs

# 重启服务
./scripts/frontend-manager.sh restart
```

## 集成到开发流程

1. **开发新功能时**：创建新的前端分支项目
2. **测试不同实现**：快速切换前端项目
3. **A/B 测试**：同时运行多个前端版本
4. **团队协作**：每个开发者可以使用不同的前端项目

## 最佳实践

1. **项目命名**：使用描述性的项目名称
2. **版本控制**：将 `frontends/` 目录加入版本控制
3. **依赖管理**：定期更新依赖
4. **日志监控**：定期检查前端日志
5. **备份**：重要项目定期备份

## 扩展功能

脚本设计为可扩展的，你可以：

- 添加新的项目模板
- 自定义端口配置
- 集成 CI/CD 流程
- 添加自动化测试
- 配置环境变量

---

更多帮助信息：`./scripts/frontend-manager.sh help` 