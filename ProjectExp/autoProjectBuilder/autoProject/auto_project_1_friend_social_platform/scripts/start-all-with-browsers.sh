#!/bin/bash

# 全服务启动脚本 - 启动所有服务并在浏览器中打开
# 功能：启动所有服务、端口映射、自动打开浏览器

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

# 服务端口配置
declare -A SERVICE_PORTS=(
    ["backend"]="8000"
    ["ai-service"]="8001"
    ["frontend1"]="3000"
    ["frontend2"]="3001"
    ["frontend3"]="3002"
    ["frontend4"]="3003"
    ["redis"]="6379"
    ["postgresql"]="5432"
    ["elasticsearch"]="9200"
    ["kibana"]="5601"
    ["nginx"]="80"
    ["prometheus"]="9090"
    ["grafana"]="3004"
)

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

# 启动Redis
start_redis() {
    local port=${SERVICE_PORTS["redis"]}
    local service_name="Redis"
    
    if check_port $port; then
        success "$service_name 已在运行 (端口: $port)"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    
    if command -v redis-server >/dev/null 2>&1; then
        nohup redis-server --daemonize yes --logfile "$LOG_DIR/redis.log" >/dev/null 2>&1
        wait_for_port $port "$service_name"
    else
        warning "$service_name 未安装，跳过"
        return 1
    fi
}

# 启动PostgreSQL
start_postgresql() {
    local port=${SERVICE_PORTS["postgresql"]}
    local service_name="PostgreSQL"
    
    if check_port $port; then
        success "$service_name 已在运行 (端口: $port)"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    
    if command -v brew >/dev/null 2>&1; then
        brew services start postgresql@14 >/dev/null 2>&1 || {
            warning "$service_name 启动失败，跳过"
            return 1
        }
        wait_for_port $port "$service_name"
    else
        warning "$service_name 不支持当前系统，跳过"
        return 1
    fi
}

# 启动后端服务
start_backend() {
    local port=${SERVICE_PORTS["backend"]}
    local service_name="Backend"
    
    if check_port $port; then
        success "$service_name 已在运行 (端口: $port)"
        return 0
    fi
    
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
    
    # 启动服务
    nohup npm run dev > "$LOG_DIR/backend.log" 2>&1 &
    wait_for_port $port "$service_name"
}

# 启动AI服务
start_ai_service() {
    local port=${SERVICE_PORTS["ai-service"]}
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
    local port_key="frontend$2"
    local port=${SERVICE_PORTS[$port_key]}
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

# 启动Elasticsearch
start_elasticsearch() {
    local port=${SERVICE_PORTS["elasticsearch"]}
    local service_name="Elasticsearch"
    
    if check_port $port; then
        success "$service_name 已在运行 (端口: $port)"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    
    if command -v elasticsearch >/dev/null 2>&1; then
        nohup elasticsearch > "$LOG_DIR/elasticsearch.log" 2>&1 &
        wait_for_port $port "$service_name"
    else
        warning "$service_name 未安装，跳过"
        return 1
    fi
}

# 启动Kibana
start_kibana() {
    local port=${SERVICE_PORTS["kibana"]}
    local service_name="Kibana"
    
    if check_port $port; then
        success "$service_name 已在运行 (端口: $port)"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    
    if command -v kibana >/dev/null 2>&1; then
        nohup kibana > "$LOG_DIR/kibana.log" 2>&1 &
        wait_for_port $port "$service_name"
    else
        warning "$service_name 未安装，跳过"
        return 1
    fi
}

# 启动Prometheus
start_prometheus() {
    local port=${SERVICE_PORTS["prometheus"]}
    local service_name="Prometheus"
    
    if check_port $port; then
        success "$service_name 已在运行 (端口: $port)"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    
    if [ -f "$PROJECT_ROOT/infrastructure/monitoring/prometheus.yml" ]; then
        cd "$PROJECT_ROOT/infrastructure/monitoring"
        nohup prometheus --config.file=prometheus.yml > "$LOG_DIR/prometheus.log" 2>&1 &
        wait_for_port $port "$service_name"
    else
        warning "$service_name 配置不存在，跳过"
        return 1
    fi
}

# 启动Grafana
start_grafana() {
    local port=${SERVICE_PORTS["grafana"]}
    local service_name="Grafana"
    
    if check_port $port; then
        success "$service_name 已在运行 (端口: $port)"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    
    if command -v grafana-server >/dev/null 2>&1; then
        nohup grafana-server > "$LOG_DIR/grafana.log" 2>&1 &
        wait_for_port $port "$service_name"
    else
        warning "$service_name 未安装，跳过"
        return 1
    fi
}

# 显示服务状态
show_status() {
    log "📊 服务状态概览:"
    echo "=================================="
    
    for service in "${!SERVICE_PORTS[@]}"; do
        local port=${SERVICE_PORTS[$service]}
        if check_port $port; then
            local pid=$(lsof -ti :$port 2>/dev/null || echo "N/A")
            success "$service 正在运行 (PID: $pid, 端口: $port)"
        else
            warning "$service 未运行 (端口: $port)"
        fi
    done
    
    echo "=================================="
}

# 显示访问地址
show_urls() {
    log "🌐 服务访问地址:"
    echo "=================================="
    echo "后端API:     http://localhost:8000"
    echo "AI服务:      http://localhost:8001"
    echo "前端1:       http://localhost:3000"
    echo "前端2:       http://localhost:3001"
    echo "前端3:       http://localhost:3002"
    echo "前端4:       http://localhost:3003"
    echo "Elasticsearch: http://localhost:9200"
    echo "Kibana:      http://localhost:5601"
    echo "Prometheus:  http://localhost:9090"
    echo "Grafana:     http://localhost:3004"
    echo "健康检查:    http://localhost:8000/health"
    echo "=================================="
}

# 打开所有服务的浏览器
open_all_browsers() {
    log "🌐 打开所有服务的浏览器..."
    
    # 等待一下确保所有服务都启动完成
    sleep 5
    
    # 打开核心服务
    open_browser "http://localhost:8000/health" "Backend Health"
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
    sleep 1
    
    # 打开监控服务
    open_browser "http://localhost:9200" "Elasticsearch"
    sleep 1
    open_browser "http://localhost:5601" "Kibana"
    sleep 1
    open_browser "http://localhost:9090" "Prometheus"
    sleep 1
    open_browser "http://localhost:3004" "Grafana"
    
    success "所有浏览器已打开"
}

# 启动所有服务
start_all_services() {
    log "🚀 启动所有服务..."
    echo "=================================="
    
    local started_count=0
    local total_count=0
    local skipped_count=0
    
    # 启动核心服务
    total_count=$((total_count + 1))
    if start_redis; then
        started_count=$((started_count + 1))
    else
        skipped_count=$((skipped_count + 1))
    fi
    
    total_count=$((total_count + 1))
    if start_postgresql; then
        started_count=$((started_count + 1))
    else
        skipped_count=$((skipped_count + 1))
    fi
    
    total_count=$((total_count + 1))
    if start_backend; then
        started_count=$((started_count + 1))
    else
        skipped_count=$((skipped_count + 1))
    fi
    
    total_count=$((total_count + 1))
    if start_ai_service; then
        started_count=$((started_count + 1))
    else
        skipped_count=$((skipped_count + 1))
    fi
    
    # 启动前端服务
    local frontend_names=("frondend1" "frontend1-2" "frontend2" "frontend2-2")
    for i in "${!frontend_names[@]}"; do
        total_count=$((total_count + 1))
        if start_frontend "${frontend_names[$i]}" $((i + 1)); then
            started_count=$((started_count + 1))
        else
            skipped_count=$((skipped_count + 1))
        fi
    done
    
    # 启动监控服务
    total_count=$((total_count + 1))
    if start_elasticsearch; then
        started_count=$((started_count + 1))
    else
        skipped_count=$((skipped_count + 1))
    fi
    
    total_count=$((total_count + 1))
    if start_kibana; then
        started_count=$((started_count + 1))
    else
        skipped_count=$((skipped_count + 1))
    fi
    
    total_count=$((total_count + 1))
    if start_prometheus; then
        started_count=$((started_count + 1))
    else
        skipped_count=$((skipped_count + 1))
    fi
    
    total_count=$((total_count + 1))
    if start_grafana; then
        started_count=$((started_count + 1))
    else
        skipped_count=$((skipped_count + 1))
    fi
    
    echo "=================================="
    success "启动完成: $started_count 个服务启动成功"
    if [ $skipped_count -gt 0 ]; then
        warning "跳过: $skipped_count 个服务"
    fi
    info "总计: $total_count 个服务"
}

# 主函数
main() {
    log "🎯 全服务启动器 - 自动打开浏览器"
    echo "=================================="
    echo "🟢 启动所有服务"
    echo "🟢 自动端口映射"
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