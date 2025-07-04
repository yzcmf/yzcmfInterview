#!/bin/bash

# 直接打开所有服务的脚本
# 功能：检查并打开所有运行中的服务

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 日志函数
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
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

# 打开浏览器（Chrome 隐私模式）
open_browser() {
    local url=$1
    local service_name=$2
    
    log "🌐 打开 $service_name: $url"
    
    if command -v open >/dev/null 2>&1; then
        # macOS - 使用 Chrome 隐私模式
        if command -v /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome >/dev/null 2>&1; then
            /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --incognito "$url" 2>/dev/null || warning "无法打开 Chrome: $url"
        else
            # 使用 open 命令打开 Chrome
            open -a "Google Chrome" --args --incognito "$url" 2>/dev/null || warning "无法打开 Chrome: $url"
        fi
    else
        warning "未找到可用的浏览器打开命令，请手动访问: $url"
    fi
}

# 主函数
main() {
    log "🚀 打开所有运行中的服务..."
    echo "=================================="
    
    local opened_count=0
    
    # 定义服务和URL
    local services=(
        "Backend:8002:http://localhost:8002/health"
        "AI Service:8001:http://localhost:8001"
        "Frontend:3000:http://localhost:3000"
        "Elasticsearch:9200:http://localhost:9200"
        "Kibana:5601:http://localhost:5601"
        "Nginx:80:http://localhost:80"
        "Grafana:3001:http://localhost:3001"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r name port url <<< "$service_info"
        
        if check_port $port; then
            info "正在打开 $name..."
            open_browser "$url" "$name"
            opened_count=$((opened_count + 1))
            sleep 1
        else
            warning "跳过 $name (端口 $port 未运行)"
        fi
    done
    
    echo "=================================="
    success "已打开 $opened_count 个运行中的服务"
    echo "=================================="
}

# 运行主函数
main "$@" 