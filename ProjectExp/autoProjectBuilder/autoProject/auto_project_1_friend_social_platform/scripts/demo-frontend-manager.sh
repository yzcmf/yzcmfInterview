#!/bin/bash

# 前端管理器演示脚本
# 展示如何使用前端管理器

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_MANAGER="$PROJECT_ROOT/scripts/frontend-manager.sh"

echo -e "${BLUE}🚀 前端管理器演示${NC}"
echo "=================================="
echo ""

# 检查前端管理器是否存在
if [ ! -f "$FRONTEND_MANAGER" ]; then
    echo -e "${YELLOW}❌ 前端管理器未找到: $FRONTEND_MANAGER${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 前端管理器已找到${NC}"
echo ""

# 1. 列出所有前端项目
echo -e "${BLUE}📋 步骤 1: 列出所有前端项目${NC}"
echo "命令: $FRONTEND_MANAGER list"
echo "----------------------------------"
"$FRONTEND_MANAGER" list
echo ""

# 2. 检查当前状态
echo -e "${BLUE}🔍 步骤 2: 检查当前前端状态${NC}"
echo "命令: $FRONTEND_MANAGER status"
echo "----------------------------------"
"$FRONTEND_MANAGER" status
echo ""

# 3. 显示帮助信息
echo -e "${BLUE}❓ 步骤 3: 显示帮助信息${NC}"
echo "命令: $FRONTEND_MANAGER help"
echo "----------------------------------"
echo "可用命令:"
"$FRONTEND_MANAGER" help | grep -A 20 "命令:" | head -n 15
echo ""

# 4. 演示通过服务管理器使用
echo -e "${BLUE}🔧 步骤 4: 通过服务管理器使用前端管理器${NC}"
echo "命令: ./scripts/service-manager.sh frontend list"
echo "----------------------------------"
if [ -f "$PROJECT_ROOT/scripts/service-manager.sh" ]; then
    "$PROJECT_ROOT/scripts/service-manager.sh" frontend list
else
    echo -e "${YELLOW}⚠️  服务管理器未找到${NC}"
fi
echo ""

# 5. 显示项目结构
echo -e "${BLUE}📁 步骤 5: 显示前端项目结构${NC}"
echo "----------------------------------"
if [ -d "$PROJECT_ROOT/frontends" ]; then
    echo "前端项目目录结构:"
    tree "$PROJECT_ROOT/frontends" -L 2 2>/dev/null || ls -la "$PROJECT_ROOT/frontends"
else
    echo -e "${YELLOW}⚠️  frontends 目录不存在${NC}"
fi
echo ""

# 6. 使用建议
echo -e "${BLUE}💡 使用建议${NC}"
echo "=================================="
echo "1. 首次使用:"
echo "   $FRONTEND_MANAGER select    # 交互式选择前端"
echo ""
echo "2. 创建新项目:"
echo "   $FRONTEND_MANAGER create my-new-frontend"
echo ""
echo "3. 启动服务:"
echo "   $FRONTEND_MANAGER start"
echo ""
echo "4. 查看日志:"
echo "   $FRONTEND_MANAGER logs"
echo ""
echo "5. 通过服务管理器:"
echo "   ./scripts/service-manager.sh frontend [command]"
echo ""

echo -e "${GREEN}✅ 演示完成！${NC}"
echo ""
echo -e "${BLUE}📚 更多信息请查看: scripts/README-frontend-manager.md${NC}" 