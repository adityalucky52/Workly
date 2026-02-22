# ------------------------------
# Backend Dockerfile for Node.js
# ------------------------------
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Clean install dependencies, omit devDependencies for production
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
