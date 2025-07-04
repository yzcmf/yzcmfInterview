#!/bin/bash

# 前端管理脚本
# 功能：选择、切换和管理不同的前端项目

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
FRONTENDS_DIR="$PROJECT_ROOT/frontends"
ACTIVE_FRONTEND_FILE="$PROJECT_ROOT/.active-frontend"
FRONTEND_PORT=3000
LOG_DIR="$PROJECT_ROOT/logs"
FRONTEND_LOG="$LOG_DIR/frontend.log"

# 创建日志目录
mkdir -p "$LOG_DIR"

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

# 获取当前激活的前端
get_active_frontend() {
    if [ -f "$ACTIVE_FRONTEND_FILE" ]; then
        cat "$ACTIVE_FRONTEND_FILE"
    else
        echo ""
    fi
}

# 设置激活的前端
set_active_frontend() {
    local frontend=$1
    echo "$frontend" > "$ACTIVE_FRONTEND_FILE"
    success "已设置 $frontend 为激活前端"
}

# 列出所有可用的前端
list_frontends() {
    log "📁 可用的前端项目:"
    echo "=================================="
    
    local active_frontend=$(get_active_frontend)
    local found_frontends=false
    
    if [ -d "$FRONTENDS_DIR" ]; then
        for frontend in "$FRONTENDS_DIR"/*; do
            if [ -d "$frontend" ]; then
                local frontend_name=$(basename "$frontend")
                local package_json="$frontend/package.json"
                
                if [ -f "$package_json" ]; then
                    local display_name=""
                    if [ "$frontend_name" = "$active_frontend" ]; then
                        display_name="${GREEN}➤ $frontend_name (激活)${NC}"
                    else
                        display_name="$frontend_name"
                    fi
                    
                    # 获取项目信息
                    local project_name=$(grep '"name"' "$package_json" | head -1 | sed 's/.*"name": *"\([^"]*\)".*/\1/' 2>/dev/null || echo "未知项目")
                    local version=$(grep '"version"' "$package_json" | head -1 | sed 's/.*"version": *"\([^"]*\)".*/\1/' 2>/dev/null || echo "未知版本")
                    
                    echo -e "$display_name"
                    echo "   项目: $project_name"
                    echo "   版本: $version"
                    echo "   路径: $frontend"
                    
                    # 检查是否已安装依赖
                    if [ -d "$frontend/node_modules" ]; then
                        echo "   ${GREEN}✓ 依赖已安装${NC}"
                    else
                        echo "   ${YELLOW}⚠ 依赖未安装${NC}"
                    fi
                    
                    echo ""
                    found_frontends=true
                fi
            fi
        done
    fi
    
    if [ "$found_frontends" = false ]; then
        warning "未找到任何前端项目"
        echo "请确保在 $FRONTENDS_DIR 目录下有包含 package.json 的前端项目"
    fi
    
    echo "=================================="
}

# 检查前端项目是否有效
validate_frontend() {
    local frontend_path=$1
    local frontend_name=$2
    
    if [ ! -d "$frontend_path" ]; then
        error "前端项目不存在: $frontend_name"
        return 1
    fi
    
    if [ ! -f "$frontend_path/package.json" ]; then
        error "前端项目无效 (缺少 package.json): $frontend_name"
        return 1
    fi
    
    success "前端项目验证通过: $frontend_name"
    return 0
}

# 安装前端依赖
install_frontend_dependencies() {
    local frontend_path=$1
    local frontend_name=$2
    
    log "📦 安装 $frontend_name 的依赖..."
    
    cd "$frontend_path"
    
    # 检查包管理器
    local package_manager="npm"
    if [ -f "pnpm-lock.yaml" ]; then
        package_manager="pnpm"
    elif [ -f "yarn.lock" ]; then
        package_manager="yarn"
    fi
    
    log "使用包管理器: $package_manager"
    
    case $package_manager in
        "pnpm")
            if ! command -v pnpm >/dev/null 2>&1; then
                warning "pnpm 未安装，正在安装..."
                npm install -g pnpm
            fi
            pnpm install
            ;;
        "yarn")
            if ! command -v yarn >/dev/null 2>&1; then
                warning "yarn 未安装，正在安装..."
                npm install -g yarn
            fi
            yarn install
            ;;
        *)
            npm install
            ;;
    esac
    
    cd "$PROJECT_ROOT"
    success "$frontend_name 依赖安装完成"
}

# 启动前端服务
start_frontend() {
    local frontend_name=$1
    
    if [ -z "$frontend_name" ]; then
        frontend_name=$(get_active_frontend)
        if [ -z "$frontend_name" ]; then
            error "未设置激活的前端，请先选择一个前端项目"
            return 1
        fi
    fi
    
    local frontend_path="$FRONTENDS_DIR/$frontend_name"
    
    if ! validate_frontend "$frontend_path" "$frontend_name"; then
        return 1
    fi
    
    # 检查端口是否被占用
    if lsof -i :$FRONTEND_PORT >/dev/null 2>&1; then
        local pid=$(lsof -ti :$FRONTEND_PORT)
        warning "端口 $FRONTEND_PORT 已被占用 (PID: $pid)"
        read -p "是否停止现有进程并启动新的前端服务? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kill $pid
            sleep 2
        else
            return 1
        fi
    fi
    
    log "🚀 启动前端服务: $frontend_name"
    
    # 安装依赖（如果需要）
    if [ ! -d "$frontend_path/node_modules" ]; then
        install_frontend_dependencies "$frontend_path" "$frontend_name"
    fi
    
    # 启动服务
    cd "$frontend_path"
    
    # 检查启动脚本
    local start_script=""
    if grep -q '"dev"' package.json; then
        start_script="dev"
    elif grep -q '"start"' package.json; then
        start_script="start"
    else
        error "未找到启动脚本 (dev 或 start)"
        return 1
    fi
    
    # 确定包管理器
    local package_manager="npm"
    if [ -f "pnpm-lock.yaml" ]; then
        package_manager="pnpm"
    elif [ -f "yarn.lock" ]; then
        package_manager="yarn"
    fi
    
    log "使用命令: $package_manager run $start_script"
    
    # 启动服务
    nohup $package_manager run $start_script > "$FRONTEND_LOG" 2>&1 &
    local frontend_pid=$!
    
    # 等待服务启动
    log "等待前端服务启动..."
    for i in {1..30}; do
        if lsof -i :$FRONTEND_PORT >/dev/null 2>&1; then
            success "前端服务启动成功 (PID: $frontend_pid, 端口: $FRONTEND_PORT)"
            echo "访问地址: http://localhost:$FRONTEND_PORT"
            return 0
        fi
        sleep 1
    done
    
    error "前端服务启动超时"
    return 1
}

# 停止前端服务
stop_frontend() {
    log "🛑 停止前端服务..."
    
    local pids=$(lsof -ti :$FRONTEND_PORT 2>/dev/null || true)
    if [ -n "$pids" ]; then
        log "停止前端服务 (PID: $pids)..."
        kill $pids
        sleep 2
        success "前端服务已停止"
    else
        warning "前端服务未运行"
    fi
}

# 重启前端服务
restart_frontend() {
    log "🔄 重启前端服务..."
    stop_frontend
    sleep 2
    start_frontend
}

# 切换前端
switch_frontend() {
    local frontend_name=$1
    
    if [ -z "$frontend_name" ]; then
        error "请指定要切换到的前端项目"
        return 1
    fi
    
    local frontend_path="$FRONTENDS_DIR/$frontend_name"
    
    if ! validate_frontend "$frontend_path" "$frontend_name"; then
        return 1
    fi
    
    # 停止当前前端服务
    stop_frontend
    
    # 设置新的激活前端
    set_active_frontend "$frontend_name"
    
    # 启动新的前端服务
    start_frontend "$frontend_name"
}

# 交互式选择前端
interactive_select() {
    log "🎯 交互式选择前端项目..."
    
    # 获取所有前端项目
    local frontends=()
    local active_frontend=$(get_active_frontend)
    
    if [ -d "$FRONTENDS_DIR" ]; then
        for frontend in "$FRONTENDS_DIR"/*; do
            if [ -d "$frontend" ] && [ -f "$frontend/package.json" ]; then
                frontends+=("$(basename "$frontend")")
            fi
        done
    fi
    
    if [ ${#frontends[@]} -eq 0 ]; then
        error "未找到任何前端项目"
        return 1
    fi
    
    echo "请选择前端项目:"
    echo "=================================="
    
    for i in "${!frontends[@]}"; do
        local frontend="${frontends[$i]}"
        local display_name="$((i+1)). $frontend"
        
        if [ "$frontend" = "$active_frontend" ]; then
            display_name="$display_name ${GREEN}(当前激活)${NC}"
        fi
        
        echo -e "$display_name"
    done
    
    echo "0. 取消"
    echo "=================================="
    
    read -p "请输入选择 (0-${#frontends[@]}): " -r choice
    
    if [ "$choice" = "0" ]; then
        info "操作已取消"
        return 0
    fi
    
    if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le ${#frontends[@]} ]; then
        local selected_frontend="${frontends[$((choice-1))]}"
        log "已选择: $selected_frontend"
        
        read -p "是否要切换到 $selected_frontend? (y/N): " -r confirm
        if [[ $confirm =~ ^[Yy]$ ]]; then
            switch_frontend "$selected_frontend"
        else
            info "操作已取消"
        fi
    else
        error "无效的选择"
        return 1
    fi
}

# 检查前端状态
check_frontend_status() {
    local frontend_name=$(get_active_frontend)
    
    log "🔍 检查前端状态..."
    echo "=================================="
    
    if [ -n "$frontend_name" ]; then
        echo "激活的前端: $frontend_name"
        local frontend_path="$FRONTENDS_DIR/$frontend_name"
        
        if [ -d "$frontend_path" ]; then
            echo "路径: $frontend_path"
            
            # 检查依赖
            if [ -d "$frontend_path/node_modules" ]; then
                echo "依赖状态: ${GREEN}已安装${NC}"
            else
                echo "依赖状态: ${YELLOW}未安装${NC}"
            fi
            
            # 检查服务状态
            if lsof -i :$FRONTEND_PORT >/dev/null 2>&1; then
                local pid=$(lsof -ti :$FRONTEND_PORT)
                echo "服务状态: ${GREEN}运行中 (PID: $pid)${NC}"
                echo "访问地址: http://localhost:$FRONTEND_PORT"
            else
                echo "服务状态: ${YELLOW}未运行${NC}"
            fi
        else
            echo "状态: ${RED}项目不存在${NC}"
        fi
    else
        echo "激活的前端: ${YELLOW}未设置${NC}"
    fi
    
    echo "=================================="
}

# 显示前端日志
show_frontend_logs() {
    if [ -f "$FRONTEND_LOG" ]; then
        echo "=== 前端服务日志 ==="
        tail -f "$FRONTEND_LOG"
    else
        error "前端日志文件不存在"
    fi
}

# 创建新的前端项目
create_frontend() {
    local frontend_name=$1
    
    if [ -z "$frontend_name" ]; then
        read -p "请输入新前端项目名称: " -r frontend_name
        if [ -z "$frontend_name" ]; then
            error "项目名称不能为空"
            return 1
        fi
    fi
    
    local frontend_path="$FRONTENDS_DIR/$frontend_name"
    
    if [ -d "$frontend_path" ]; then
        error "前端项目已存在: $frontend_name"
        return 1
    fi
    
    log "📁 创建新的前端项目: $frontend_name"
    
    # 创建项目目录
    mkdir -p "$frontend_path"
    
    # 选择项目模板
    echo "请选择项目模板:"
    echo "1. Next.js (推荐)"
    echo "2. React (Vite)"
    echo "3. Vue (Vite)"
    echo "4. 空白项目"
    
    read -p "请选择模板 (1-4): " -r template_choice
    
    case $template_choice in
        "1")
            log "使用 Next.js 模板..."
            cd "$FRONTENDS_DIR"
            npx create-next-app@latest "$frontend_name" --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
            ;;
        "2")
            log "使用 React + Vite 模板..."
            cd "$FRONTENDS_DIR"
            npm create vite@latest "$frontend_name" -- --template react-ts
            ;;
        "3")
            log "使用 Vue + Vite 模板..."
            cd "$FRONTENDS_DIR"
            npm create vite@latest "$frontend_name" -- --template vue-ts
            ;;
        "4")
            log "创建空白项目..."
            cd "$frontend_path"
            npm init -y
            echo '{
  "name": "'$frontend_name'",
  "version": "1.0.0",
  "description": "Frontend project",
  "scripts": {
    "dev": "echo \"Please configure your dev script\"",
    "build": "echo \"Please configure your build script\"",
    "start": "echo \"Please configure your start script\""
  }
}' > package.json
            ;;
        *)
            error "无效的选择"
            return 1
            ;;
    esac
    
    cd "$PROJECT_ROOT"
    success "前端项目创建完成: $frontend_name"
    
    read -p "是否要设置为激活前端并启动? (y/N): " -r start_now
    if [[ $start_now =~ ^[Yy]$ ]]; then
        switch_frontend "$frontend_name"
    fi
}

# 删除前端项目
delete_frontend() {
    local frontend_name=$1
    
    if [ -z "$frontend_name" ]; then
        error "请指定要删除的前端项目"
        return 1
    fi
    
    local frontend_path="$FRONTENDS_DIR/$frontend_name"
    
    if [ ! -d "$frontend_path" ]; then
        error "前端项目不存在: $frontend_name"
        return 1
    fi
    
    # 检查是否为当前激活的前端
    local active_frontend=$(get_active_frontend)
    if [ "$frontend_name" = "$active_frontend" ]; then
        warning "正在删除当前激活的前端项目"
        stop_frontend
        rm -f "$ACTIVE_FRONTEND_FILE"
    fi
    
    read -p "确定要删除前端项目 '$frontend_name' 吗? 此操作不可恢复! (y/N): " -r confirm
    if [[ $confirm =~ ^[Yy]$ ]]; then
        log "🗑️ 删除前端项目: $frontend_name"
        rm -rf "$frontend_path"
        success "前端项目已删除: $frontend_name"
    else
        info "操作已取消"
    fi
}

# 显示帮助信息
show_help() {
    echo "前端管理脚本"
    echo ""
    echo "用法: $0 [命令] [参数]"
    echo ""
    echo "命令:"
    echo "  list                    列出所有前端项目"
    echo "  select                  交互式选择前端项目"
    echo "  switch <name>           切换到指定前端项目"
    echo "  start [name]            启动前端服务"
    echo "  stop                    停止前端服务"
    echo "  restart                 重启前端服务"
    echo "  status                  检查前端状态"
    echo "  logs                    显示前端日志"
    echo "  create [name]           创建新的前端项目"
    echo "  delete <name>           删除前端项目"
    echo "  install <name>          安装前端依赖"
    echo "  help                    显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 list                 列出所有前端项目"
    echo "  $0 select               交互式选择前端"
    echo "  $0 switch frontend1     切换到 frontend1"
    echo "  $0 start                启动当前激活的前端"
    echo "  $0 start frontend1      启动指定的前端"
    echo "  $0 create my-frontend   创建新的前端项目"
    echo "  $0 delete old-frontend  删除前端项目"
    echo ""
    echo "特性:"
    echo "  ✨ 支持多种包管理器 (npm, yarn, pnpm)"
    echo "  ✨ 自动依赖安装和检测"
    echo "  ✨ 项目模板选择 (Next.js, React, Vue)"
    echo "  ✨ 端口冲突检测和解决"
    echo "  ✨ 日志管理和监控"
}

# 主函数
main() {
    local command=$1
    local param=$2
    
    case $command in
        "list")
            list_frontends
            ;;
        "select")
            interactive_select
            ;;
        "switch")
            switch_frontend "$param"
            ;;
        "start")
            start_frontend "$param"
            ;;
        "stop")
            stop_frontend
            ;;
        "restart")
            restart_frontend
            ;;
        "status")
            check_frontend_status
            ;;
        "logs")
            show_frontend_logs
            ;;
        "create")
            create_frontend "$param"
            ;;
        "delete")
            delete_frontend "$param"
            ;;
        "install")
            if [ -n "$param" ]; then
                local frontend_path="$FRONTENDS_DIR/$param"
                if validate_frontend "$frontend_path" "$param"; then
                    install_frontend_dependencies "$frontend_path" "$param"
                fi
            else
                local active_frontend=$(get_active_frontend)
                if [ -n "$active_frontend" ]; then
                    local frontend_path="$FRONTENDS_DIR/$active_frontend"
                    install_frontend_dependencies "$frontend_path" "$active_frontend"
                else
                    error "未设置激活的前端，请先选择一个前端项目"
                fi
            fi
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