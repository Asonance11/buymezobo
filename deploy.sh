#!/bin/sh

#####################################
#
#   this script is used in the production environment
#   to update the repo and images and rebuild immediately
#
#########################################

set -e

# Step 1: Pull the latest code from the repository
echo "Fetching all branches from the repository..."
git fetch --all

# Step 2: Pull the latest changes for all branches
echo "Pulling the latest changes for all branches..."
git pull --all

# Step 2: Update Docker images
echo "Updating Docker images..."
docker compose -f prod.yml pull

# Step 3: Rebuild the images (if necessary)
echo "Rebuilding Docker images..."
docker compose -f prod.yml build

# Step 4: Start the application
echo "Starting the application..."
docker compose -f prod.yml up

docker container ls

echo "Deployment completed successfully."

