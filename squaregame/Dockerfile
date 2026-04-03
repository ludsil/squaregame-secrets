# Stage 1: Build the React app
FROM node:16-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Set build-time env vars (React bakes these into the bundle at build time)
ENV REACT_APP_COLOR_1=white
ENV REACT_APP_COLOR_2=red
ENV REACT_APP_COLOR_3=green
ENV REACT_APP_COLOR_4=blue
ENV REACT_APP_COLOR_5=yellow

# Build the production bundle
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy the built React app to nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
