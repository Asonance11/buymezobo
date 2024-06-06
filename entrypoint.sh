#!/bin/sh

#####################################
#
#   this script is used by next.dockerfile to 
#   start, i sourced it to a script because 
#   i was having issues interacting with prisma before joining
#   the docker network
#
#########################################


# Run database-related commands
echo "Running database-related commands..."
# pnpm exec prisma generate
npx prisma db push 
npx prisma generate

# Start the Next.js application
echo "Starting Next.js application..."
exec node server.js
