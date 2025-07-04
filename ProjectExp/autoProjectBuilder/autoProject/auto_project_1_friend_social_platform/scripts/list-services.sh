#!/bin/bash

# 服务状态检查脚本
# 功能：列出所有服务的当前状态

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

# 服务配置 (macOS compatible)
SERVICES_FRONTEND="3000:Next.js Frontend"
SERVICES_BACKEND="8000:Node.js Backend API"
SERVICES_AI_SERVICE="8001:Python AI Service"
SERVICES_CHAT_SERVICE="8002:WebSocket Chat Service"
SERVICES_POSTGRES="5432:PostgreSQL Database"
SERVICES_REDIS="6379:Redis Cache"
SERVICES_ELASTICSEARCH="9200:Elasticsearch Search"
SERVICES_KIBANA="5601:Kibana Analytics"
SERVICES_NGINX="80:443:Nginx Reverse Proxy"
SERVICES_PROMETHEUS="9090:Prometheus Monitoring"
SERVICES_GRAFANA="3001:Grafana Dashboards"

# 服务名称数组
SERVICE_NAMES=("frontend" "backend" "ai-service" "chat-service" "postgres" "redis" "elasticsearch" "kibana" "nginx" "prometheus" "grafana")

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
        local pid=$(lsof -ti :$port)
        return 0
    else
        return 1
    fi
}

# 检查服务健康状态
check_service_health() {
    local url=$1
    local service_name=$2
    
    if command -v curl >/dev/null 2>&1; then
        if curl -s --max-time 5 "$url" >/dev/null 2>&1; then
            return 0
        else
            return 1
        fi
    else
        return 1
    fi
}

# 检查Redis状态
check_redis() {
    if command -v redis-cli >/dev/null 2>&1; then
        if redis-cli ping >/dev/null 2>&1; then
            return 0
        else
            return 1
        fi
    else
        return 1
    fi
}

# 检查PostgreSQL状态
check_postgres() {
    if command -v psql >/dev/null 2>&1; then
        if psql -h localhost -p 5432 -U postgres -d social_platform -c "SELECT 1;" >/dev/null 2>&1; then
            return 0
        else
            return 1
        fi
    else
        return 1
    fi
}

# 检查Docker容器状态
check_docker_container() {
    local container_name=$1
    if command -v docker >/dev/null 2>&1; then
        if docker ps --format "{{.Names}}" | grep -q "^${container_name}$"; then
            return 0
        else
            return 1
        fi
    else
        return 1
    fi
}

# 获取服务配置
get_service_config() {
    local service_name=$1
    case $service_name in
        "frontend")
            echo "$SERVICES_FRONTEND"
            ;;
        "backend")
            echo "$SERVICES_BACKEND"
            ;;
        "ai-service")
            echo "$SERVICES_AI_SERVICE"
            ;;
        "chat-service")
            echo "$SERVICES_CHAT_SERVICE"
            ;;
        "postgres")
            echo "$SERVICES_POSTGRES"
            ;;
        "redis")
            echo "$SERVICES_REDIS"
            ;;
        "elasticsearch")
            echo "$SERVICES_ELASTICSEARCH"
            ;;
        "kibana")
            echo "$SERVICES_KIBANA"
            ;;
        "nginx")
            echo "$SERVICES_NGINX"
            ;;
        "prometheus")
            echo "$SERVICES_PROMETHEUS"
            ;;
        "grafana")
            echo "$SERVICES_GRAFANA"
            ;;
        *)
            echo ""
            ;;
    esac
}

# 获取服务状态
get_service_status() {
    local service_name=$1
    local port_info=$2
    
    # 解析端口信息
    local ports=$(echo "$port_info" | cut -d':' -f1)
    local description=$(echo "$port_info" | cut -d':' -f2-)
    
    # 检查多个端口（如nginx的80:443）
    local port_array=(${ports//:/ })
    local all_ports_running=true
    
    for port in "${port_array[@]}"; do
        if ! check_port $port; then
            all_ports_running=false
            break
        fi
    done
    
    if [ "$all_ports_running" = true ]; then
        # 检查健康状态
        case $service_name in
            "backend")
                if check_service_health "http://localhost:8000/health" "Backend"; then
                    echo "RUNNING"
                else
                    echo "RUNNING_BUT_UNHEALTHY"
                fi
                ;;
            "ai-service")
                if check_service_health "http://localhost:8001/health" "AI Service"; then
                    echo "RUNNING"
                else
                    echo "RUNNING_BUT_UNHEALTHY"
                fi
                ;;
            "frontend")
                if check_service_health "http://localhost:3000" "Frontend"; then
                    echo "RUNNING"
                else
                    echo "RUNNING_BUT_UNHEALTHY"
                fi
                ;;
            "redis")
                if check_redis; then
                    echo "RUNNING"
                else
                    echo "RUNNING_BUT_UNHEALTHY"
                fi
                ;;
            "postgres")
                if check_postgres; then
                    echo "RUNNING"
                else
                    echo "RUNNING_BUT_UNHEALTHY"
                fi
                ;;
            "elasticsearch")
                if check_service_health "http://localhost:9200" "Elasticsearch"; then
                    echo "RUNNING"
                else
                    echo "RUNNING_BUT_UNHEALTHY"
                fi
                ;;
            "kibana")
                if check_service_health "http://localhost:5601" "Kibana"; then
                    echo "RUNNING"
                else
                    echo "RUNNING_BUT_UNHEALTHY"
                fi
                ;;
            "prometheus")
                if check_service_health "http://localhost:9090" "Prometheus"; then
                    echo "RUNNING"
                else
                    echo "RUNNING_BUT_UNHEALTHY"
                fi
                ;;
            "grafana")
                if check_service_health "http://localhost:3001" "Grafana"; then
                    echo "RUNNING"
                else
                    echo "RUNNING_BUT_UNHEALTHY"
                fi
                ;;
            *)
                echo "RUNNING"
                ;;
        esac
    else
        echo "STOPPED"
    fi
}

# 获取进程信息
get_process_info() {
    local port=$1
    if check_port $port; then
        local pid=$(lsof -ti :$port)
        local process_info=$(ps -p $pid -o pid,ppid,pcpu,pmem,etime,command --no-headers 2>/dev/null || echo "N/A")
        echo "$pid|$process_info"
    else
        echo "N/A|N/A"
    fi
}

# 显示服务状态表格
show_service_table() {
    echo ""
    echo "┌─────────────────────┬──────────┬──────────┬─────────────────────────────────┐"
    echo "│ Service Name        │ Status   │ Port(s)  │ Description                     │"
    echo "├─────────────────────┼──────────┼──────────┼─────────────────────────────────┤"
    
    for service_name in "${SERVICE_NAMES[@]}"; do
        local port_info=$(get_service_config "$service_name")
        local ports=$(echo "$port_info" | cut -d':' -f1)
        local description=$(echo "$port_info" | cut -d':' -f2-)
        local status=$(get_service_status "$service_name" "$port_info")
        
        # 格式化状态显示
        case $status in
            "RUNNING")
                status_display="${GREEN}RUNNING${NC}"
                ;;
            "RUNNING_BUT_UNHEALTHY")
                status_display="${YELLOW}UNHEALTHY${NC}"
                ;;
            "STOPPED")
                status_display="${RED}STOPPED${NC}"
                ;;
            *)
                status_display="${RED}UNKNOWN${NC}"
                ;;
        esac
        
        printf "│ %-19s │ %-8s │ %-8s │ %-31s │\n" "$service_name" "$status_display" "$ports" "$description"
    done
    
    echo "└─────────────────────┴──────────┴──────────┴─────────────────────────────────┘"
}

# 显示详细服务信息
show_detailed_info() {
    echo ""
    echo "📊 Detailed Service Information"
    echo "=================================="
    
    for service_name in "${SERVICE_NAMES[@]}"; do
        local port_info=$(get_service_config "$service_name")
        local ports=$(echo "$port_info" | cut -d':' -f1)
        local description=$(echo "$port_info" | cut -d':' -f2-)
        local status=$(get_service_status "$service_name" "$port_info")
        
        echo ""
        echo "🔧 $service_name"
        echo "   Description: $description"
        echo "   Port(s): $ports"
        echo "   Status: $status"
        
        # 显示进程信息
        local port_array=(${ports//:/ })
        for port in "${port_array[@]}"; do
            local process_info=$(get_process_info $port)
            local pid=$(echo "$process_info" | cut -d'|' -f1)
            local details=$(echo "$process_info" | cut -d'|' -f2)
            
            if [ "$pid" != "N/A" ]; then
                echo "   Process ID: $pid"
                echo "   Process Info: $details"
            fi
        done
        
        # 显示健康检查URL
        case $service_name in
            "frontend")
                echo "   Health Check: http://localhost:3000"
                ;;
            "backend")
                echo "   Health Check: http://localhost:8000/health"
                ;;
            "ai-service")
                echo "   Health Check: http://localhost:8001/health"
                ;;
            "chat-service")
                echo "   Health Check: ws://localhost:8002"
                ;;
            "redis")
                echo "   Health Check: redis-cli ping"
                ;;
            "elasticsearch")
                echo "   Health Check: http://localhost:9200"
                ;;
            "kibana")
                echo "   Health Check: http://localhost:5601"
                ;;
            "prometheus")
                echo "   Health Check: http://localhost:9090"
                ;;
            "grafana")
                echo "   Health Check: http://localhost:3001"
                ;;
        esac
    done
}

# 显示Docker容器状态
show_docker_status() {
    if command -v docker >/dev/null 2>&1; then
        echo ""
        echo "🐳 Docker Container Status"
        echo "=========================="
        
        local containers=(
            "social_platform_postgres"
            "social_platform_redis"
            "social_platform_elasticsearch"
            "social_platform_kibana"
            "social_platform_frontend"
            "social_platform_backend"
            "social_platform_ai_service"
            "social_platform_chat_service"
            "social_platform_nginx"
            "social_platform_prometheus"
            "social_platform_grafana"
        )
        
        for container in "${containers[@]}"; do
            if check_docker_container "$container"; then
                local status=$(docker ps --filter "name=$container" --format "{{.Status}}")
                success "$container: $status"
            else
                warning "$container: Not running"
            fi
        done
    else
        echo ""
        warning "Docker not installed or not available"
    fi
}

# 显示系统资源使用情况
show_system_resources() {
    echo ""
    echo "💻 System Resources"
    echo "==================="
    
    # CPU Usage
    local cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | cut -d'%' -f1)
    echo "CPU Usage: ${cpu_usage}%"
    
    # Memory Usage
    local memory_info=$(vm_stat | grep "Pages free" | awk '{print $3}' | sed 's/\.//')
    local total_memory=$(sysctl hw.memsize | awk '{print $2}')
    local free_memory=$((memory_info * 4096))
    local used_memory=$((total_memory - free_memory))
    local memory_percent=$((used_memory * 100 / total_memory))
    echo "Memory Usage: ${memory_percent}%"
    
    # Disk Usage
    local disk_usage=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
    echo "Disk Usage: ${disk_usage}%"
}

# 显示启动命令
show_startup_commands() {
    echo ""
    echo "🚀 Startup Commands"
    echo "==================="
    echo "Quick Start: ./scripts/quick-start.sh"
    echo "Service Manager: ./scripts/service-manager.sh start"
    echo "Docker Compose: docker-compose up -d"
    echo "Manual Start: npm run dev"
    echo ""
    echo "Individual Service Commands:"
    echo "  Frontend: cd frontend && npm run dev"
    echo "  Backend: cd backend && npm run dev"
    echo "  AI Service: cd ai-service && python -m uvicorn app:app --reload --port 8001"
    echo "  Chat Service: cd chat-service && npm run dev"
    echo "  Redis: redis-server --daemonize yes"
}

# 主函数
main() {
    echo "🔍 Service Status Check"
    echo "======================="
    echo "Project: Friend Social Platform"
    echo "Time: $(date)"
    echo "Location: $PROJECT_ROOT"
    
    # 显示服务状态表格
    show_service_table

    # 新增：端口和手动启动命令汇总
    echo ""
    echo "📋 Service Port Summary"
    echo "======================"
    printf "%-16s | %-8s | %s\n" "Service" "Port(s)" "Manual Start Command"
    echo "------------------|----------|---------------------------------------------"
    printf "%-16s | %-8s | %s\n" "frontend" "3000" "cd frontend && npm run dev"
    printf "%-16s | %-8s | %s\n" "backend" "8000" "cd backend && npm run dev"
    printf "%-16s | %-8s | %s\n" "ai-service" "8001" "cd ai-service && python -m uvicorn app:app --reload --port 8001"
    printf "%-16s | %-8s | %s\n" "chat-service" "8002" "cd chat-service && npm run dev"
    printf "%-16s | %-8s | %s\n" "redis" "6379" "redis-server --daemonize yes"
    printf "%-16s | %-8s | %s\n" "postgres" "5432" "(docker or system service)"
    printf "%-16s | %-8s | %s\n" "elasticsearch" "9200" "(docker or system service)"
    printf "%-16s | %-8s | %s\n" "kibana" "5601" "(docker or system service)"
    printf "%-16s | %-8s | %s\n" "nginx" "80/443" "(docker or system service)"
    printf "%-16s | %-8s | %s\n" "prometheus" "9090" "(docker or system service)"
    printf "%-16s | %-8s | %s\n" "grafana" "3001" "(docker or system service)"
    echo ""
    
    # 显示详细信息
    if [ "$1" = "--detailed" ] || [ "$1" = "-d" ]; then
        show_detailed_info
    fi
    
    # 显示Docker状态
    show_docker_status
    
    # 显示系统资源
    show_system_resources
    
    # 显示启动命令
    show_startup_commands
    
    echo ""
    echo "📝 Usage:"
    echo "  ./scripts/list-services.sh          # Basic status"
    echo "  ./scripts/list-services.sh --detailed # Detailed information"
    echo "  ./scripts/list-services.sh -d       # Short form for detailed"
}

# 检查参数
case "$1" in
    "--help"|"-h")
        echo "Service Status Check Script"
        echo ""
        echo "Usage:"
        echo "  $0              # Show basic service status"
        echo "  $0 --detailed   # Show detailed information"
        echo "  $0 -d           # Short form for detailed"
        echo "  $0 --help       # Show this help"
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac 