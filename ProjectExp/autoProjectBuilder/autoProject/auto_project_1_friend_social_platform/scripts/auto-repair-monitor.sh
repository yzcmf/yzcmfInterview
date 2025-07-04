#!/bin/bash

# 智能服务监控和自动修复脚本
# 功能：定期检查服务状态，自动修复问题，生成修复报告

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
SERVICE_MANAGER="$PROJECT_ROOT/scripts/service-manager.sh"
FRONTEND_MANAGER="$PROJECT_ROOT/scripts/frontend-manager.sh"

# 端口配置
BACKEND_PORT=8000
AI_SERVICE_PORT=8001
POSTGRES_PORT=5432
REDIS_PORT=6379
FRONTEND_PORT=3000

# 日志和报告目录
LOG_DIR="$PROJECT_ROOT/logs"
REPORT_DIR="$PROJECT_ROOT/reports"
MONITOR_LOG="$LOG_DIR/auto-repair-monitor.log"
REPAIR_REPORT="$REPORT_DIR/repair-report-$(date +%Y%m%d-%H%M%S).json"

# 创建必要的目录
mkdir -p "$LOG_DIR" "$REPORT_DIR"

# 监控配置
CHECK_INTERVAL=${CHECK_INTERVAL:-300}  # 默认5分钟检查一次
MAX_REPAIR_ATTEMPTS=${MAX_REPAIR_ATTEMPTS:-3}  # 最大修复尝试次数
ENABLE_NOTIFICATIONS=${ENABLE_NOTIFICATIONS:-true}  # 是否启用通知

# 服务状态跟踪
declare -A SERVICE_STATUS
declare -A REPAIR_ATTEMPTS
declare -A REPAIR_HISTORY

# 日志函数
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date +'%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[$timestamp]${NC} [$level] $message" | tee -a "$MONITOR_LOG"
}

info() {
    log "INFO" "$1"
}

success() {
    log "SUCCESS" "${GREEN}✅ $1${NC}"
}

warning() {
    log "WARNING" "${YELLOW}⚠️  $1${NC}"
}

error() {
    log "ERROR" "${RED}❌ $1${NC}"
}

# 检查端口是否被占用
check_port() {
    local port=$1
    local service_name=$2
    
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
        if curl -s --max-time 5 "$url/health" >/dev/null 2>&1; then
            return 0
        else
            return 1
        fi
    else
        return 1
    fi
}

# 获取服务状态
get_service_status() {
    local service=$1
    local port=""
    local health_url=""
    
    case $service in
        "backend")
            port=$BACKEND_PORT
            health_url="http://localhost:$port/health"
            ;;
        "ai")
            port=$AI_SERVICE_PORT
            health_url="http://localhost:$port/health"
            ;;
        "redis")
            port=$REDIS_PORT
            ;;
        "postgres")
            port=$POSTGRES_PORT
            ;;
        "frontend")
            port=$FRONTEND_PORT
            ;;
        *)
            return 1
            ;;
    esac
    
    # 检查端口
    if ! check_port $port $service; then
        echo "stopped"
        return
    fi
    
    # 检查健康状态（如果有健康检查URL）
    if [ -n "$health_url" ]; then
        if check_service_health "$health_url" "$service"; then
            echo "healthy"
        else
            echo "unhealthy"
        fi
    else
        echo "running"
    fi
}

# 自动修复服务
auto_repair_service() {
    local service=$1
    local current_status=$2
    
    # 检查修复尝试次数
    local attempts=${REPAIR_ATTEMPTS[$service]:-0}
    if [ $attempts -ge $MAX_REPAIR_ATTEMPTS ]; then
        warning "服务 $service 已达到最大修复尝试次数 ($MAX_REPAIR_ATTEMPTS)"
        return 1
    fi
    
    info "尝试修复服务: $service (状态: $current_status, 尝试次数: $((attempts + 1)))"
    
    # 记录修复尝试
    REPAIR_ATTEMPTS[$service]=$((attempts + 1))
    
    # 执行修复
    local repair_result=""
    case $service in
        "backend")
            if [ "$current_status" = "stopped" ] || [ "$current_status" = "unhealthy" ]; then
                if "$SERVICE_MANAGER" restart backend >/dev/null 2>&1; then
                    repair_result="success"
                else
                    repair_result="failed"
                fi
            fi
            ;;
        "ai")
            if [ "$current_status" = "stopped" ] || [ "$current_status" = "unhealthy" ]; then
                if "$SERVICE_MANAGER" restart ai >/dev/null 2>&1; then
                    repair_result="success"
                else
                    repair_result="failed"
                fi
            fi
            ;;
        "redis")
            if [ "$current_status" = "stopped" ]; then
                if "$SERVICE_MANAGER" start redis >/dev/null 2>&1; then
                    repair_result="success"
                else
                    repair_result="failed"
                fi
            fi
            ;;
        "postgres")
            if [ "$current_status" = "stopped" ]; then
                if "$SERVICE_MANAGER" start postgres >/dev/null 2>&1; then
                    repair_result="success"
                else
                    repair_result="failed"
                fi
            fi
            ;;
        "frontend")
            if [ "$current_status" = "stopped" ]; then
                if [ -f "$FRONTEND_MANAGER" ]; then
                    if "$FRONTEND_MANAGER" start >/dev/null 2>&1; then
                        repair_result="success"
                    else
                        repair_result="failed"
                    fi
                else
                    repair_result="no_manager"
                fi
            fi
            ;;
    esac
    
    # 记录修复结果
    if [ -n "$repair_result" ]; then
        REPAIR_HISTORY[$service]="${REPAIR_HISTORY[$service]}$(date +%Y%m%d-%H%M%S):$repair_result;"
        
        if [ "$repair_result" = "success" ]; then
            success "服务 $service 修复成功"
            return 0
        elif [ "$repair_result" = "no_manager" ]; then
            warning "服务 $service 缺少管理器，跳过修复"
            return 1
        else
            error "服务 $service 修复失败"
            return 1
        fi
    fi
    
    return 1
}

# 检查所有服务
check_all_services() {
    info "🔍 检查所有服务状态..."
    
    local services=("backend" "ai" "redis" "postgres" "frontend")
    local total_services=${#services[@]}
    local healthy_count=0
    local needs_repair=()
    
    for service in "${services[@]}"; do
        local status=$(get_service_status "$service")
        SERVICE_STATUS[$service]=$status
        
        case $status in
            "healthy"|"running")
                success "✅ $service: $status"
                healthy_count=$((healthy_count + 1))
                ;;
            "unhealthy"|"stopped")
                warning "⚠️  $service: $status"
                needs_repair+=("$service")
                ;;
            *)
                error "❌ $service: 未知状态"
                needs_repair+=("$service")
                ;;
        esac
    done
    
    info "服务健康度: $healthy_count/$total_services"
    
    # 返回需要修复的服务列表
    echo "${needs_repair[@]}"
}

# 批量修复服务
batch_repair_services() {
    local services_to_repair=("$@")
    
    if [ ${#services_to_repair[@]} -eq 0 ]; then
        info "🎉 所有服务运行正常，无需修复"
        return 0
    fi
    
    info "🔧 开始批量修复 ${#services_to_repair[@]} 个服务..."
    
    local repaired_count=0
    local failed_services=()
    
    for service in "${services_to_repair[@]}"; do
        local status=${SERVICE_STATUS[$service]}
        
        # 并行修复（后台执行）
        (
            if auto_repair_service "$service" "$status"; then
                echo "SUCCESS:$service"
            else
                echo "FAILED:$service"
            fi
        ) &
    done
    
    # 等待所有修复完成
    wait
    
    # 统计结果
    for service in "${services_to_repair[@]}"; do
        local attempts=${REPAIR_ATTEMPTS[$service]:-0}
        if [ $attempts -lt $MAX_REPAIR_ATTEMPTS ]; then
            # 检查修复后的状态
            local new_status=$(get_service_status "$service")
            if [ "$new_status" = "healthy" ] || [ "$new_status" = "running" ]; then
                repaired_count=$((repaired_count + 1))
            else
                failed_services+=("$service")
            fi
        else
            failed_services+=("$service")
        fi
    done
    
    # 输出修复结果
    if [ $repaired_count -gt 0 ]; then
        success "成功修复 $repaired_count 个服务"
    fi
    
    if [ ${#failed_services[@]} -gt 0 ]; then
        warning "修复失败的服务: ${failed_services[*]}"
    fi
    
    return ${#failed_services[@]}
}

# 生成修复报告
generate_repair_report() {
    local timestamp=$(date +%Y-%m-%d\ %H:%M:%S)
    local report_data=""
    
    # 构建JSON报告
    report_data='{
        "timestamp": "'$timestamp'",
        "summary": {
            "total_services": 5,
            "healthy_services": 0,
            "repaired_services": 0,
            "failed_services": 0
        },
        "services": {},
        "repair_history": {},
        "recommendations": []
    }'
    
    # 统计服务状态
    local healthy_count=0
    local repaired_count=0
    local failed_count=0
    
    local services=("backend" "ai" "redis" "postgres" "frontend")
    for service in "${services[@]}"; do
        local status=${SERVICE_STATUS[$service]}
        local attempts=${REPAIR_ATTEMPTS[$service]:-0}
        local history=${REPAIR_HISTORY[$service]:-""}
        
        case $status in
            "healthy"|"running")
                healthy_count=$((healthy_count + 1))
                ;;
            *)
                failed_count=$((failed_count + 1))
                if [ $attempts -gt 0 ]; then
                    repaired_count=$((repaired_count + 1))
                fi
                ;;
        esac
        
        # 添加服务详情到报告
        report_data=$(echo "$report_data" | jq --arg service "$service" \
            --arg status "$status" \
            --arg attempts "$attempts" \
            --arg history "$history" \
            '.services[$service] = {"status": $status, "repair_attempts": $attempts, "repair_history": $history}')
    done
    
    # 更新摘要
    report_data=$(echo "$report_data" | jq \
        --arg healthy "$healthy_count" \
        --arg repaired "$repaired_count" \
        --arg failed "$failed_count" \
        '.summary.healthy_services = ($healthy | tonumber) | .summary.repaired_services = ($repaired | tonumber) | .summary.failed_services = ($failed | tonumber)')
    
    # 添加建议
    local recommendations=()
    if [ $failed_count -gt 0 ]; then
        recommendations+=("检查失败服务的日志文件")
        recommendations+=("验证依赖服务是否正常运行")
        recommendations+=("检查网络连接和端口占用")
    fi
    
    if [ $repaired_count -gt 0 ]; then
        recommendations+=("监控修复后的服务稳定性")
    fi
    
    for rec in "${recommendations[@]}"; do
        report_data=$(echo "$report_data" | jq --arg rec "$rec" '.recommendations += [$rec]')
    done
    
    # 保存报告
    echo "$report_data" > "$REPAIR_REPORT"
    info "📊 修复报告已生成: $REPAIR_REPORT"
    
    # 输出摘要
    echo ""
    echo "=================================="
    echo "📋 修复报告摘要"
    echo "=================================="
    echo "检查时间: $timestamp"
    echo "总服务数: 5"
    echo "健康服务: $healthy_count"
    echo "修复服务: $repaired_count"
    echo "失败服务: $failed_count"
    echo "=================================="
    
    if [ $failed_count -gt 0 ]; then
        echo ""
        echo "🔧 建议操作:"
        for rec in "${recommendations[@]}"; do
            echo "  • $rec"
        done
    fi
}

# 发送通知（如果启用）
send_notification() {
    if [ "$ENABLE_NOTIFICATIONS" = "true" ]; then
        local message="$1"
        local level="$2"
        
        # macOS 通知
        if command -v osascript >/dev/null 2>&1; then
            osascript -e "display notification \"$message\" with title \"服务监控\""
        fi
        
        # 系统日志
        logger -t "auto-repair-monitor" "$level: $message"
    fi
}

# 单次检查修复
single_check_and_repair() {
    info "🚀 开始单次检查和修复..."
    
    # 检查所有服务
    local services_to_repair=($(check_all_services))
    
    # 批量修复
    local failed_count=0
    if [ ${#services_to_repair[@]} -gt 0 ]; then
        batch_repair_services "${services_to_repair[@]}"
        failed_count=$?
    fi
    
    # 生成报告
    generate_repair_report
    
    # 发送通知
    if [ $failed_count -gt 0 ]; then
        send_notification "检测到 $failed_count 个服务需要手动修复" "warning"
    else
        send_notification "所有服务运行正常" "info"
    fi
    
    return $failed_count
}

# 持续监控模式
continuous_monitor() {
    info "🔄 启动持续监控模式 (检查间隔: ${CHECK_INTERVAL}秒)"
    info "按 Ctrl+C 停止监控"
    
    # 设置信号处理
    trap 'echo ""; info "收到停止信号，正在退出..."; exit 0' INT TERM
    
    local cycle_count=0
    
    while true; do
        cycle_count=$((cycle_count + 1))
        info "=== 监控周期 #$cycle_count ==="
        
        # 执行检查和修复
        single_check_and_repair
        
        # 等待下次检查
        if [ $cycle_count -lt 999999 ]; then  # 防止无限循环
            info "⏰ 等待 ${CHECK_INTERVAL} 秒后进行下次检查..."
            sleep $CHECK_INTERVAL
        else
            break
        fi
    done
}

# 清理旧报告
cleanup_old_reports() {
    local max_reports=${MAX_REPORTS:-10}
    local current_reports=$(ls -t "$REPORT_DIR"/repair-report-*.json 2>/dev/null | wc -l)
    
    if [ $current_reports -gt $max_reports ]; then
        info "🧹 清理旧报告文件..."
        ls -t "$REPORT_DIR"/repair-report-*.json 2>/dev/null | tail -n +$((max_reports + 1)) | xargs rm -f
    fi
}

# 显示帮助信息
show_help() {
    echo "智能服务监控和自动修复脚本"
    echo ""
    echo "用法: $0 [命令] [选项]"
    echo ""
    echo "命令:"
    echo "  check                   执行单次检查和修复"
    echo "  monitor                 启动持续监控模式"
    echo "  report                  生成当前状态报告"
    echo "  cleanup                 清理旧报告文件"
    echo "  help                    显示此帮助信息"
    echo ""
    echo "选项:"
    echo "  --interval SECONDS      设置检查间隔（默认: 300秒）"
    echo "  --max-attempts NUM      设置最大修复尝试次数（默认: 3）"
    echo "  --no-notifications      禁用通知"
    echo "  --max-reports NUM       设置保留的最大报告数（默认: 10）"
    echo ""
    echo "环境变量:"
    echo "  CHECK_INTERVAL          检查间隔（秒）"
    echo "  MAX_REPAIR_ATTEMPTS     最大修复尝试次数"
    echo "  ENABLE_NOTIFICATIONS    是否启用通知 (true/false)"
    echo "  MAX_REPORTS             保留的最大报告数"
    echo ""
    echo "示例:"
    echo "  $0 check                执行单次检查"
    echo "  $0 monitor              启动持续监控"
    echo "  $0 monitor --interval 60 --max-attempts 5"
    echo "  $0 report               生成状态报告"
    echo "  $0 cleanup              清理旧报告"
    echo ""
    echo "特性:"
    echo "  ✨ 智能检测服务状态"
    echo "  🔧 自动修复常见问题"
    echo "  📊 生成详细修复报告"
    echo "  🔄 支持持续监控模式"
    echo "  📱 系统通知支持"
    echo "  🧹 自动清理旧报告"
    echo "  ⚡ 并行修复，提高效率"
}

# 解析命令行参数
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --interval)
                CHECK_INTERVAL="$2"
                shift 2
                ;;
            --max-attempts)
                MAX_REPAIR_ATTEMPTS="$2"
                shift 2
                ;;
            --no-notifications)
                ENABLE_NOTIFICATIONS="false"
                shift
                ;;
            --max-reports)
                MAX_REPORTS="$2"
                shift 2
                ;;
            *)
                break
                ;;
        esac
    done
}

# 主函数
main() {
    local command=$1
    shift
    
    # 解析参数
    parse_args "$@"
    
    # 检查依赖
    if ! command -v jq >/dev/null 2>&1; then
        error "需要安装 jq 来处理JSON报告"
        info "安装命令: brew install jq (macOS) 或 apt-get install jq (Ubuntu)"
        exit 1
    fi
    
    case $command in
        "check")
            single_check_and_repair
            ;;
        "monitor")
            continuous_monitor
            ;;
        "report")
            check_all_services >/dev/null
            generate_repair_report
            ;;
        "cleanup")
            cleanup_old_reports
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        "")
            show_help
            ;;
        *)
            error "未知命令: $command"
            show_help
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"
