#!/bin/bash

# 快速监控启动脚本
# 简化版本，专注于核心功能

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVICE_MANAGER="$PROJECT_ROOT/scripts/service-manager.sh"
LOG_DIR="$PROJECT_ROOT/logs"
mkdir -p "$LOG_DIR"

# 端口配置
BACKEND_PORT=8000
AI_SERVICE_PORT=8001
REDIS_PORT=6379
FRONTEND_PORT=3000

# 日志函数
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
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

# 检查端口
check_port() {
    local port=$1
    lsof -i :$port >/dev/null 2>&1
}

# 获取服务状态
get_service_status() {
    local service=$1
    local port=""
    
    case $service in
        "backend") port=$BACKEND_PORT ;;
        "ai") port=$AI_SERVICE_PORT ;;
        "redis") port=$REDIS_PORT ;;
        "frontend") port=$FRONTEND_PORT ;;
        *) return 1 ;;
    esac
    
    if check_port $port; then
        echo "running"
    else
        echo "stopped"
    fi
}

# 快速修复服务
quick_repair() {
    local service=$1
    local status=$2
    
    if [ "$status" = "stopped" ]; then
        log "修复 $service..."
        case $service in
            "backend"|"ai"|"redis")
                if "$SERVICE_MANAGER" restart "$service" >/dev/null 2>&1; then
                    success "$service 修复成功"
                    return 0
                else
                    error "$service 修复失败"
                    return 1
                fi
                ;;
            "frontend")
                if [ -f "$PROJECT_ROOT/scripts/frontend-manager.sh" ]; then
                    if "$PROJECT_ROOT/scripts/frontend-manager.sh" start >/dev/null 2>&1; then
                        success "$service 修复成功"
                        return 0
                    else
                        error "$service 修复失败"
                        return 1
                    fi
                else
                    warning "$service 缺少管理器"
                    return 1
                fi
                ;;
        esac
    fi
}

# 主检查函数
main_check() {
    log "🔍 快速检查服务状态..."
    
    local services=("backend" "ai" "redis" "frontend")
    local healthy_count=0
    local needs_repair=()
    local repaired_count=0
    local failed_services=()
    
    # 检查状态
    for service in "${services[@]}"; do
        local status=$(get_service_status "$service")
        if [ "$status" = "running" ]; then
            success "$service: 运行中"
            healthy_count=$((healthy_count + 1))
        else
            warning "$service: 已停止"
            needs_repair+=("$service")
        fi
    done
    
    echo ""
    log "📊 状态摘要: $healthy_count/${#services[@]} 个服务正常运行"
    
    # 自动修复
    if [ ${#needs_repair[@]} -gt 0 ]; then
        echo ""
        log "🔧 开始自动修复..."
        
        for service in "${needs_repair[@]}"; do
            local status=$(get_service_status "$service")
            if quick_repair "$service" "$status"; then
                repaired_count=$((repaired_count + 1))
            else
                failed_services+=("$service")
            fi
        done
        
        echo ""
        if [ $repaired_count -gt 0 ]; then
            success "成功修复 $repaired_count 个服务"
        fi
        
        if [ ${#failed_services[@]} -gt 0 ]; then
            warning "修复失败: ${failed_services[*]}"
            echo ""
            echo "🔧 建议手动操作:"
            for service in "${failed_services[@]}"; do
                echo "  • $service: 检查日志文件或手动重启"
            done
        fi
    else
        success "🎉 所有服务运行正常！"
    fi
    
    return ${#failed_services[@]}
}

# 持续监控
continuous_monitor() {
    local interval=${1:-60}
    log "🔄 启动持续监控 (间隔: ${interval}秒)"
    log "按 Ctrl+C 停止"
    
    trap 'echo ""; log "停止监控"; exit 0' INT TERM
    
    local cycle=0
    while true; do
        cycle=$((cycle + 1))
        echo ""
        log "=== 第 $cycle 次检查 ==="
        main_check
        
        if [ $cycle -lt 999999 ]; then
            log "⏰ ${interval}秒后进行下次检查..."
            sleep $interval
        else
            break
        fi
    done
}

# 显示帮助
show_help() {
    echo "快速服务监控脚本"
    echo ""
    echo "用法: $0 [命令] [选项]"
    echo ""
    echo "命令:"
    echo "  check                   单次检查"
    echo "  monitor [间隔]          持续监控 (默认60秒)"
    echo "  help                    显示帮助"
    echo ""
    echo "示例:"
    echo "  $0 check                检查一次"
    echo "  $0 monitor              持续监控 (60秒间隔)"
    echo "  $0 monitor 30           持续监控 (30秒间隔)"
}

# 主函数
case "${1:-check}" in
    "check")
        main_check
        ;;
    "monitor")
        continuous_monitor "${2:-60}"
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        echo "未知命令: $1"
        show_help
        exit 1
        ;;
esac 