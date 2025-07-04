#!/bin/bash

# 快速启动脚本 - 启动核心服务并在浏览器中打开
# 功能：启动核心服务、使用端口映射、自动打开浏览器

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 配置
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$PROJECT_ROOT/logs"
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

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# 检查端口是否被占用
check_port() {
    local port=$1
    if lsof -i :$port >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# 等待端口可用
wait_for_port() {
    local port=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    log "等待 $service_name 启动 (端口: $port)..."
    
    while [ $attempt -le $max_attempts ]; do
        if check_port $port; then
            success "$service_name 已就绪 (端口: $port)"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    error "$service_name 启动超时 (端口: $port)"
    return 1
}

# 打开浏览器
open_browser() {
    local url=$1
    local service_name=$2
    
    log "🌐 打开 $service_name: $url"
    
    if command -v open >/dev/null 2>&1; then
        # macOS
        open "$url" 2>/dev/null || warning "无法打开浏览器: $url"
    elif command -v xdg-open >/dev/null 2>&1; then
        # Linux
        xdg-open "$url" 2>/dev/null || warning "无法打开浏览器: $url"
    elif command -v start >/dev/null 2>&1; then
        # Windows
        start "$url" 2>/dev/null || warning "无法打开浏览器: $url"
    else
        warning "未找到可用的浏览器打开命令，请手动访问: $url"
    fi
}

# 启动后端服务（使用端口映射）
start_backend() {
    local service_name="Backend"
    
    log "🚀 启动 $service_name..."
    
    if [ ! -d "$PROJECT_ROOT/backend" ]; then
        warning "$service_name 目录不存在，跳过"
        return 1
    fi
    
    cd "$PROJECT_ROOT/backend"
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        log "安装后端依赖..."
        npm install >/dev/null 2>&1 || {
            warning "$service_name 依赖安装失败，跳过"
            return 1
        }
    fi
    
    # 启动服务（使用端口映射）
    nohup npm run dev > "$LOG_DIR/backend.log" 2>&1 &
    local backend_pid=$!
    
    # 等待服务启动
    sleep 5
    
    # 检查哪个端口被使用
    local used_port=""
    for port in 8000 8002 8003 8004 8005; do
        if check_port $port; then
            used_port=$port
            break
        fi
    done
    
    if [ -n "$used_port" ]; then
        success "$service_name 启动成功 (PID: $backend_pid, 端口: $used_port)"
        echo "$used_port" > "$LOG_DIR/backend_port.txt"
        return 0
    else
        warning "$service_name 启动失败"
        return 1
    fi
}

# 启动AI服务
start_ai_service() {
    local port=8001
    local service_name="AI Service"
    
    if check_port $port; then
        success "$service_name 已在运行 (端口: $port)"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    
    if [ ! -d "$PROJECT_ROOT/ai-service" ]; then
        warning "$service_name 目录不存在，跳过"
        return 1
    fi
    
    cd "$PROJECT_ROOT/ai-service"
    
    # 检查Python依赖
    if [ ! -f "requirements.txt" ]; then
        warning "$service_name requirements.txt 不存在，跳过"
        return 1
    fi
    
    # 检查是否安装了依赖
    if ! python3 -c "import fastapi" 2>/dev/null; then
        log "安装AI服务依赖..."
        pip3 install -r requirements.txt >/dev/null 2>&1 || {
            warning "$service_name 依赖安装失败，跳过"
            return 1
        }
    fi
    
    # 启动服务
    nohup python3 -m uvicorn app:app --reload --port $port > "$LOG_DIR/ai-service.log" 2>&1 &
    wait_for_port $port "$service_name"
}

# 启动前端服务
start_frontend() {
    local frontend_name=$1
    local port=$2
    local service_name="Frontend $frontend_name"
    
    if check_port $port; then
        success "$service_name 已在运行 (端口: $port)"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    
    local frontend_path="$PROJECT_ROOT/frontends/$frontend_name"
    
    if [ ! -d "$frontend_path" ]; then
        warning "$service_name 目录不存在，跳过"
        return 1
    fi
    
    if [ ! -f "$frontend_path/package.json" ]; then
        warning "$service_name package.json 不存在，跳过"
        return 1
    fi
    
    cd "$frontend_path"
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        log "安装 $service_name 依赖..."
        npm install >/dev/null 2>&1 || {
            warning "$service_name 依赖安装失败，跳过"
            return 1
        }
    fi
    
    # 启动服务
    nohup npm run dev > "$LOG_DIR/frontend-$frontend_name.log" 2>&1 &
    wait_for_port $port "$service_name"
}

# 显示服务状态
show_status() {
    log "📊 服务状态概览:"
    echo "=================================="
    
    # 检查后端端口
    local backend_port=""
    if [ -f "$LOG_DIR/backend_port.txt" ]; then
        backend_port=$(cat "$LOG_DIR/backend_port.txt")
    fi
    
    if [ -n "$backend_port" ] && check_port $backend_port; then
        local pid=$(lsof -ti :$backend_port 2>/dev/null || echo "N/A")
        success "Backend 正在运行 (PID: $pid, 端口: $backend_port)"
    else
        warning "Backend 未运行"
    fi
    
    # 检查其他服务
    local services=("8001:AI Service" "3000:Frontend 1" "3001:Frontend 2" "3002:Frontend 3" "3003:Frontend 4")
    for service_info in "${services[@]}"; do
        IFS=':' read -r port name <<< "$service_info"
        if check_port $port; then
            local pid=$(lsof -ti :$port 2>/dev/null || echo "N/A")
            success "$name 正在运行 (PID: $pid, 端口: $port)"
        else
            warning "$name 未运行 (端口: $port)"
        fi
    done
    
    echo "=================================="
}

# 显示访问地址
show_urls() {
    log "🌐 服务访问地址:"
    echo "=================================="
    
    # 获取后端端口
    local backend_port="8000"
    if [ -f "$LOG_DIR/backend_port.txt" ]; then
        backend_port=$(cat "$LOG_DIR/backend_port.txt")
    fi
    
    echo "后端API:     http://localhost:$backend_port"
    echo "AI服务:      http://localhost:8001"
    echo "前端1:       http://localhost:3000"
    echo "前端2:       http://localhost:3001"
    echo "前端3:       http://localhost:3002"
    echo "前端4:       http://localhost:3003"
    echo "健康检查:    http://localhost:$backend_port/health"
    echo "=================================="
}

# 打开所有服务的浏览器
open_all_browsers() {
    log "🌐 打开所有服务的浏览器..."
    
    # 等待一下确保所有服务都启动完成
    sleep 5
    
    # 获取后端端口
    local backend_port="8000"
    if [ -f "$LOG_DIR/backend_port.txt" ]; then
        backend_port=$(cat "$LOG_DIR/backend_port.txt")
    fi
    
    # 打开核心服务
    open_browser "http://localhost:$backend_port/health" "Backend Health"
    sleep 1
    open_browser "http://localhost:8001" "AI Service"
    sleep 1
    open_browser "http://localhost:3000" "Frontend 1"
    sleep 1
    open_browser "http://localhost:3001" "Frontend 2"
    sleep 1
    open_browser "http://localhost:3002" "Frontend 3"
    sleep 1
    open_browser "http://localhost:3003" "Frontend 4"
    
    success "所有浏览器已打开"
}

# 启动所有服务
start_all_services() {
    log "🚀 启动核心服务..."
    echo "=================================="
    
    local started_count=0
    local total_count=0
    local skipped_count=0
    
    # 启动后端服务
    total_count=$((total_count + 1))
    if start_backend; then
        started_count=$((started_count + 1))
    else
        skipped_count=$((skipped_count + 1))
    fi
    
    # 启动AI服务
    total_count=$((total_count + 1))
    if start_ai_service; then
        started_count=$((started_count + 1))
    else
        skipped_count=$((skipped_count + 1))
    fi
    
    # 启动前端服务
    local frontend_configs=(
        "frondend1:3000"
        "frontend1-2:3001"
        "frontend2:3002"
        "frontend2-2:3003"
    )
    
    for config in "${frontend_configs[@]}"; do
        IFS=':' read -r frontend_name port <<< "$config"
        total_count=$((total_count + 1))
        if start_frontend "$frontend_name" "$port"; then
            started_count=$((started_count + 1))
        else
            skipped_count=$((skipped_count + 1))
        fi
    done
    
    echo "=================================="
    success "启动完成: $started_count 个服务启动成功"
    if [ $skipped_count -gt 0 ]; then
        warning "跳过: $skipped_count 个服务"
    fi
    info "总计: $total_count 个服务"
}

# 主函数
main() {
    log "🎯 快速启动器 - 核心服务 + 浏览器"
    echo "=================================="
    echo "🟢 启动核心服务"
    echo "🟢 使用端口映射"
    echo "🟢 自动打开浏览器"
    echo "🟢 智能错误处理"
    echo "=================================="
    
    start_all_services
    
    # 显示最终状态
    show_status
    show_urls
    
    # 打开浏览器
    open_all_browsers
    
    log "💡 提示:"
    echo "- 使用 './scripts/service-manager.sh check' 检查服务状态"
    echo "- 使用 './scripts/service-manager.sh logs [service]' 查看服务日志"
    echo "- 使用 './scripts/service-manager.sh stop' 停止所有服务"
    echo "- 使用 '$0' 重新启动所有服务"
}

# 运行主函数
main "$@" 