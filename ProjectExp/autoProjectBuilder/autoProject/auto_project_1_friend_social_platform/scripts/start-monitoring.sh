#!/bin/bash

# 一键启动监控服务脚本
# 自动启动所有监控和修复服务

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# 配置
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$PROJECT_ROOT/logs"
PID_DIR="$PROJECT_ROOT/pids"
mkdir -p "$LOG_DIR" "$PID_DIR"

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

info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

# 检查进程是否运行
is_process_running() {
    local pid_file=$1
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            return 0
        else
            rm -f "$pid_file"
            return 1
        fi
    fi
    return 1
}

# 启动后台进程
start_background_process() {
    local name=$1
    local command=$2
    local pid_file="$PID_DIR/${name}.pid"
    local log_file="$LOG_DIR/${name}.log"
    
    if is_process_running "$pid_file"; then
        warning "$name 已在运行 (PID: $(cat $pid_file))"
        return 0
    fi
    
    log "启动 $name..."
    nohup $command > "$log_file" 2>&1 &
    local pid=$!
    echo $pid > "$pid_file"
    
    # 等待一下确认启动成功
    sleep 2
    if kill -0 "$pid" 2>/dev/null; then
        success "$name 启动成功 (PID: $pid)"
        return 0
    else
        error "$name 启动失败"
        rm -f "$pid_file"
        return 1
    fi
}

# 停止进程
stop_process() {
    local name=$1
    local pid_file="$PID_DIR/${name}.pid"
    
    if is_process_running "$pid_file"; then
        local pid=$(cat "$pid_file")
        log "停止 $name (PID: $pid)..."
        kill "$pid" 2>/dev/null || true
        rm -f "$pid_file"
        success "$name 已停止"
    else
        warning "$name 未运行"
    fi
}

# 显示状态
show_status() {
    echo ""
    echo "=================================="
    echo "📊 监控服务状态"
    echo "=================================="
    
    local services=("service-manager" "quick-monitor" "auto-repair-monitor")
    local running_count=0
    
    for service in "${services[@]}"; do
        local pid_file="$PID_DIR/${service}.pid"
        if is_process_running "$pid_file"; then
            local pid=$(cat "$pid_file")
            success "$service: 运行中 (PID: $pid)"
            running_count=$((running_count + 1))
        else
            warning "$service: 未运行"
        fi
    done
    
    echo "=================================="
    echo "运行状态: $running_count/${#services[@]} 个服务运行中"
    echo "=================================="
}

# 启动所有监控服务
start_all_monitoring() {
    log "🚀 启动所有监控服务..."
    
    # 1. 启动服务管理器 (基础服务)
    start_background_process "service-manager" \
        "$PROJECT_ROOT/scripts/service-manager.sh auto-start"
    
    # 2. 启动快速监控 (30秒间隔)
    start_background_process "quick-monitor" \
        "$PROJECT_ROOT/scripts/quick-monitor.sh monitor 30"
    
    # 3. 启动完整监控 (5分钟间隔)
    start_background_process "auto-repair-monitor" \
        "$PROJECT_ROOT/scripts/auto-repair-monitor.sh monitor --interval 300"
    
    success "所有监控服务启动完成"
    show_status
}

# 停止所有监控服务
stop_all_monitoring() {
    log "🛑 停止所有监控服务..."
    
    local services=("auto-repair-monitor" "quick-monitor" "service-manager")
    
    for service in "${services[@]}"; do
        stop_process "$service"
    done
    
    success "所有监控服务已停止"
}

# 重启所有监控服务
restart_all_monitoring() {
    log "🔄 重启所有监控服务..."
    stop_all_monitoring
    sleep 2
    start_all_monitoring
}

# 显示帮助
show_help() {
    echo "一键监控服务管理脚本"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  start                   启动所有监控服务"
    echo "  stop                    停止所有监控服务"
    echo "  restart                 重启所有监控服务"
    echo "  status                  显示服务状态"
    echo "  logs [服务名]           查看服务日志"
    echo "  check                   快速检查服务状态"
    echo "  help                    显示此帮助信息"
    echo ""
    echo "服务名:"
    echo "  service-manager         服务管理器"
    echo "  quick-monitor           快速监控"
    echo "  auto-repair-monitor     完整监控"
    echo ""
    echo "示例:"
    echo "  $0 start                启动所有监控"
    echo "  $0 status               查看状态"
    echo "  $0 logs quick-monitor   查看快速监控日志"
    echo "  $0 stop                 停止所有监控"
}

# 查看日志
show_logs() {
    local service=$1
    
    if [ -z "$service" ]; then
        echo "可用日志文件:"
        ls -la "$LOG_DIR"/*.log 2>/dev/null || echo "暂无日志文件"
        return
    fi
    
    local log_file="$LOG_DIR/${service}.log"
    if [ -f "$log_file" ]; then
        echo "=== $service 日志 ==="
        tail -f "$log_file"
    else
        error "日志文件不存在: $log_file"
    fi
}

# 快速检查
quick_check() {
    log "🔍 快速检查所有服务..."
    "$PROJECT_ROOT/scripts/quick-monitor.sh" check
}

# 主函数
case "${1:-help}" in
    "start")
        start_all_monitoring
        ;;
    "stop")
        stop_all_monitoring
        ;;
    "restart")
        restart_all_monitoring
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs "$2"
        ;;
    "check")
        quick_check
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        error "未知命令: $1"
        show_help
        exit 1
        ;;
esac 