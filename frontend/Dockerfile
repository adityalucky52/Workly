
# ------------------------------
# Frontend Dockerfile for React/Vite
# ------------------------------
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start the dev server exposed to all interfaces
CMD ["npm", "run", "dev", "--", "--host"]
