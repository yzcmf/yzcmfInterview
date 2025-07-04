#!/bin/bash

# 社交平台服务管理脚本
# 功能：检查、调试和重启所有服务

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

# 检查服务健康状态
check_service_health() {
    local url=$1
    local service_name=$2
    
    if command -v curl >/dev/null 2>&1; then
        if curl -s --max-time 5 "$url/health" >/dev/null 2>&1; then
            success "$service_name 健康检查通过"
            return 0
        else
            warning "$service_name 健康检查失败"
            return 1
        fi
    else
        warning "curl 未安装，跳过 $service_name 健康检查"
        return 1
    fi
}

# 检查所有服务状态
check_all_services() {
    log "🔍 检查所有服务状态..."
    echo "=================================="
    
    # 检查后端服务
    if check_port $BACKEND_PORT "后端服务"; then
        check_service_health "http://localhost:$BACKEND_PORT" "后端服务"
    fi
    
    # 检查AI服务
    if check_port $AI_SERVICE_PORT "AI服务"; then
        check_service_health "http://localhost:$AI_SERVICE_PORT" "AI服务"
    fi
    
    # 检查PostgreSQL
    if check_port $POSTGRES_PORT "PostgreSQL"; then
        success "PostgreSQL 正在运行"
    else
        warning "PostgreSQL 未运行 - 建议安装或使用SQLite"
    fi
    
    # 检查Redis
    if check_port $REDIS_PORT "Redis"; then
        success "Redis 正在运行"
    else
        warning "Redis 未运行"
    fi
    
    # 检查前端服务
    if check_port $FRONTEND_PORT "前端服务"; then
        success "前端服务 正在运行"
    else
        warning "前端服务 未运行"
    fi
    
    echo "=================================="
}

# 启动Redis
start_redis() {
    log "🚀 启动Redis..."
    
    # 自动检查和安装Redis依赖
    if ! check_and_install_dependencies "redis"; then
        error "Redis 依赖检查失败"
        return 1
    fi
    
    if ! check_port $REDIS_PORT "Redis" >/dev/null 2>&1; then
        redis-server --daemonize yes --logfile "$REDIS_LOG"
        sleep 2
        if check_port $REDIS_PORT "Redis" >/dev/null 2>&1; then
            success "Redis 启动成功"
        else
            error "Redis 启动失败"
            return 1
        fi
    else
        success "Redis 已在运行"
    fi
}

# 启动后端服务
start_backend() {
    log "🚀 启动后端服务..."
    
    # 自动检查和安装后端依赖
    if ! check_and_install_dependencies "backend"; then
        error "后端依赖检查失败"
        return 1
    fi
    
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
    else
        success "后端服务已在运行"
    fi
}

# 启动AI服务
start_ai_service() {
    log "🚀 启动AI服务..."
    
    # 自动检查和安装AI服务依赖
    if ! check_and_install_dependencies "ai"; then
        error "AI服务依赖检查失败"
        return 1
    fi
    
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
    else
        success "AI服务已在运行"
    fi
}

# 启动PostgreSQL（如果可用）
start_postgres() {
    log "🚀 检查PostgreSQL..."
    
    # 自动检查和安装PostgreSQL依赖
    if ! check_and_install_dependencies "postgresql"; then
        warning "PostgreSQL 依赖检查失败，建议使用SQLite进行开发"
        return 1
    fi
    
    if ! check_port $POSTGRES_PORT "PostgreSQL" >/dev/null 2>&1; then
        log "启动PostgreSQL..."
        # 这里可以添加PostgreSQL启动命令
        warning "请手动启动PostgreSQL或使用SQLite"
    else
        success "PostgreSQL 已在运行"
    fi
}

# 重启服务
restart_service() {
    local service_name=$1
    local port=$2
    
    log "🔄 重启 $service_name..."
    
    # 停止服务
    local pids=$(lsof -ti :$port 2>/dev/null || true)
    if [ -n "$pids" ]; then
        log "停止 $service_name (PID: $pids)..."
        kill $pids
        sleep 2
    fi
    
    # 启动服务
    case $service_name in
        "backend")
            start_backend
            ;;
        "ai-service")
            start_ai_service
            ;;
        "redis")
            start_redis
            ;;
        "postgres")
            start_postgres
            ;;
        *)
            error "未知服务: $service_name"
            return 1
            ;;
    esac
}

# 停止服务
stop_service() {
    local service_name=$1
    local port=$2
    
    log "🛑 停止 $service_name..."
    
    local pids=$(lsof -ti :$port 2>/dev/null || true)
    if [ -n "$pids" ]; then
        log "停止 $service_name (PID: $pids)..."
        kill $pids
        success "$service_name 已停止"
    else
        warning "$service_name 未运行"
    fi
}

# 显示日志
show_logs() {
    local service=$1
    
    case $service in
        "backend")
            if [ -f "$BACKEND_LOG" ]; then
                echo "=== 后端服务日志 ==="
                tail -f "$BACKEND_LOG"
            else
                error "后端日志文件不存在"
            fi
            ;;
        "ai")
            if [ -f "$AI_LOG" ]; then
                echo "=== AI服务日志 ==="
                tail -f "$AI_LOG"
            else
                error "AI服务日志文件不存在"
            fi
            ;;
        "redis")
            if [ -f "$REDIS_LOG" ]; then
                echo "=== Redis日志 ==="
                tail -f "$REDIS_LOG"
            else
                error "Redis日志文件不存在"
            fi
            ;;
        *)
            error "未知服务: $service"
            ;;
    esac
}

# 检测包管理器
detect_package_manager() {
    if command -v brew >/dev/null 2>&1; then
        echo "brew"
    elif command -v apt-get >/dev/null 2>&1; then
        echo "apt"
    elif command -v yum >/dev/null 2>&1; then
        echo "yum"
    else
        echo "unknown"
    fi
}

# 自动安装依赖
auto_install_dependency() {
    local dependency=$1
    local package_manager=$(detect_package_manager)
    
    log "🔧 自动安装 $dependency..."
    
    case $package_manager in
        "brew")
            case $dependency in
                "node")
                    brew install node
                    ;;
                "python3")
                    brew install python
                    ;;
                "redis")
                    brew install redis
                    ;;
                "postgresql")
                    brew install postgresql@14
                    ;;
                *)
                    error "未知依赖: $dependency"
                    return 1
                    ;;
            esac
            ;;
        "apt")
            case $dependency in
                "node")
                    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
                    sudo apt-get install -y nodejs
                    ;;
                "python3")
                    sudo apt-get update && sudo apt-get install -y python3 python3-pip
                    ;;
                "redis")
                    sudo apt-get update && sudo apt-get install -y redis-server
                    ;;
                "postgresql")
                    sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib
                    ;;
                *)
                    error "未知依赖: $dependency"
                    return 1
                    ;;
            esac
            ;;
        "yum")
            case $dependency in
                "node")
                    curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
                    sudo yum install -y nodejs
                    ;;
                "python3")
                    sudo yum install -y python3 python3-pip
                    ;;
                "redis")
                    sudo yum install -y redis
                    ;;
                "postgresql")
                    sudo yum install -y postgresql postgresql-server
                    ;;
                *)
                    error "未知依赖: $dependency"
                    return 1
                    ;;
            esac
            ;;
        *)
            error "未检测到支持的包管理器 (brew/apt/yum)"
            return 1
            ;;
    esac
    
    if [ $? -eq 0 ]; then
        success "$dependency 安装成功"
        return 0
    else
        error "$dependency 安装失败"
        return 1
    fi
}

# 检查并自动安装依赖
check_and_install_dependencies() {
    local service=$1
    
    case $service in
        "backend")
            # 检查 Node.js
            if ! command -v node >/dev/null 2>&1; then
                warning "Node.js 未安装，正在自动安装..."
                if auto_install_dependency "node"; then
                    # 重新加载环境变量
                    export PATH="/usr/local/bin:$PATH"
                else
                    error "Node.js 安装失败"
                    return 1
                fi
            fi
            
            # 检查 npm
            if ! command -v npm >/dev/null 2>&1; then
                warning "npm 未安装，正在自动安装..."
                if auto_install_dependency "node"; then
                    export PATH="/usr/local/bin:$PATH"
                else
                    error "npm 安装失败"
                    return 1
                fi
            fi
            
            # 检查 package.json
            if [ ! -f "$PROJECT_ROOT/backend/package.json" ]; then
                error "后端 package.json 不存在"
                return 1
            fi
            
            success "后端依赖检查通过"
            ;;
        "ai")
            # 检查 Python3
            if ! command -v python3 >/dev/null 2>&1; then
                warning "Python3 未安装，正在自动安装..."
                if auto_install_dependency "python3"; then
                    export PATH="/usr/local/bin:$PATH"
                else
                    error "Python3 安装失败"
                    return 1
                fi
            fi
            
            # 检查 requirements.txt
            if [ ! -f "$PROJECT_ROOT/ai-service/requirements.txt" ]; then
                error "AI服务 requirements.txt 不存在"
                return 1
            fi
            
            success "AI服务依赖检查通过"
            ;;
        "redis")
            if ! command -v redis-server >/dev/null 2>&1; then
                warning "Redis 未安装，正在自动安装..."
                if auto_install_dependency "redis"; then
                    success "Redis 安装成功"
                else
                    error "Redis 安装失败"
                    return 1
                fi
            fi
            success "Redis依赖检查通过"
            ;;
        "postgresql")
            if ! command -v postgres >/dev/null 2>&1; then
                warning "PostgreSQL 未安装，正在自动安装..."
                if auto_install_dependency "postgresql"; then
                    success "PostgreSQL 安装成功"
                else
                    error "PostgreSQL 安装失败"
                    return 1
                fi
            fi
            success "PostgreSQL依赖检查通过"
            ;;
    esac
}

# 检查依赖是否安装（保持向后兼容）
check_dependencies() {
    check_and_install_dependencies "$1"
}

# 诊断服务问题
diagnose_service() {
    local service=$1
    
    log "🔍 诊断 $service 问题..."
    
    case $service in
        "backend")
            echo "=== 后端服务诊断 ==="
            echo "1. 检查依赖:"
            check_dependencies "backend"
            echo ""
            echo "2. 检查端口占用:"
            lsof -i :$BACKEND_PORT || echo "端口未被占用"
            echo ""
            echo "3. 检查进程:"
            ps aux | grep -E "(node|nodemon|ts-node)" | grep -v grep || echo "无相关进程"
            echo ""
            echo "4. 检查日志文件:"
            if [ -f "$BACKEND_LOG" ]; then
                echo "最近日志:"
                tail -n 10 "$BACKEND_LOG"
            else
                echo "日志文件不存在"
            fi
            echo ""
            echo "5. 检查目录结构:"
            ls -la "$PROJECT_ROOT/backend/" 2>/dev/null || echo "后端目录不存在"
            ;;
        "ai")
            echo "=== AI服务诊断 ==="
            echo "1. 检查依赖:"
            check_dependencies "ai"
            echo ""
            echo "2. 检查端口占用:"
            lsof -i :$AI_SERVICE_PORT || echo "端口未被占用"
            echo ""
            echo "3. 检查进程:"
            ps aux | grep -E "(python|uvicorn)" | grep -v grep || echo "无相关进程"
            echo ""
            echo "4. 检查日志文件:"
            if [ -f "$AI_LOG" ]; then
                echo "最近日志:"
                tail -n 10 "$AI_LOG"
            else
                echo "日志文件不存在"
            fi
            echo ""
            echo "5. 检查目录结构:"
            ls -la "$PROJECT_ROOT/ai-service/" 2>/dev/null || echo "AI服务目录不存在"
            ;;
        "redis")
            echo "=== Redis诊断 ==="
            echo "1. 检查依赖:"
            check_dependencies "redis"
            echo ""
            echo "2. 检查端口占用:"
            lsof -i :$REDIS_PORT || echo "端口未被占用"
            echo ""
            echo "3. 检查进程:"
            ps aux | grep redis | grep -v grep || echo "无相关进程"
            echo ""
            echo "4. 测试连接:"
            if redis-cli ping >/dev/null 2>&1; then
                success "Redis连接正常"
            else
                error "Redis连接失败"
            fi
            ;;
        *)
            error "未知服务: $service"
            ;;
    esac
}

# 调试服务
debug_service() {
    local service=$1
    
    log "🐛 调试 $service..."
    
    case $service in
        "backend")
            echo "=== 后端服务调试信息 ==="
            echo "端口: $BACKEND_PORT"
            echo "日志文件: $BACKEND_LOG"
            echo "进程:"
            ps aux | grep "nodemon\|ts-node" | grep -v grep || echo "无相关进程"
            echo "端口占用:"
            lsof -i :$BACKEND_PORT || echo "端口未被占用"
            ;;
        "ai")
            echo "=== AI服务调试信息 ==="
            echo "端口: $AI_SERVICE_PORT"
            echo "日志文件: $AI_LOG"
            echo "进程:"
            ps aux | grep "uvicorn\|python" | grep -v grep || echo "无相关进程"
            echo "端口占用:"
            lsof -i :$AI_SERVICE_PORT || echo "端口未被占用"
            ;;
        "redis")
            echo "=== Redis调试信息 ==="
            echo "端口: $REDIS_PORT"
            echo "日志文件: $REDIS_LOG"
            echo "进程:"
            ps aux | grep redis | grep -v grep || echo "无相关进程"
            echo "端口占用:"
            lsof -i :$REDIS_PORT || echo "端口未被占用"
            ;;
        *)
            error "未知服务: $service"
            ;;
    esac
}

# 自动修复服务
auto_fix_service() {
    local service=$1
    
    log "🔧 自动修复 $service..."
    
    case $service in
        "backend")
            # 检查依赖
            if ! check_dependencies "backend"; then
                error "后端依赖检查失败，无法自动修复"
                return 1
            fi
            
            # 停止可能冲突的进程
            local conflicting_pids=$(lsof -ti :$BACKEND_PORT 2>/dev/null || true)
            if [ -n "$conflicting_pids" ]; then
                warning "停止占用端口 $BACKEND_PORT 的进程: $conflicting_pids"
                kill $conflicting_pids 2>/dev/null || true
                sleep 2
            fi
            
            # 重新安装依赖
            cd "$PROJECT_ROOT/backend"
            log "重新安装后端依赖..."
            rm -rf node_modules package-lock.json
            npm install
            
            # 启动服务
            start_backend
            ;;
        "ai")
            # 检查依赖
            if ! check_dependencies "ai"; then
                error "AI服务依赖检查失败，无法自动修复"
                return 1
            fi
            
            # 停止可能冲突的进程
            local conflicting_pids=$(lsof -ti :$AI_SERVICE_PORT 2>/dev/null || true)
            if [ -n "$conflicting_pids" ]; then
                warning "停止占用端口 $AI_SERVICE_PORT 的进程: $conflicting_pids"
                kill $conflicting_pids 2>/dev/null || true
                sleep 2
            fi
            
            # 重新安装依赖
            cd "$PROJECT_ROOT/ai-service"
            log "重新安装AI服务依赖..."
            pip3 install -r requirements.txt --force-reinstall
            
            # 启动服务
            start_ai_service
            ;;
        "redis")
            # 停止可能冲突的进程
            local conflicting_pids=$(lsof -ti :$REDIS_PORT 2>/dev/null || true)
            if [ -n "$conflicting_pids" ]; then
                warning "停止占用端口 $REDIS_PORT 的进程: $conflicting_pids"
                kill $conflicting_pids 2>/dev/null || true
                sleep 2
            fi
            
            # 启动Redis
            start_redis
            ;;
        *)
            error "未知服务: $service"
            return 1
            ;;
    esac
}

# 自动修复所有服务
auto_fix_all() {
    log "🔧 自动修复所有服务..."
    echo "=================================="
    
    local fixed_count=0
    local total_count=0
    
    # 修复Redis
    total_count=$((total_count + 1))
    if ! check_port $REDIS_PORT "Redis" >/dev/null 2>&1; then
        if wrap_with_analyze redis start_redis; then
            fixed_count=$((fixed_count + 1))
        fi
    else
        fixed_count=$((fixed_count + 1))
    fi
    
    # 修复后端服务
    total_count=$((total_count + 1))
    if ! check_port $BACKEND_PORT "后端服务" >/dev/null 2>&1; then
        if wrap_with_analyze backend start_backend; then
            fixed_count=$((fixed_count + 1))
        fi
    else
        fixed_count=$((fixed_count + 1))
    fi
    
    # 修复AI服务
    total_count=$((total_count + 1))
    if ! check_port $AI_SERVICE_PORT "AI服务" >/dev/null 2>&1; then
        if wrap_with_analyze ai start_ai_service; then
            fixed_count=$((fixed_count + 1))
        fi
    else
        fixed_count=$((fixed_count + 1))
    fi
    
    echo "=================================="
    if [ $fixed_count -eq $total_count ]; then
        success "所有服务修复完成 ($fixed_count/$total_count)"
    else
        warning "部分服务修复完成 ($fixed_count/$total_count)"
        info "请检查失败的服务的日志文件"
    fi
    
    # 显示最终状态
    log "最终服务状态:"
    check_all_services
}

# 启动所有服务
start_all_services() {
    log "🚀 启动所有服务..."
    
    # 启动Redis
    start_redis
    
    # 启动PostgreSQL
    start_postgres
    
    # 启动后端服务
    start_backend
    
    # 启动AI服务
    start_ai_service
    
    log "✅ 所有服务启动完成"
    check_all_services
}

# 停止所有服务
stop_all_services() {
    log "🛑 停止所有服务..."
    
    stop_service "backend" $BACKEND_PORT
    stop_service "ai-service" $AI_SERVICE_PORT
    stop_service "redis" $REDIS_PORT
    
    log "✅ 所有服务已停止"
}

# 自动启动所有未运行的服务
auto_start_all() {
    log "🚦 自动启动所有未运行的服务..."
    local started_count=0
    local total_count=0
    echo "=================================="

    # Redis
    total_count=$((total_count + 1))
    if ! check_port $REDIS_PORT "Redis" >/dev/null 2>&1; then
        if wrap_with_analyze redis start_redis; then
            started_count=$((started_count + 1))
        fi
    else
        warning "Redis 已在运行"
        started_count=$((started_count + 1))
    fi

    # PostgreSQL
    total_count=$((total_count + 1))
    if ! check_port $POSTGRES_PORT "PostgreSQL" >/dev/null 2>&1; then
        start_postgres && started_count=$((started_count + 1))
    else
        warning "PostgreSQL 已在运行"
        started_count=$((started_count + 1))
    fi

    # 后端服务
    total_count=$((total_count + 1))
    if ! check_port $BACKEND_PORT "后端服务" >/dev/null 2>&1; then
        if wrap_with_analyze backend start_backend; then
            started_count=$((started_count + 1))
        fi
    else
        warning "后端服务已在运行"
        started_count=$((started_count + 1))
    fi

    # AI服务
    total_count=$((total_count + 1))
    if ! check_port $AI_SERVICE_PORT "AI服务" >/dev/null 2>&1; then
        if wrap_with_analyze ai start_ai_service; then
            started_count=$((started_count + 1))
        fi
    else
        warning "AI服务已在运行"
        started_count=$((started_count + 1))
    fi

    # 前端服务
    total_count=$((total_count + 1))
    if ! check_port $FRONTEND_PORT "前端服务" >/dev/null 2>&1; then
        # 检查是否有前端管理器
        if [ -f "$PROJECT_ROOT/scripts/frontend-manager.sh" ]; then
            log "🚀 使用前端管理器启动前端服务..."
            if "$PROJECT_ROOT/scripts/frontend-manager.sh" start; then
                success "前端服务启动成功"
                started_count=$((started_count + 1))
            else
                error "前端服务启动失败"
            fi
        elif [ -d "$PROJECT_ROOT/frontend" ]; then
            log "🚀 启动前端服务..."
            cd "$PROJECT_ROOT/frontend"
            if [ ! -d "node_modules" ]; then
                log "安装前端依赖..."
                npm install
            fi
            nohup npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
            sleep 2
            if check_port $FRONTEND_PORT "前端服务" >/dev/null 2>&1; then
                success "前端服务启动成功"
                started_count=$((started_count + 1))
            else
                error "前端服务启动失败"
            fi
            cd "$PROJECT_ROOT"
        else
            warning "未检测到前端项目，跳过前端服务启动"
            info "使用 './scripts/frontend-manager.sh create' 创建新的前端项目"
        fi
    else
        warning "前端服务已在运行"
        started_count=$((started_count + 1))
    fi

    echo "=================================="
    if [ $started_count -eq $total_count ]; then
        success "所有服务已启动 ($started_count/$total_count)"
    else
        warning "部分服务已启动 ($started_count/$total_count)"
    fi
    log "最终服务状态:"
    check_all_services
}

# 显示帮助信息
show_help() {
    echo "社交平台服务管理脚本"
    echo ""
    echo "用法: $0 [命令] [服务名]"
    echo ""
    echo "命令:"
    echo "  check                   检查所有服务状态"
    echo "  start [service]         启动指定服务或所有服务"
    echo "  stop [service]          停止指定服务或所有服务"
    echo "  restart [service]       重启指定服务"
    echo "  logs [service]          显示服务日志"
    echo "  debug [service]         调试服务"
    echo "  diagnose [service]      诊断服务问题"
    echo "  fix [service]           自动修复指定服务"
    echo "  auto-fix                自动修复所有未运行的服务"
    echo "  auto-start              自动检测并启动所有未运行的服务"
    echo "  analyze [service]       分析服务日志和健康状态"
    echo "  frontend [command]      前端管理 (使用前端管理器)"
    echo "  help                    显示此帮助信息"
    echo ""
    echo "服务名:"
    echo "  backend                 后端服务 (端口: $BACKEND_PORT)"
    echo "  ai                      AI服务 (端口: $AI_SERVICE_PORT)"
    echo "  redis                   Redis缓存 (端口: $REDIS_PORT)"
    echo "  postgres                PostgreSQL数据库 (端口: $POSTGRES_PORT)"
    echo ""
    echo "自动安装功能:"
    echo "  ✨ 脚本会自动检测并安装缺失的依赖:"
    echo "     - Node.js 和 npm (后端服务)"
    echo "     - Python3 (AI服务)"
    echo "     - Redis (缓存服务)"
    echo "     - PostgreSQL (数据库)"
    echo "     - 支持 macOS (brew)、Ubuntu (apt)、CentOS (yum)"
    echo ""
    echo "示例:"
    echo "  $0 check                检查所有服务"
    echo "  $0 start                启动所有服务（自动安装依赖）"
    echo "  $0 start backend        启动后端服务（自动安装Node.js）"
    echo "  $0 restart ai           重启AI服务（自动安装Python3）"
    echo "  $0 logs backend         查看后端日志"
    echo "  $0 debug redis          调试Redis"
    echo "  $0 diagnose backend     诊断后端服务问题"
    echo "  $0 fix backend          自动修复后端服务"
    echo "  $0 auto-fix             自动修复所有服务"
    echo "  $0 auto-start           自动启动所有未运行的服务"
    echo "  $0 analyze backend      分析后端服务状态"
    echo "  $0 frontend list        列出所有前端项目"
    echo "  $0 frontend select      交互式选择前端"
    echo "  $0 frontend create      创建新的前端项目"
}

# 日志分析和健康检查排查
auto_analyze_service() {
    local service=$1
    local log_file=""
    local health_url=""
    local port=""
    case $service in
        "backend")
            log_file="$BACKEND_LOG"
            health_url="http://localhost:$BACKEND_PORT/health"
            port=$BACKEND_PORT
            ;;
        "ai")
            log_file="$AI_LOG"
            health_url="http://localhost:$AI_SERVICE_PORT/health"
            port=$AI_SERVICE_PORT
            ;;
        "redis")
            log_file="$REDIS_LOG"
            health_url=""
            port=$REDIS_PORT
            ;;
        *)
            error "未知服务: $service"
            return 1
            ;;
    esac
    echo "--- 日志分析 ($service) ---"
    if [ -f "$log_file" ]; then
        tail -n 20 "$log_file" | grep -iE 'error|fail|exception|crash|not found|denied|refused|unhandled|unavailable|timeout' --color=always || tail -n 20 "$log_file"
    else
        warning "日志文件不存在: $log_file"
    fi
    if [ -n "$health_url" ]; then
        echo "--- 健康检查 ($service) ---"
        if command -v curl >/dev/null 2>&1; then
            local resp=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$health_url" || echo "curl error")
            echo "$resp"
            local status=$(echo "$resp" | grep HTTP_STATUS | awk -F: '{print $2}')
            if [ "$status" != "200" ]; then
                error "$service 健康检查失败 (HTTP $status)"
            else
                success "$service 健康检查通过"
            fi
        else
            warning "curl 未安装，无法检测健康接口"
        fi
    fi
    echo "--------------------------"
}

# 增强auto-fix/auto-start失败时自动分析
wrap_with_analyze() {
    local service=$1
    local action=$2
    $action $service
    local result=$?
    if [ $result -ne 0 ]; then
        auto_analyze_service $service
    fi
    return $result
}

# 添加analyze命令
analyze_service() {
    local service=$1
    auto_analyze_service $service
}

# 在主函数case中添加analyze命令

# 主函数
main() {
    local command=$1
    local service=$2
    
    case $command in
        "check")
            check_all_services
            ;;
        "start")
            if [ -z "$service" ]; then
                start_all_services
            else
                case $service in
                    "backend")
                        start_backend
                        ;;
                    "ai")
                        start_ai_service
                        ;;
                    "redis")
                        start_redis
                        ;;
                    "postgres")
                        start_postgres
                        ;;
                    *)
                        error "未知服务: $service"
                        show_help
                        exit 1
                        ;;
                esac
            fi
            ;;
        "stop")
            if [ -z "$service" ]; then
                stop_all_services
            else
                case $service in
                    "backend")
                        stop_service "backend" $BACKEND_PORT
                        ;;
                    "ai")
                        stop_service "ai-service" $AI_SERVICE_PORT
                        ;;
                    "redis")
                        stop_service "redis" $REDIS_PORT
                        ;;
                    "postgres")
                        stop_service "postgres" $POSTGRES_PORT
                        ;;
                    *)
                        error "未知服务: $service"
                        show_help
                        exit 1
                        ;;
                esac
            fi
            ;;
        "restart")
            if [ -z "$service" ]; then
                error "请指定要重启的服务"
                show_help
                exit 1
            else
                case $service in
                    "backend")
                        restart_service "backend" $BACKEND_PORT
                        ;;
                    "ai")
                        restart_service "ai-service" $AI_SERVICE_PORT
                        ;;
                    "redis")
                        restart_service "redis" $REDIS_PORT
                        ;;
                    "postgres")
                        restart_service "postgres" $POSTGRES_PORT
                        ;;
                    *)
                        error "未知服务: $service"
                        show_help
                        exit 1
                        ;;
                esac
            fi
            ;;
        "logs")
            if [ -z "$service" ]; then
                error "请指定要查看日志的服务"
                show_help
                exit 1
            else
                show_logs $service
            fi
            ;;
        "debug")
            if [ -z "$service" ]; then
                error "请指定要调试的服务"
                show_help
                exit 1
            else
                debug_service $service
            fi
            ;;
        "diagnose")
            if [ -z "$service" ]; then
                error "请指定要诊断的服务"
                show_help
                exit 1
            else
                diagnose_service $service
            fi
            ;;
        "fix")
            if [ -z "$service" ]; then
                error "请指定要修复的服务"
                show_help
                exit 1
            else
                auto_fix_service $service
            fi
            ;;
        "auto-fix")
            auto_fix_all
            ;;
        "auto-start")
            auto_start_all
            ;;
        "analyze")
            if [ -z "$service" ]; then
                error "请指定要分析的服务"
                show_help
                exit 1
            else
                analyze_service $service
            fi
            ;;
        "frontend")
            if [ -f "$PROJECT_ROOT/scripts/frontend-manager.sh" ]; then
                shift
                "$PROJECT_ROOT/scripts/frontend-manager.sh" "$@"
            else
                error "前端管理器未找到"
                exit 1
            fi
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        "")
            show_help
            ;;
        *)
            error "未知命令: $command"
            show_help
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@" 