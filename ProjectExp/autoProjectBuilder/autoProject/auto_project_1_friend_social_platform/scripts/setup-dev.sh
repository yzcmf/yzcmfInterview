#!/bin/bash

# 社交平台开发环境设置脚本
echo "🚀 开始设置社交平台开发环境..."

# 检查必要的工具
check_requirements() {
    echo "📋 检查系统要求..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js 未安装，请先安装 Node.js 18+"
        exit 1
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        echo "❌ npm 未安装"
        exit 1
    fi
    
    # 检查 Python
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 未安装，请先安装 Python 3.11+"
        exit 1
    fi
    
    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    # 检查 Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose 未安装"
        exit 1
    fi
    
    echo "✅ 系统要求检查通过"
}

# 安装依赖
install_dependencies() {
    echo "📦 安装项目依赖..."
    
    # 安装根项目依赖
    echo "安装根项目依赖..."
    npm install
    
    # 安装后端依赖
    if [ -d "backend" ]; then
        echo "安装后端依赖..."
        cd backend && npm install && cd ..
    fi
    
    # 安装聊天服务依赖
    if [ -d "chat-service" ]; then
        echo "安装聊天服务依赖..."
        cd chat-service && npm install && cd ..
    fi
    
    # 安装AI服务依赖
    if [ -d "ai-service" ]; then
        echo "安装AI服务依赖..."
        cd ai-service && pip install -r requirements.txt && cd ..
    fi
    
    echo "✅ 依赖安装完成"
}

# 设置环境变量
setup_environment() {
    echo "🔧 设置环境变量..."
    
    # 复制环境变量示例文件
    if [ ! -f ".env" ]; then
        cp env.example .env
        echo "✅ 环境变量文件已创建 (.env)"
    else
        echo "⚠️  环境变量文件已存在 (.env)"
    fi
    
    # 创建日志目录
    mkdir -p logs
    echo "✅ 日志目录已创建"
}

# 启动数据库服务
start_database() {
    echo "🗄️  启动数据库服务..."
    
    # 启动 PostgreSQL 和 Redis
    docker-compose up -d postgres redis elasticsearch kibana
    
    echo "⏳ 等待数据库服务启动..."
    sleep 10
    
    echo "✅ 数据库服务已启动"
}

# 运行数据库迁移
run_migrations() {
    echo "🔄 运行数据库迁移..."
    
    if [ -d "backend" ]; then
        cd backend
        npm run db:migrate
        cd ..
        echo "✅ 数据库迁移完成"
    else
        echo "⚠️  后端目录不存在，跳过迁移"
    fi
}

# 启动开发服务
start_services() {
    echo "🚀 启动开发服务..."
    
    # 启动所有服务
    docker-compose up -d
    
    echo "✅ 所有服务已启动"
    echo ""
    echo "📱 服务访问地址："
    echo "  前端: http://localhost:3000"
    echo "  后端API: http://localhost:8000"
    echo "  AI服务: http://localhost:8001"
    echo "  聊天服务: http://localhost:8002"
    echo "  Grafana监控: http://localhost:3001"
    echo "  Kibana日志: http://localhost:5601"
    echo ""
    echo "🔧 管理命令："
    echo "  查看日志: docker-compose logs -f"
    echo "  停止服务: docker-compose down"
    echo "  重启服务: docker-compose restart"
}

# 显示使用说明
show_instructions() {
    echo ""
    echo "🎉 开发环境设置完成！"
    echo ""
    echo "📝 下一步："
    echo "1. 使用 v0.com 创建前端项目"
    echo "2. 参考 FRONTEND_V0_GUIDE.md 进行前端开发"
    echo "3. 后端API已准备就绪，可直接使用"
    echo ""
    echo "🔗 相关文档："
    echo "  - 项目结构: project-structure.md"
    echo "  - 前端开发: FRONTEND_V0_GUIDE.md"
    echo "  - API文档: docs/api-documentation.md"
    echo ""
    echo "💡 提示："
    echo "  - 确保所有服务正常运行后再开始前端开发"
    echo "  - 使用 .env 文件配置环境变量"
    echo "  - 查看 logs/ 目录了解服务运行状态"
}

# 主函数
main() {
    echo "=================================="
    echo "  社交平台开发环境设置"
    echo "=================================="
    echo ""
    
    check_requirements
    install_dependencies
    setup_environment
    start_database
    run_migrations
    start_services
    show_instructions
}

# 运行主函数
main "$@" 