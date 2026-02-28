# ------------------------------
# Frontend Dockerfile for React/Vite (Production)
# ------------------------------
# Stage 1: Build the Vite application
FROM node:22-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install dependencies
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve the optimized build with Nginx
FROM nginx:alpine

# Copy the built assets to Nginx's web root directory
COPY --from=build /app/dist /usr/share/nginx/html

# Add a simple Nginx configuration to support SPA routing and backend proxy
RUN printf "server {\n    listen 80;\n    \n    location / {\n        root /usr/share/nginx/html;\n        index index.html index.htm;\n        try_files \$uri \$uri/ /index.html;\n    }\n    \n    location /api/ {\n        proxy_pass http://workly-backend:3000/api/;\n        proxy_set_header Host \$host;\n        proxy_set_header X-Real-IP \$remote_addr;\n        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto \$scheme;\n    }\n}\n" > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
