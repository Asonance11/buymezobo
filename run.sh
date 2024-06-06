#!/bin/bash

# Function to start the Next.js development server
start_dev() {
    echo "Starting Next.js development server and Node.js server..."
    concurrently "pnpm run dev" "pm2 start server.js --name socket-server --watch"
}

# Function to start the Next.js production server
start_prod() {
    echo "Starting Next.js production server and Node.js server..."
    concurrently "pnpm run start" "pm2 start server.js --name socket-server --watch"
}

# Function to start the Docker containers in detached mode
start_docker() {
    echo "Starting Docker containers..."
    docker compose up -d
}

# Function to stop the Docker containers
clean() {
    echo "cleaning environment..."
    rm -rf .next
    docker compose down
}


# Check the argument passed to the script
case "$1" in
    dev)
        ensure_dependencies_installed
        remove_next
        start_docker
        concurrently "node server.js" , "pnpm run dev" #simpler running of both processes
        ;;
    prod)
        ensure_dependencies_installed
        remove_next
        build_app
        start_docker
        start_prod
        ;;
    clean)
        stop_docker
        remove_next
        stop_node_server
        ;;
    build)
        remove_next
        build_app
        stop_node_server
        ;;
    *)
        echo "Usage: $0 {dev|prod|clean|build}"
        exit 1
esac

exit 0

