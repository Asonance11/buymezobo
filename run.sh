#!/bin/bash

# Function to ensure pm2 and concurrently are installed
ensure_dependencies_installed() {
    if ! [ -x "$(command -v pm2)" ]; then
        echo "PM2 is not installed. Installing..."
        npm install -g pm2
    fi
    if ! [ -x "$(command -v concurrently)" ]; then
        echo "Concurrently is not installed. Installing..."
        npm install -g concurrently
    fi
}

# Function to remove the .next directory
remove_next() {
    if [ -d ".next" ]; then
        echo "Removing .next directory..."
        rm -rf .next
    fi
}

# Function to build the Next.js app
build_app() {
    echo "Building Next.js app..."
    pnpm run build &
}

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
stop_docker() {
    echo "Stopping Docker containers..."
    docker compose down
}

# Function to start the Node.js server with pm2
start_node_server() {
    echo "Starting Node.js server with pm2..."
    npx pm2 start server.js --name socket-server --watch
}

# Function to stop the Node.js server managed by pm2
stop_node_server() {
    echo "Stopping Node.js server managed by pm2..."
    npx pm2 stop socket-server
    npx pm2 delete socket-server
}

# Check the argument passed to the script
case "$1" in
    dev)
        ensure_dependencies_installed
        remove_next
        start_docker
        start_dev
        #start_node_server
        ;;
    prod)
        ensure_dependencies_installed
        remove_next
        build_app
        start_docker
        start_prod
        #start_node_server
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

