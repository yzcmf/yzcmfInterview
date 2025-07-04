#!/bin/bash

# 智能服务启动脚本 - 自动启动所有服务，跳过问题服务
# 功能：自动安装依赖、启动服务、跳过问题服务

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

# 服务配置
declare -A SERVICES=(
    ["redis"]="6379:Redis:缓存服务"
    ["postgresql"]="5432:PostgreSQL:数据库服务"
    ["backend"]="8000:Backend:Node.js API"
    ["ai"]="8001:AI Service:AI服务"
    ["frontend"]="3000:Frontend:Next.js前端"
    ["chat"]="8002:Chat Service:WebSocket聊天"
    ["elasticsearch"]="9200:Elasticsearch:搜索引擎"
    ["kibana"]="5601:Kibana:数据分析"
    ["nginx"]="80:Nginx:反向代理"
    ["prometheus"]="9090:Prometheus:监控"
    ["grafana"]="3001:Grafana:仪表板"
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

skip() {
    echo -e "${PURPLE}⏭️  $1${NC}"
}

# 检查端口是否被占用
check_port() {
    local port=$1
    if lsof -i :$port >/dev/null 2>&1; then
        local pid=$(lsof -ti :$port)
        return 0
    else
        return 1
    fi
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
                "elasticsearch")
                    brew install elasticsearch
                    ;;
                "nginx")
                    brew install nginx
                    ;;
                *)
                    warning "未知依赖: $dependency"
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
                "elasticsearch")
                    sudo apt-get update && sudo apt-get install -y elasticsearch
                    ;;
                "nginx")
                    sudo apt-get update && sudo apt-get install -y nginx
                    ;;
                *)
                    warning "未知依赖: $dependency"
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
                "elasticsearch")
                    sudo yum install -y elasticsearch
                    ;;
                "nginx")
                    sudo yum install -y nginx
                    ;;
                *)
                    warning "未知依赖: $dependency"
                    return 1
                    ;;
            esac
            ;;
        *)
            warning "未检测到支持的包管理器"
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

# 检查并安装依赖
check_and_install_dependencies() {
    local service=$1
    
    case $service in
        "backend")
            if ! command -v node >/dev/null 2>&1; then
                warning "Node.js 未安装，正在自动安装..."
                auto_install_dependency "node"
            fi
            if ! command -v npm >/dev/null 2>&1; then
                warning "npm 未安装，正在自动安装..."
                auto_install_dependency "node"
            fi
            ;;
        "ai")
            if ! command -v python3 >/dev/null 2>&1; then
                warning "Python3 未安装，正在自动安装..."
                auto_install_dependency "python3"
            fi
            ;;
        "redis")
            if ! command -v redis-server >/dev/null 2>&1; then
                warning "Redis 未安装，正在自动安装..."
                auto_install_dependency "redis"
            fi
            ;;
        "postgresql")
            if ! command -v postgres >/dev/null 2>&1; then
                warning "PostgreSQL 未安装，正在自动安装..."
                auto_install_dependency "postgresql"
            fi
            ;;
        "elasticsearch")
            if ! command -v elasticsearch >/dev/null 2>&1; then
                warning "Elasticsearch 未安装，正在自动安装..."
                auto_install_dependency "elasticsearch"
            fi
            ;;
        "nginx")
            if ! command -v nginx >/dev/null 2>&1; then
                warning "Nginx 未安装，正在自动安装..."
                auto_install_dependency "nginx"
            fi
            ;;
    esac
}

# 启动Redis
start_redis() {
    local port=6379
    local service_name="Redis"
    
    if check_port $port; then
        success "$service_name 已在运行"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    check_and_install_dependencies "redis"
    
    if command -v redis-server >/dev/null 2>&1; then
        redis-server --daemonize yes --logfile "$LOG_DIR/redis.log"
        sleep 2
        if check_port $port; then
            success "$service_name 启动成功"
            return 0
        else
            error "$service_name 启动失败"
            return 1
        fi
    else
        skip "$service_name 依赖安装失败，跳过"
        return 1
    fi
}

# 启动PostgreSQL
start_postgresql() {
    local port=5432
    local service_name="PostgreSQL"
    
    if check_port $port; then
        success "$service_name 已在运行"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    check_and_install_dependencies "postgresql"
    
    if command -v postgres >/dev/null 2>&1; then
        if command -v brew >/dev/null 2>&1; then
            brew services start postgresql@14 2>/dev/null || {
                skip "$service_name 启动失败，跳过"
                return 1
            }
            sleep 3
            if check_port $port; then
                success "$service_name 启动成功"
                return 0
            else
                skip "$service_name 启动失败，跳过"
                return 1
            fi
        else
            skip "$service_name 不支持当前系统，跳过"
            return 1
        fi
    else
        skip "$service_name 依赖安装失败，跳过"
        return 1
    fi
}

# 启动后端服务
start_backend() {
    local port=8000
    local service_name="Backend"
    
    if check_port $port; then
        success "$service_name 已在运行"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    check_and_install_dependencies "backend"
    
    if [ ! -d "$PROJECT_ROOT/backend" ]; then
        skip "$service_name 目录不存在，跳过"
        return 1
    fi
    
    cd "$PROJECT_ROOT/backend"
    
    # 检查依赖是否安装
    if [ ! -d "node_modules" ]; then
        log "安装后端依赖..."
        npm install || {
            skip "$service_name 依赖安装失败，跳过"
            return 1
        }
    fi
    
    # 启动服务
    nohup npm run dev > "$LOG_DIR/backend.log" 2>&1 &
    local backend_pid=$!
    
    # 快速检查，不等待太久
    sleep 3
    if check_port $port; then
        success "$service_name 启动成功 (PID: $backend_pid)"
        return 0
    else
        skip "$service_name 启动超时，跳过"
        return 1
    fi
}

# 启动AI服务
start_ai() {
    local port=8001
    local service_name="AI Service"
    
    if check_port $port; then
        success "$service_name 已在运行"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    check_and_install_dependencies "ai"
    
    if [ ! -d "$PROJECT_ROOT/ai-service" ]; then
        skip "$service_name 目录不存在，跳过"
        return 1
    fi
    
    cd "$PROJECT_ROOT/ai-service"
    
    # 检查Python依赖
    if [ ! -f "requirements.txt" ]; then
        skip "$service_name requirements.txt 不存在，跳过"
        return 1
    fi
    
    # 检查是否安装了依赖
    if ! python3 -c "import fastapi" 2>/dev/null; then
        log "安装AI服务依赖..."
        pip3 install -r requirements.txt || {
            skip "$service_name 依赖安装失败，跳过"
            return 1
        }
    fi
    
    # 启动服务
    nohup python3 -m uvicorn app:app --reload --port $port > "$LOG_DIR/ai-service.log" 2>&1 &
    local ai_pid=$!
    
    # 快速检查
    sleep 3
    if check_port $port; then
        success "$service_name 启动成功 (PID: $ai_pid)"
        return 0
    else
        skip "$service_name 启动超时，跳过"
        return 1
    fi
}

# 启动前端服务
start_frontend() {
    local port=3000
    local service_name="Frontend"
    
    if check_port $port; then
        success "$service_name 已在运行"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    check_and_install_dependencies "backend"
    
    if [ ! -d "$PROJECT_ROOT/frontend" ]; then
        skip "$service_name 目录不存在，跳过"
        return 1
    fi
    
    cd "$PROJECT_ROOT/frontend"
    
    # 检查依赖是否安装
    if [ ! -d "node_modules" ]; then
        log "安装前端依赖..."
        npm install || {
            skip "$service_name 依赖安装失败，跳过"
            return 1
        }
    fi
    
    # 启动服务
    nohup npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
    local frontend_pid=$!
    
    # 快速检查
    sleep 3
    if check_port $port; then
        success "$service_name 启动成功 (PID: $frontend_pid)"
        return 0
    else
        skip "$service_name 启动超时，跳过"
        return 1
    fi
}

# 启动聊天服务
start_chat() {
    local port=8002
    local service_name="Chat Service"
    
    if check_port $port; then
        success "$service_name 已在运行"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    
    # 检查是否有聊天服务配置
    if [ ! -f "$PROJECT_ROOT/backend/src/chatService.js" ] && [ ! -f "$PROJECT_ROOT/chat-service/package.json" ]; then
        skip "$service_name 配置不存在，跳过"
        return 1
    fi
    
    # 这里可以添加聊天服务的启动逻辑
    skip "$service_name 暂未实现，跳过"
    return 1
}

# 启动Elasticsearch
start_elasticsearch() {
    local port=9200
    local service_name="Elasticsearch"
    
    if check_port $port; then
        success "$service_name 已在运行"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    check_and_install_dependencies "elasticsearch"
    
    if command -v elasticsearch >/dev/null 2>&1; then
        nohup elasticsearch > "$LOG_DIR/elasticsearch.log" 2>&1 &
        sleep 5
        if check_port $port; then
            success "$service_name 启动成功"
            return 0
        else
            skip "$service_name 启动失败，跳过"
            return 1
        fi
    else
        skip "$service_name 依赖安装失败，跳过"
        return 1
    fi
}

# 启动Kibana
start_kibana() {
    local port=5601
    local service_name="Kibana"
    
    if check_port $port; then
        success "$service_name 已在运行"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    
    if command -v kibana >/dev/null 2>&1; then
        nohup kibana > "$LOG_DIR/kibana.log" 2>&1 &
        sleep 5
        if check_port $port; then
            success "$service_name 启动成功"
            return 0
        else
            skip "$service_name 启动失败，跳过"
            return 1
        fi
    else
        skip "$service_name 未安装，跳过"
        return 1
    fi
}

# 启动Nginx
start_nginx() {
    local port=80
    local service_name="Nginx"
    
    if check_port $port; then
        success "$service_name 已在运行"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    check_and_install_dependencies "nginx"
    
    if command -v nginx >/dev/null 2>&1; then
        sudo nginx || {
            skip "$service_name 启动失败，跳过"
            return 1
        }
        sleep 2
        if check_port $port; then
            success "$service_name 启动成功"
            return 0
        else
            skip "$service_name 启动失败，跳过"
            return 1
        fi
    else
        skip "$service_name 依赖安装失败，跳过"
        return 1
    fi
}

# 启动Prometheus
start_prometheus() {
    local port=9090
    local service_name="Prometheus"
    
    if check_port $port; then
        success "$service_name 已在运行"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    
    if [ -f "$PROJECT_ROOT/prometheus/prometheus.yml" ]; then
        cd "$PROJECT_ROOT/prometheus"
        nohup ./prometheus --config.file=prometheus.yml > "$LOG_DIR/prometheus.log" 2>&1 &
        sleep 3
        if check_port $port; then
            success "$service_name 启动成功"
            return 0
        else
            skip "$service_name 启动失败，跳过"
            return 1
        fi
    else
        skip "$service_name 配置不存在，跳过"
        return 1
    fi
}

# 启动Grafana
start_grafana() {
    local port=3001
    local service_name="Grafana"
    
    if check_port $port; then
        success "$service_name 已在运行"
        return 0
    fi
    
    log "🚀 启动 $service_name..."
    
    if command -v grafana-server >/dev/null 2>&1; then
        nohup grafana-server > "$LOG_DIR/grafana.log" 2>&1 &
        sleep 3
        if check_port $port; then
            success "$service_name 启动成功"
            return 0
        else
            skip "$service_name 启动失败，跳过"
            return 1
        fi
    else
        skip "$service_name 未安装，跳过"
        return 1
    fi
}

# 显示服务状态
show_status() {
    log "📊 服务状态概览:"
    echo "=================================="
    
    for service in "${!SERVICES[@]}"; do
        IFS=':' read -r port name desc <<< "${SERVICES[$service]}"
        if check_port $port; then
            local pid=$(lsof -ti :$port)
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
    echo "后端API:     http://localhost:8000"
    echo "AI服务:      http://localhost:8001"
    echo "前端应用:    http://localhost:3000"
    echo "聊天服务:    http://localhost:8002"
    echo "Elasticsearch: http://localhost:9200"
    echo "Kibana:      http://localhost:5601"
    echo "Nginx:       http://localhost:80"
    echo "Prometheus:  http://localhost:9090"
    echo "Grafana:     http://localhost:3001"
    echo "健康检查:    http://localhost:8000/health"
    echo "=================================="
}

# 启动所有服务
start_all_services() {
    log "🚀 智能启动所有服务..."
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
    if start_ai; then
        started_count=$((started_count + 1))
    else
        skipped_count=$((skipped_count + 1))
    fi
    
    total_count=$((total_count + 1))
    if start_frontend; then
        started_count=$((started_count + 1))
    else
        skipped_count=$((skipped_count + 1))
    fi
    
    # 启动可选服务
    total_count=$((total_count + 1))
    if start_chat; then
        started_count=$((started_count + 1))
    else
        skipped_count=$((skipped_count + 1))
    fi
    
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
    if start_nginx; then
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
    log "🎯 智能服务启动器"
    echo "=================================="
    echo "🟢 自动安装依赖"
    echo "🟢 跳过问题服务"
    echo "🟢 快速启动模式"
    echo "🟢 不卡住任何服务"
    echo "=================================="
    
    start_all_services
    
    # 显示最终状态
    show_status
    show_urls
    
    log "💡 提示:"
    echo "- 使用 './scripts/service-manager.sh check' 检查服务状态"
    echo "- 使用 './scripts/service-manager.sh logs [service]' 查看服务日志"
    echo "- 使用 './scripts/service-manager.sh stop' 停止所有服务"
    echo "- 使用 '$0' 重新启动所有服务"
}

# 运行主函数
main "$@" 