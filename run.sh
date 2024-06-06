#!/bin/bash

# Function to start the Next.js development server
start_dev() {
    echo "Starting Next.js development server and Node.js server..."
    npm run dock:dev
}

# Function to start the Next.js production server
start_prod() {
    echo "Starting Next.js production server and Node.js server..."
    npm run dock:prod
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
        start_dev
        ;;
    prod)
        start_prod
        ;;
    clean)
        clean
        ;;
   *)
        echo "Usage: $0 {dev|prod|clean}"
        exit 1
esac

exit 0

