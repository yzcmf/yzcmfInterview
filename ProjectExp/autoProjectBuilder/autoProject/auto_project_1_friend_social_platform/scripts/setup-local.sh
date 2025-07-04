#!/bin/bash

# 社交平台本地开发环境设置脚本 (无Docker版本)
echo "🚀 开始设置社交平台本地开发环境..."

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
        cd ai-service && pip3 install -r requirements.txt && cd ..
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

# 创建本地数据库配置
setup_local_database() {
    echo "🗄️  配置本地数据库..."
    
    # 检查是否安装了PostgreSQL
    if command -v psql &> /dev/null; then
        echo "✅ PostgreSQL 已安装"
    else
        echo "⚠️  PostgreSQL 未安装，将使用 SQLite 作为替代"
        echo "   建议安装 PostgreSQL 以获得更好的性能"
    fi
    
    # 检查是否安装了Redis
    if command -v redis-server &> /dev/null; then
        echo "✅ Redis 已安装"
    else
        echo "⚠️  Redis 未安装，将使用内存存储作为替代"
        echo "   建议安装 Redis 以获得更好的性能"
    fi
}

# 显示使用说明
show_instructions() {
    echo ""
    echo "🎉 本地开发环境设置完成！"
    echo ""
    echo "📝 下一步："
    echo "1. 使用 v0.com 创建前端项目"
    echo "2. 参考 FRONTEND_V0_GUIDE.md 进行前端开发"
    echo "3. 启动后端服务进行测试"
    echo ""
    echo "🔗 相关文档："
    echo "  - 项目结构: project-structure.md"
    echo "  - 前端开发: FRONTEND_V0_GUIDE.md"
    echo "  - API文档: docs/api-documentation.md"
    echo ""
    echo "💡 提示："
    echo "  - 由于没有Docker，某些服务可能需要手动启动"
    echo "  - 建议安装 PostgreSQL 和 Redis 以获得更好的性能"
    echo "  - 使用 .env 文件配置环境变量"
    echo ""
    echo "🚀 启动服务命令："
    echo "  # 启动后端服务"
    echo "  cd backend && npm run dev"
    echo ""
    echo "  # 启动AI服务"
    echo "  cd ai-service && python3 -m uvicorn app:app --reload --port 8001"
    echo ""
    echo "  # 启动聊天服务 (如果有)"
    echo "  cd chat-service && npm run dev"
}

# 主函数
main() {
    echo "=================================="
    echo "  社交平台本地开发环境设置"
    echo "=================================="
    echo ""
    
    check_requirements
    install_dependencies
    setup_environment
    setup_local_database
    show_instructions
}

# 运行主函数
main "$@" 