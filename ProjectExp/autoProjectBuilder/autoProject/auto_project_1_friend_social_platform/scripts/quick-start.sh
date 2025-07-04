#!/bin/bash

# 快速启动脚本 - 一键启动所有服务

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 检查端口
check_port() {
    local port=$1
    lsof -i :$port >/dev/null 2>&1
}

# 等待端口可用
wait_for_port() {
    local port=$1
    local service=$2
    local max_attempts=30
    
    log "等待 $service 启动..."
    for i in $(seq 1 $max_attempts); do
        if check_port $port; then
            success "$service 启动成功"
            return 0
        fi
        sleep 1
    done
    warning "$service 启动超时"
    return 1
}

# 启动Redis
start_redis() {
    if ! check_port 6379; then
        log "启动Redis..."
        redis-server --daemonize yes
        wait_for_port 6379 "Redis"
    else
        success "Redis 已在运行"
    fi
}

# 启动后端服务
start_backend() {
    if ! check_port 8000; then
        log "启动后端服务..."
        cd "$PROJECT_ROOT/backend"
        nohup npm run dev > ../logs/backend.log 2>&1 &
        wait_for_port 8000 "后端服务"
    else
        success "后端服务 已在运行"
    fi
}

# 启动AI服务
start_ai_service() {
    if ! check_port 8001; then
        log "启动AI服务..."
        cd "$PROJECT_ROOT/ai-service"
        nohup python3 -m uvicorn app:app --reload --port 8001 > ../logs/ai-service.log 2>&1 &
        wait_for_port 8001 "AI服务"
    else
        success "AI服务 已在运行"
    fi
}

# 主函数
main() {
    echo "🚀 快速启动社交平台服务..."
    echo "=================================="
    
    # 创建日志目录
    mkdir -p "$PROJECT_ROOT/logs"
    
    # 启动服务
    start_redis
    start_backend
    start_ai_service
    
    echo "=================================="
    echo "🎉 所有服务启动完成！"
    echo ""
    echo "📱 服务访问地址："
    echo "  后端API: http://localhost:8000"
    echo "  AI服务:  http://localhost:8001"
    echo "  Redis:   localhost:6379"
    echo ""
    echo "🔧 管理命令："
    echo "  检查状态: ./scripts/service-manager.sh check"
    echo "  查看日志: ./scripts/service-manager.sh logs [service]"
    echo "  重启服务: ./scripts/service-manager.sh restart [service]"
    echo "  停止服务: ./scripts/service-manager.sh stop [service]"
    echo ""
    echo "📝 下一步："
    echo "1. 使用 v0.com 创建前端项目"
    echo "2. 前端项目运行在 http://localhost:3000"
    echo "3. 开始API集成和功能开发"
}

main "$@" 