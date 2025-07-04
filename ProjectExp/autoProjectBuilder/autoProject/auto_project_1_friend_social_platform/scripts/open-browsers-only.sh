#!/bin/bash

# 简单浏览器打开脚本 - 打开所有服务的浏览器
# 功能：打开所有服务的浏览器，不启动服务

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

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

# 显示访问地址
show_urls() {
    log "🌐 服务访问地址:"
    echo "=================================="
    echo "后端API:     http://localhost:8002"
    echo "AI服务:      http://localhost:8001"
    echo "前端应用:    http://localhost:3000"
    echo "Elasticsearch: http://localhost:9200"
    echo "Kibana:      http://localhost:5601"
    echo "PostgreSQL:  localhost:5432"
    echo "Redis:       localhost:6379"
    echo "健康检查:    http://localhost:8002/health"
    echo "=================================="
}

# 打开所有服务的浏览器
open_all_browsers() {
    log "🌐 打开所有服务的浏览器..."
    
    # 打开核心服务
    open_browser "http://localhost:8002/health" "Backend Health"
    sleep 1
    open_browser "http://localhost:8002" "Backend API"
    sleep 1
    open_browser "http://localhost:8001" "AI Service"
    sleep 1
    open_browser "http://localhost:3000" "Frontend"
    sleep 1
    
    # 打开监控服务
    open_browser "http://localhost:9200" "Elasticsearch"
    sleep 1
    open_browser "http://localhost:5601" "Kibana"
    sleep 1
    
    success "所有浏览器已打开"
}

# 检查服务状态
check_services() {
    log "🔍 检查服务状态..."
    
    local services=(
        "8002:Backend"
        "8001:AI Service"
        "3000:Frontend"
        "9200:Elasticsearch"
        "5601:Kibana"
        "5432:PostgreSQL"
        "6379:Redis"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r port name <<< "$service_info"
        if lsof -i :$port >/dev/null 2>&1; then
            success "$name 正在运行 (端口: $port)"
        else
            warning "$name 未运行 (端口: $port)"
        fi
    done
}

# 主函数
main() {
    log "🎯 浏览器打开器"
    echo "=================================="
    echo "🟢 打开所有服务的浏览器"
    echo "🟢 显示服务状态"
    echo "🟢 显示访问地址"
    echo "=================================="
    
    # 检查服务状态
    check_services
    
    # 显示访问地址
    show_urls
    
    # 打开浏览器
    open_all_browsers
    
    log "💡 提示:"
    echo "- 如果某些服务未运行，请先启动 Docker Compose 服务"
    echo "- 使用 'docker-compose up -d' 启动所有服务"
    echo "- 使用 'docker-compose ps' 检查服务状态"
}

# 运行主函数
main "$@" 