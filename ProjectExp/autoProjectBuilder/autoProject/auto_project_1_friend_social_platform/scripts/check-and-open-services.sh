#!/bin/bash

# 服务检查和浏览器打开脚本
# 功能：检查所有服务状态、列出端口，然后打开浏览器

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

# 检查服务状态
check_service_status() {
    local service_name=$1
    local port=$2
    
    if check_port $port; then
        success "$service_name - 端口 $port ✅ (运行中)"
        return 0
    else
        error "$service_name - 端口 $port ❌ (未运行)"
        return 1
    fi
}

# 显示所有服务状态
show_all_services() {
    log "🔍 检查所有服务状态..."
    echo "=================================="
    echo "服务名称          端口    状态"
    echo "=================================="
    
    local running_count=0
    local total_count=9
    
    # Backend
    if check_service_status "Backend" "8002"; then
        running_count=$((running_count + 1))
    fi
    
    # AI Service
    if check_service_status "AI Service" "8001"; then
        running_count=$((running_count + 1))
    fi
    
    # Frontend
    if check_service_status "Frontend" "3000"; then
        running_count=$((running_count + 1))
    fi
    
    # Elasticsearch
    if check_service_status "Elasticsearch" "9200"; then
        running_count=$((running_count + 1))
    fi
    
    # Kibana
    if check_service_status "Kibana" "5601"; then
        running_count=$((running_count + 1))
    fi
    
    # Nginx
    if check_service_status "Nginx" "80"; then
        running_count=$((running_count + 1))
    fi
    
    # PostgreSQL
    if check_service_status "PostgreSQL" "5432"; then
        running_count=$((running_count + 1))
    fi
    
    # Redis
    if check_service_status "Redis" "6379"; then
        running_count=$((running_count + 1))
    fi
    
    # Grafana
    if check_service_status "Grafana" "3001"; then
        running_count=$((running_count + 1))
    fi
    
    echo "=================================="
    echo "总计: $running_count/$total_count 个服务正在运行"
    echo "=================================="
    
    return $running_count
}

# 显示 Docker 容器状态
show_docker_status() {
    log "🐳 Docker 容器状态:"
    echo "=================================="
    
    cd "$PROJECT_ROOT"
    
    if command -v docker-compose >/dev/null 2>&1; then
        docker-compose ps
    else
        docker compose ps
    fi
    
    echo "=================================="
}

# 显示服务访问地址
show_service_urls() {
    log "🌐 服务访问地址列表:"
    echo "=================================="
    echo "服务名称          端口    访问地址"
    echo "=================================="
    echo "Backend          8002     http://localhost:8002/health"
    echo "AI Service       8001     http://localhost:8001"
    echo "Frontend         3000     http://localhost:3000"
    echo "Elasticsearch    9200     http://localhost:9200"
    echo "Kibana           5601     http://localhost:5601"
    echo "Nginx            80       http://localhost:80"
    echo "PostgreSQL       5432     http://localhost:5432"
    echo "Redis            6379     http://localhost:6379"
    echo "Grafana          3001     http://localhost:3001"
    echo "=================================="
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
            /Applications/Chromium.app/Contents/MacOS/Chromium --incognito "$url" 2>/dev/null || warning "无法打开 Chrome 隐私模式: $url"
        else
            # 使用 open 命令打开 Chrome
            open -a "Google Chrome" --args --incognito "$url" 2>/dev/null || warning "无法打开 Chrome 隐私模式: $url"
        fi
    elif command -v xdg-open >/dev/null 2>&1; then
        # Linux - 优先使用 Chrome 隐私模式
        if command -v google-chrome >/dev/null 2>&1; then
            google-chrome --incognito "$url" 2>/dev/null || warning "无法打开 Chrome 隐私模式: $url"
        elif command -v chromium-browser >/dev/null 2>&1; then
            chromium-browser --incognito "$url" 2>/dev/null || warning "无法打开 Chrome 隐私模式: $url"
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

# 打开所有运行中的服务
open_running_services() {
    log "🚀 打开所有运行中的服务..."
    
    local opened_count=0
    
    # Backend
    if check_port 8002; then
        info "正在打开 Backend..."
        open_browser "http://localhost:8002/health" "Backend"
        opened_count=$((opened_count + 1))
        sleep 2
    fi
    
    # AI Service
    if check_port 8001; then
        info "正在打开 AI Service..."
        open_browser "http://localhost:8001" "AI Service"
        opened_count=$((opened_count + 1))
        sleep 2
    fi
    
    # Frontend
    if check_port 3000; then
        info "正在打开 Frontend..."
        open_browser "http://localhost:3000" "Frontend"
        opened_count=$((opened_count + 1))
        sleep 2
    fi
    
    # Elasticsearch
    if check_port 9200; then
        info "正在打开 Elasticsearch..."
        open_browser "http://localhost:9200" "Elasticsearch"
        opened_count=$((opened_count + 1))
        sleep 2
    fi
    
    # Kibana
    if check_port 5601; then
        info "正在打开 Kibana..."
        open_browser "http://localhost:5601" "Kibana"
        opened_count=$((opened_count + 1))
        sleep 2
    fi
    
    # Nginx
    if check_port 80; then
        info "正在打开 Nginx..."
        open_browser "http://localhost:80" "Nginx"
        opened_count=$((opened_count + 1))
        sleep 2
    fi
    
    # Grafana
    if check_port 3001; then
        info "正在打开 Grafana..."
        open_browser "http://localhost:3001" "Grafana"
        opened_count=$((opened_count + 1))
        sleep 2
    fi
    
    success "已打开 $opened_count 个运行中的服务"
}

# 主函数
main() {
    log "🔍 服务检查和浏览器打开器"
    echo "=================================="
    echo "🟢 检查所有服务状态"
    echo "🟢 显示端口和访问地址"
    echo "🟢 打开运行中的服务"
    echo "🟢 Chrome 隐私模式"
    echo "=================================="
    
    # 检查 Docker 状态
    show_docker_status
    
    # 检查所有服务
    show_all_services
    local running_count=$?
    
    # 显示访问地址
    show_service_urls
    
    # 询问是否打开浏览器
    if [ $running_count -gt 0 ]; then
        echo ""
        read -p "是否要打开所有运行中的服务? (y/n): " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            open_running_services
        else
            info "跳过打开浏览器"
        fi
    else
        warning "没有运行中的服务"
    fi
    
    log "💡 提示:"
    echo "- 使用 'docker-compose ps' 检查服务状态"
    echo "- 使用 'docker-compose logs [service]' 查看服务日志"
    echo "- 使用 '$0' 重新检查服务状态"
}

# 运行主函数
main "$@" 