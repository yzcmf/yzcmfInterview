#!/bin/bash

# 监控系统演示脚本
# 展示智能服务监控和自动修复功能

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# 配置
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

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

# 显示标题
show_title() {
    echo ""
    echo "=================================="
    echo "🚀 智能服务监控和自动修复系统演示"
    echo "=================================="
    echo ""
}

# 演示1: 快速检查
demo_quick_check() {
    echo "📋 演示1: 快速服务检查"
    echo "----------------------------------"
    log "执行快速检查..."
    ./scripts/quick-monitor.sh check
    echo ""
}

# 演示2: 持续监控
demo_continuous_monitor() {
    echo "📋 演示2: 持续监控 (10秒)"
    echo "----------------------------------"
    log "启动持续监控 (10秒后自动停止)..."
    timeout 10s ./scripts/quick-monitor.sh monitor 2 || true
    echo ""
}

# 演示3: 完整功能监控
demo_full_monitor() {
    echo "📋 演示3: 完整功能监控"
    echo "----------------------------------"
    log "执行完整功能检查..."
    ./scripts/auto-repair-monitor.sh check
    echo ""
}

# 演示4: 一键启动
demo_one_click() {
    echo "📋 演示4: 一键启动监控服务"
    echo "----------------------------------"
    log "检查当前状态..."
    ./scripts/start-monitoring.sh status
    echo ""
    
    log "启动所有监控服务..."
    ./scripts/start-monitoring.sh start
    echo ""
    
    log "再次检查状态..."
    ./scripts/start-monitoring.sh status
    echo ""
    
    log "停止所有监控服务..."
    ./scripts/start-monitoring.sh stop
    echo ""
}

# 演示5: 故障模拟
demo_fault_simulation() {
    echo "📋 演示5: 故障模拟和修复"
    echo "----------------------------------"
    log "模拟服务故障..."
    
    # 检查当前状态
    log "当前服务状态:"
    ./scripts/quick-monitor.sh check
    echo ""
    
    # 模拟停止某个服务
    log "模拟停止后端服务..."
    pkill -f "node.*8000" || true
    sleep 2
    
    log "检查故障状态:"
    ./scripts/quick-monitor.sh check
    echo ""
    
    # 自动修复
    log "执行自动修复..."
    ./scripts/quick-monitor.sh check
    echo ""
}

# 演示6: 报告生成
demo_report_generation() {
    echo "📋 演示6: 报告生成"
    echo "----------------------------------"
    log "生成详细报告..."
    ./scripts/auto-repair-monitor.sh report
    echo ""
    
    # 显示报告文件
    if [ -d "$PROJECT_ROOT/reports" ]; then
        log "报告文件列表:"
        ls -la "$PROJECT_ROOT/reports"/*.json 2>/dev/null || echo "暂无报告文件"
        echo ""
    fi
}

# 演示7: 系统集成
demo_system_integration() {
    echo "📋 演示7: 系统集成功能"
    echo "----------------------------------"
    
    log "显示帮助信息:"
    ./scripts/quick-monitor.sh help
    echo ""
    
    log "显示完整功能帮助:"
    ./scripts/auto-repair-monitor.sh help | head -20
    echo "..."
    echo ""
    
    log "显示一键启动帮助:"
    ./scripts/start-monitoring.sh help
    echo ""
}

# 显示功能总结
show_summary() {
    echo "📋 功能总结"
    echo "----------------------------------"
    echo "✅ 智能检测: 端口检查、健康检查、状态分类"
    echo "✅ 自动修复: 并行修复、智能重试、失败识别"
    echo "✅ 详细报告: JSON格式、健康统计、修复建议"
    echo "✅ 持续监控: 可配置间隔、后台运行、优雅停止"
    echo "✅ 系统集成: 一键启动、状态管理、日志查看"
    echo "✅ 易于使用: 简单命令、清晰输出、完整文档"
    echo ""
}

# 显示使用建议
show_recommendations() {
    echo "💡 使用建议"
    echo "----------------------------------"
    echo "🏠 开发环境:"
    echo "  • 使用: ./scripts/quick-monitor.sh monitor 30"
    echo "  • 特点: 快速检查，实时反馈"
    echo ""
    echo "🏭 生产环境:"
    echo "  • 使用: ./scripts/start-monitoring.sh start"
    echo "  • 特点: 完整监控，详细报告"
    echo ""
    echo "🔍 故障排查:"
    echo "  • 使用: ./scripts/auto-repair-monitor.sh check"
    echo "  • 特点: 深度分析，修复建议"
    echo ""
}

# 主演示函数
main_demo() {
    show_title
    
    # 检查脚本是否存在
    if [ ! -f "$PROJECT_ROOT/scripts/quick-monitor.sh" ]; then
        error "监控脚本不存在，请先创建脚本"
        exit 1
    fi
    
    # 执行演示
    demo_quick_check
    demo_full_monitor
    demo_one_click
    demo_report_generation
    demo_system_integration
    
    # 询问是否进行故障模拟
    echo "是否进行故障模拟演示? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        demo_fault_simulation
    fi
    
    # 询问是否进行持续监控演示
    echo "是否进行持续监控演示? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        demo_continuous_monitor
    fi
    
    show_summary
    show_recommendations
    
    echo "🎉 演示完成！"
    echo ""
    echo "📚 更多信息请查看:"
    echo "  • 使用指南: scripts/USAGE-GUIDE.md"
    echo "  • 详细文档: scripts/README-auto-repair.md"
    echo "  • 帮助信息: ./scripts/quick-monitor.sh help"
    echo ""
}

# 显示帮助
show_help() {
    echo "监控系统演示脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  --quick-check            只演示快速检查"
    echo "  --full-monitor           只演示完整监控"
    echo "  --one-click              只演示一键启动"
    echo "  --fault-simulation       只演示故障模拟"
    echo "  --help                   显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0                      完整演示"
    echo "  $0 --quick-check        快速检查演示"
    echo "  $0 --fault-simulation   故障模拟演示"
}

# 解析命令行参数
case "${1:-}" in
    "--quick-check")
        show_title
        demo_quick_check
        ;;
    "--full-monitor")
        show_title
        demo_full_monitor
        ;;
    "--one-click")
        show_title
        demo_one_click
        ;;
    "--fault-simulation")
        show_title
        demo_fault_simulation
        ;;
    "--help"|"-h"|"help")
        show_help
        ;;
    "")
        main_demo
        ;;
    *)
        error "未知选项: $1"
        show_help
        exit 1
        ;;
esac 