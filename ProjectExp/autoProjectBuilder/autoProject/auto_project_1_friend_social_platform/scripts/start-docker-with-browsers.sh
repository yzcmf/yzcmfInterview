#!/bin/bash

# Docker Compose 启动脚本 - 启动所有服务并在浏览器中打开
# 功能：使用 docker-compose 启动服务、自动打开浏览器

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

# Docker Compose 端口配置
# 使用简单的数组来避免 bash 版本兼容性问题
DOCKER_PORTS_BACKEND="8002"
DOCKER_PORTS_AI_SERVICE="8001"
DOCKER_PORTS_FRONTEND="3000"
DOCKER_PORTS_POSTGRESQL="5432"
DOCKER_PORTS_REDIS="6379"
DOCKER_PORTS_ELASTICSEARCH="9200"
DOCKER_PORTS_KIBANA="5601"
DOCKER_PORTS_NGINX="80"

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
    local max_attempts=60
    local attempt=1
    
    log "等待 $service_name 启动 (端口: $port)..."
    
    while [ $attempt -le $max_attempts ]; do
        if check_port $port; then
            success "$service_name 已就绪 (端口: $port)"
            return 0
        fi
        
        echo -n "."
        sleep 3
        attempt=$((attempt + 1))
    done
    
    error "$service_name 启动超时 (端口: $port)"
    return 1
}

# 打开浏览器（Chrome 隐私模式）
open_browser() {
    local url=$1
    local service_name=$2
    
    log "🌐 打开 $service_name (Chrome 隐私模式): $url"
    
    if command -v open >/dev/null 2>&1; then
        # macOS - 优先使用 Chrome 隐私模式
        if command -v /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome >/dev/null 2>&1; then
            /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --incognito "$url" 2>/dev/null || warning "无法打开 Chrome 隐私模式: $url"
        elif command -v /Applications/Chromium.app/Contents/MacOS/Chromium >/dev/null 2>&1; then
            /Applications/Chromium.app/Contents/MacOS/Chromium --incognito "$url" 2>/dev/null || warning "无法打开 Chromium 隐私模式: $url"
        else
            # 使用 open 命令打开 Chrome
            open -a "Google Chrome" --args --incognito "$url" 2>/dev/null || warning "无法打开 Chrome 隐私模式: $url"
        fi
    elif command -v xdg-open >/dev/null 2>&1; then
        # Linux - 优先使用 Chrome 隐私模式
        if command -v google-chrome >/dev/null 2>&1; then
            google-chrome --incognito "$url" 2>/dev/null || warning "无法打开 Chrome 隐私模式: $url"
        elif command -v chromium-browser >/dev/null 2>&1; then
            chromium-browser --incognito "$url" 2>/dev/null || warning "无法打开 Chromium 隐私模式: $url"
        else
            xdg-open "$url" 2>/dev/null || warning "无法打开浏览器: $url"
        fi
    elif command -v start >/dev/null 2>&1; then
        # Windows - 优先使用 Chrome 隐私模式
        if command -v chrome >/dev/null 2>&1; then
            chrome --incognito "$url" 2>/dev/null || warning "无法打开 Chrome 隐私模式: $url"
        else
            start "$url" 2>/dev/null || warning "无法打开浏览器: $url"
        fi
    else
        warning "未找到可用的浏览器打开命令，请手动访问: $url"
    fi
}

# 检查 Docker 是否运行
check_docker() {
    if ! command -v docker >/dev/null 2>&1; then
        error "Docker 未安装"
        return 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        error "Docker 未运行，请启动 Docker"
        return 1
    fi
    
    success "Docker 已就绪"
    return 0
}

# 检查 Docker Compose 是否可用
check_docker_compose() {
    if ! command -v docker-compose >/dev/null 2>&1 && ! docker compose version >/dev/null 2>&1; then
        error "Docker Compose 未安装"
        return 1
    fi
    
    success "Docker Compose 已就绪"
    return 0
}

# 启动 Docker Compose 服务
start_docker_services() {
    log "🚀 启动 Docker Compose 服务..."
    
    cd "$PROJECT_ROOT"
    
    # 检查 docker-compose.yml 是否存在
    if [ ! -f "docker-compose.yml" ]; then
        error "docker-compose.yml 不存在"
        return 1
    fi
    
    # 启动服务
    if command -v docker-compose >/dev/null 2>&1; then
        docker-compose up -d
    else
        docker compose up -d
    fi
    
    success "Docker Compose 服务启动命令已执行"
}

# 等待服务启动
wait_for_services() {
    log "⏳ 等待服务启动..."
    
    # 等待核心服务
    local core_services=(
        "8002:Backend"
        "8001:AI Service"
        "3000:Frontend"
    )
    
    for service_info in "${core_services[@]}"; do
        IFS=':' read -r port name <<< "$service_info"
        wait_for_port $port "$name"
    done
    
    # 等待数据库服务
    local db_services=(
        "5432:PostgreSQL"
        "6379:Redis"
    )
    
    for service_info in "${db_services[@]}"; do
        IFS=':' read -r port name <<< "$service_info"
        wait_for_port $port "$name"
    done
    
    # 等待监控服务（可选）
    local monitoring_services=(
        "9200:Elasticsearch"
        "5601:Kibana"
    )
    
    for service_info in "${monitoring_services[@]}"; do
        IFS=':' read -r port name <<< "$service_info"
        if wait_for_port $port "$name" 2>/dev/null; then
            success "$name 已启动"
        else
            warning "$name 启动失败或未配置"
        fi
    done
}

# 显示服务状态
show_status() {
    log "📊 Docker 服务状态概览:"
    echo "=================================="
    
    cd "$PROJECT_ROOT"
    
    # 使用 docker-compose ps 显示状态
    if command -v docker-compose >/dev/null 2>&1; then
        docker-compose ps
    else
        docker compose ps
    fi
    
    echo "=================================="
}

# 显示访问地址
show_urls() {
    log "🌐 服务访问地址:"
    echo "=================================="
    echo "后端API:     http://localhost:8002"
    echo "AI服务:      http://localhost:8001"
    echo "前端应用:    http://localhost:3000"
    echo "Elasticsearch: http://localhost:9200"
    echo "Kibana:      http://localhost:5601"
    echo "Nginx:       http://localhost:80"
    echo "健康检查:    http://localhost:8002/health"
    echo "=================================="
}

# 打开所有服务的浏览器（Chrome 隐私模式）
open_all_browsers() {
    log "🌐 打开所有服务的浏览器（Chrome 隐私模式）..."
    
    # 等待一下确保所有服务都启动完成
    sleep 5
    
    # 打开核心服务
    info "正在打开 Backend Health 检查页面..."
    open_browser "http://localhost:8002/health" "Backend Health"
    sleep 2
    
    info "正在打开 AI Service 页面..."
    open_browser "http://localhost:8001" "AI Service"
    sleep 2
    
    info "正在打开 Frontend 应用页面..."
    open_browser "http://localhost:3000" "Frontend"
    sleep 2
    
    # 打开监控服务
    info "正在打开 Elasticsearch 监控页面..."
    open_browser "http://localhost:9200" "Elasticsearch"
    sleep 2
    
    info "正在打开 Kibana 监控页面..."
    open_browser "http://localhost:5601" "Kibana"
    sleep 2
    
    info "正在打开 Nginx 页面..."
    open_browser "http://localhost:80" "Nginx"
    
    success "所有服务已在 Chrome 隐私模式浏览器中打开"
}

# 显示 Docker 日志
show_logs() {
    log "📋 显示服务日志..."
    echo "=================================="
    
    cd "$PROJECT_ROOT"
    
    if command -v docker-compose >/dev/null 2>&1; then
        docker-compose logs --tail=10
    else
        docker compose logs --tail=10
    fi
    
    echo "=================================="
}

# 主函数
main() {
    log "🎯 Docker Compose 启动器 - 隐私模式浏览器"
    echo "=================================="
    echo "🟢 使用 Docker Compose 启动服务"
    echo "🟢 自动端口映射"
    echo "🟢 自动打开 Chrome 隐私模式浏览器"
    echo "🟢 智能错误处理"
    echo "🟢 优先使用 Chrome Incognito 模式"
    echo "=================================="
    
    # 检查依赖
    if ! check_docker; then
        exit 1
    fi
    
    if ! check_docker_compose; then
        exit 1
    fi
    
    # 启动服务
    start_docker_services
    
    # 等待服务启动
    wait_for_services
    
    # 显示状态
    show_status
    show_urls
    
    # 打开浏览器
    open_all_browsers
    
    # 显示日志
    show_logs
    
    log "💡 提示:"
    echo "- 使用 'docker-compose ps' 检查服务状态"
    echo "- 使用 'docker-compose logs [service]' 查看服务日志"
    echo "- 使用 'docker-compose down' 停止所有服务"
    echo "- 使用 '$0' 重新启动所有服务"
}

# 运行主函数
main "$@" 