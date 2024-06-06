# Use the official Node.js LTS (Alpine) image as the base
FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your application will run on
EXPOSE 3001

# Start the application using PM2
CMD ["pm2-runtime", "start", "server.js"]
