#!/bin/bash

# 社交平台服务启动脚本
# 功能：快速启动所有核心服务

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_PORT=8000
AI_SERVICE_PORT=8001
POSTGRES_PORT=5432
REDIS_PORT=6379
FRONTEND_PORT=3000

# 日志文件
LOG_DIR="$PROJECT_ROOT/logs"
BACKEND_LOG="$LOG_DIR/backend.log"
AI_LOG="$LOG_DIR/ai-service.log"
REDIS_LOG="$LOG_DIR/redis.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"

# 创建日志目录
mkdir -p "$LOG_DIR"

# 日志函数
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查端口是否被占用
check_port() {
    local port=$1
    local service_name=$2
    
    if lsof -i :$port >/dev/null 2>&1; then
        local pid=$(lsof -ti :$port)
        success "$service_name 正在运行 (PID: $pid, 端口: $port)"
        return 0
    else
        warning "$service_name 未运行 (端口: $port)"
        return 1
    fi
}

# 启动Redis
start_redis() {
    local skip_wait=${1:-false}
    log "🚀 启动Redis..."
    
    if ! check_port $REDIS_PORT "Redis" >/dev/null 2>&1; then
        if command -v redis-server >/dev/null 2>&1; then
            redis-server --daemonize yes --logfile "$REDIS_LOG"
            
            if [ "$skip_wait" = "true" ]; then
                success "Redis 启动命令已执行"
                return 0
            else
                sleep 2
                if check_port $REDIS_PORT "Redis" >/dev/null 2>&1; then
                    success "Redis 启动成功"
                else
                    error "Redis 启动失败"
                    return 1
                fi
            fi
        else
            error "Redis 未安装，请运行: brew install redis"
            return 1
        fi
    else
        success "Redis 已在运行"
    fi
}

# 启动PostgreSQL
start_postgres() {
    local skip_wait=${1:-false}
    log "🚀 启动PostgreSQL..."
    
    if ! check_port $POSTGRES_PORT "PostgreSQL" >/dev/null 2>&1; then
        if command -v postgres >/dev/null 2>&1; then
            # 尝试启动PostgreSQL服务
            if command -v brew >/dev/null 2>&1; then
                brew services start postgresql@14 2>/dev/null || {
                    warning "PostgreSQL 启动失败，请手动启动或使用SQLite"
                    return 1
                }
                
                if [ "$skip_wait" = "true" ]; then
                    success "PostgreSQL 启动命令已执行"
                    return 0
                else
                    sleep 3
                    if check_port $POSTGRES_PORT "PostgreSQL" >/dev/null 2>&1; then
                        success "PostgreSQL 启动成功"
                    else
                        warning "PostgreSQL 启动失败，请手动启动或使用SQLite"
                        return 1
                    fi
                fi
            else
                warning "PostgreSQL 启动失败，请手动启动或使用SQLite"
                return 1
            fi
        else
            warning "PostgreSQL 未安装，建议使用SQLite进行开发"
            return 1
        fi
    else
        success "PostgreSQL 已在运行"
    fi
}

# 启动后端服务
start_backend() {
    local skip_wait=${1:-false}
    log "🚀 启动后端服务..."
    
    if ! check_port $BACKEND_PORT "后端服务" >/dev/null 2>&1; then
        cd "$PROJECT_ROOT/backend"
        
        # 检查依赖是否安装
        if [ ! -d "node_modules" ]; then
            log "安装后端依赖..."
            npm install
        fi
        
        # 启动服务
        nohup npm run dev > "$BACKEND_LOG" 2>&1 &
        local backend_pid=$!
        
        if [ "$skip_wait" = "true" ]; then
            success "后端服务启动命令已执行 (PID: $backend_pid)"
            return 0
        else
            # 等待服务启动
            log "等待后端服务启动..."
            for i in {1..30}; do
                if check_port $BACKEND_PORT "后端服务" >/dev/null 2>&1; then
                    success "后端服务启动成功 (PID: $backend_pid)"
                    return 0
                fi
                sleep 1
            done
            
            error "后端服务启动超时"
            return 1
        fi
    else
        success "后端服务已在运行"
    fi
}

# 启动AI服务
start_ai_service() {
    local skip_wait=${1:-false}
    log "🚀 启动AI服务..."
    
    if ! check_port $AI_SERVICE_PORT "AI服务" >/dev/null 2>&1; then
        cd "$PROJECT_ROOT/ai-service"
        
        # 检查Python依赖
        if [ ! -f "requirements.txt" ]; then
            error "AI服务 requirements.txt 不存在"
            return 1
        fi
        
        # 检查是否安装了依赖
        if ! python3 -c "import fastapi" 2>/dev/null; then
            log "安装AI服务依赖..."
            pip3 install -r requirements.txt
        fi
        
        # 启动服务
        nohup python3 -m uvicorn app:app --reload --port $AI_SERVICE_PORT > "$AI_LOG" 2>&1 &
        local ai_pid=$!
        
        if [ "$skip_wait" = "true" ]; then
            success "AI服务启动命令已执行 (PID: $ai_pid)"
            return 0
        else
            # 等待服务启动
            log "等待AI服务启动..."
            for i in {1..30}; do
                if check_port $AI_SERVICE_PORT "AI服务" >/dev/null 2>&1; then
                    success "AI服务启动成功 (PID: $ai_pid)"
                    return 0
                fi
                sleep 1
            done
            
            error "AI服务启动超时"
            return 1
        fi
    else
        success "AI服务已在运行"
    fi
}

# 启动前端服务
start_frontend() {
    local skip_wait=${1:-false}
    log "🚀 启动前端服务..."
    
    if ! check_port $FRONTEND_PORT "前端服务" >/dev/null 2>&1; then
        if [ -d "$PROJECT_ROOT/frontend" ]; then
            cd "$PROJECT_ROOT/frontend"
            
            # 检查依赖是否安装
            if [ ! -d "node_modules" ]; then
                log "安装前端依赖..."
                npm install
            fi
            
            # 启动服务
            nohup npm run dev > "$FRONTEND_LOG" 2>&1 &
            local frontend_pid=$!
            
            if [ "$skip_wait" = "true" ]; then
                success "前端服务启动命令已执行 (PID: $frontend_pid)"
                return 0
            else
                # 等待服务启动
                log "等待前端服务启动..."
                for i in {1..30}; do
                    if check_port $FRONTEND_PORT "前端服务" >/dev/null 2>&1; then
                        success "前端服务启动成功 (PID: $frontend_pid)"
                        return 0
                    fi
                    sleep 1
                done
                
                error "前端服务启动超时"
                return 1
            fi
        else
            warning "未检测到 frontend 目录，跳过前端服务启动"
            return 1
        fi
    else
        success "前端服务已在运行"
    fi
}

# 显示服务状态
show_status() {
    log "📊 服务状态概览:"
    echo "=================================="
    check_port $REDIS_PORT "Redis"
    check_port $POSTGRES_PORT "PostgreSQL"
    check_port $BACKEND_PORT "后端服务"
    check_port $AI_SERVICE_PORT "AI服务"
    check_port $FRONTEND_PORT "前端服务"
    echo "=================================="
}

# 显示访问地址
show_urls() {
    log "🌐 服务访问地址:"
    echo "=================================="
    echo "后端API:     http://localhost:$BACKEND_PORT"
    echo "AI服务:      http://localhost:$AI_SERVICE_PORT"
    echo "前端应用:    http://localhost:$FRONTEND_PORT"
    echo "健康检查:    http://localhost:$BACKEND_PORT/health"
    echo "=================================="
}

# 显示服务列表
show_service_list() {
    log "📋 可用服务列表:"
    echo "=================================="
    echo "1. Redis (端口: $REDIS_PORT) - 缓存服务"
    echo "2. PostgreSQL (端口: $POSTGRES_PORT) - 数据库服务"
    echo "3. Backend (端口: $BACKEND_PORT) - 后端API服务"
    echo "4. AI Service (端口: $AI_SERVICE_PORT) - AI服务"
    echo "5. Frontend (端口: $FRONTEND_PORT) - 前端应用"
    echo "6. All - 启动所有服务"
    echo "0. Exit - 退出"
    echo "=================================="
}

# 交互式选择服务
interactive_start() {
    show_service_list
    
    while true; do
        echo ""
        read -p "请选择要启动的服务 (输入数字或服务名): " choice
        
        case $choice in
            1|redis|Redis)
                start_redis
                ;;
            2|postgres|PostgreSQL)
                start_postgres
                ;;
            3|backend|Backend)
                start_backend
                ;;
            4|ai|AI|ai-service)
                start_ai_service
                ;;
            5|frontend|Frontend)
                start_frontend
                ;;
            6|all|All)
                echo ""
                read -p "是否跳过等待确认? (y/n): " skip_wait_choice
                if [[ $skip_wait_choice =~ ^[Yy]$ ]]; then
                    start_all_services "true"
                else
                    start_all_services "false"
                fi
                break
                ;;
            0|exit|Exit)
                log "退出启动脚本"
                exit 0
                ;;
            *)
                error "无效选择: $choice"
                show_service_list
                ;;
        esac
        
        echo ""
        read -p "是否继续启动其他服务? (y/n): " continue_choice
        if [[ ! $continue_choice =~ ^[Yy]$ ]]; then
            break
        fi
    done
}

# 启动所有服务
start_all_services() {
    local skip_wait=${1:-false}
    log "🚀 启动所有服务..."
    echo "=================================="
    
    local started_count=0
    local total_count=0
    
    # 启动Redis
    total_count=$((total_count + 1))
    if start_redis "$skip_wait"; then
        started_count=$((started_count + 1))
    fi
    
    # 启动PostgreSQL
    total_count=$((total_count + 1))
    if start_postgres "$skip_wait"; then
        started_count=$((started_count + 1))
    fi
    
    # 启动后端服务
    total_count=$((total_count + 1))
    if start_backend "$skip_wait"; then
        started_count=$((started_count + 1))
    fi
    
    # 启动AI服务
    total_count=$((total_count + 1))
    if start_ai_service "$skip_wait"; then
        started_count=$((started_count + 1))
    fi
    
    # 启动前端服务
    total_count=$((total_count + 1))
    if start_frontend "$skip_wait"; then
        started_count=$((started_count + 1))
    fi
    
    echo "=================================="
    
    if [ $started_count -eq $total_count ]; then
        success "所有服务启动完成 ($started_count/$total_count)"
    else
        warning "部分服务启动完成 ($started_count/$total_count)"
    fi
}

# 显示帮助信息
show_help() {
    echo "社交平台服务启动脚本"
    echo ""
    echo "用法: $0 [选项] [服务名]"
    echo ""
    echo "选项:"
    echo "  -i, --interactive    交互式选择服务启动"
    echo "  -a, --all            启动所有服务"
    echo "  -q, --quick          快速启动（跳过等待）"
    echo "  -h, --help           显示此帮助信息"
    echo ""
    echo "服务名:"
    echo "  redis                启动Redis (端口: $REDIS_PORT)"
    echo "  postgres             启动PostgreSQL (端口: $POSTGRES_PORT)"
    echo "  backend              启动后端服务 (端口: $BACKEND_PORT)"
    echo "  ai                   启动AI服务 (端口: $AI_SERVICE_PORT)"
    echo "  frontend             启动前端服务 (端口: $FRONTEND_PORT)"
    echo "  all                  启动所有服务"
    echo ""
    echo "示例:"
    echo "  $0                   交互式启动"
    echo "  $0 -a                启动所有服务"
    echo "  $0 backend           启动后端服务"
    echo "  $0 -q                快速启动所有服务"
    echo "  $0 redis postgres    启动Redis和PostgreSQL"
}

# 主函数
main() {
    local mode="interactive"
    local services=()
    
    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -i|--interactive)
                mode="interactive"
                shift
                ;;
            -a|--all)
                mode="all"
                shift
                ;;
            -q|--quick)
                mode="quick"
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            redis|postgres|backend|ai|frontend|all)
                services+=("$1")
                shift
                ;;
            *)
                error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 根据模式执行
    case $mode in
        interactive)
            if [ ${#services[@]} -eq 0 ]; then
                interactive_start
            else
                # 启动指定的服务
                for service in "${services[@]}"; do
                    case $service in
                        redis)
                            start_redis "false"
                            ;;
                        postgres)
                            start_postgres "false"
                            ;;
                        backend)
                            start_backend "false"
                            ;;
                        ai)
                            start_ai_service "false"
                            ;;
                        frontend)
                            start_frontend "false"
                            ;;
                        all)
                            start_all_services "false"
                            ;;
                    esac
                done
            fi
            ;;
        all)
            start_all_services "false"
            ;;
        quick)
            log "⏭️  快速启动模式：跳过等待确认"
            start_all_services "true"
            ;;
    esac
    
    # 显示最终状态
    show_status
    show_urls
    
    log "💡 提示:"
    echo "- 使用 './scripts/service-manager.sh check' 检查服务状态"
    echo "- 使用 './scripts/service-manager.sh logs [service]' 查看服务日志"
    echo "- 使用 './scripts/service-manager.sh stop' 停止所有服务"
    echo "- 使用 '$0 -h' 查看帮助信息"
}

# 运行主函数
main "$@" 