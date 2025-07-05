#!/bin/bash

# Quick Frontend Manager
# Simplified version for common operations

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Quick Frontend Manager${NC}"
    echo -e "${BLUE}================================${NC}"
}

show_menu() {
    echo -e "\n${YELLOW}Available operations:${NC}"
    echo -e "  1. Switch to frondend1"
    echo -e "  2. Switch to frontend1-2 (DEFAULT)"
    echo -e "  3. Switch to frontend2"
    echo -e "  4. Switch to frontend2-2"
    echo -e "  5. Show current frontend"
    echo -e "  6. Restart current frontend"
    echo -e "  7. View frontend logs"
    echo -e "  8. Exit"
    echo ""
}

main() {
    print_header
    
    # Check if running from project root
    if [[ ! -f "docker-compose.yml" ]]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    while true; do
        show_menu
        echo -e "${YELLOW}Enter your choice (1-8):${NC}"
        read -r choice
        
        case $choice in
            1)
                print_status "Switching to frondend1..."
                ./scripts/switch-frontend.sh frondend1
                ;;
            2)
                print_status "Switching to frontend1-2..."
                ./scripts/switch-frontend.sh frontend1-2
                ;;
            3)
                print_status "Switching to frontend2..."
                ./scripts/switch-frontend.sh frontend2
                ;;
            4)
                print_status "Switching to frontend2-2..."
                ./scripts/switch-frontend.sh frontend2-2
                ;;
            5)
                print_status "Current frontend configuration:"
                ./scripts/switch-frontend.sh --current
                ;;
            6)
                print_status "Restarting current frontend..."
                docker compose restart frontend
                print_status "Frontend restarted!"
                ;;
            7)
                print_status "Showing frontend logs (Ctrl+C to exit):"
                docker compose logs -f frontend
                ;;
            8)
                print_status "Exiting..."
                exit 0
                ;;
            *)
                print_error "Invalid choice. Please enter a number between 1-8."
                ;;
        esac
        
        echo ""
        echo -e "${YELLOW}Press Enter to continue...${NC}"
        read -r
    done
}

main "$@" 