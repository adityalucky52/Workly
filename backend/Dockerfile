
# ------------------------------
# Backend Dockerfile for Node.js
# ------------------------------
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (only production if possible, but dev deps might be needed for tests/scripts)
# Using npm ci for cleaner installation if package-lock.json exists, otherwise npm install
RUN npm install

# Copy application source code
COPY . .

# Expose the API port (standard is 3000 as per .env found)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
