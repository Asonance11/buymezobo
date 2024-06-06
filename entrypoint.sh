#!/bin/sh

# Run database-related commands
echo "Running database-related commands..."
# pnpm exec prisma generate
npx prisma db push && npx prisma generate

# Start the Next.js application
echo "Starting Next.js application..."
exec node server.js
