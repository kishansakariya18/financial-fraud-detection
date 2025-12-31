# Build React App
FROM node:20 AS nodework
WORKDIR /app
COPY package*.json ./
# RUN NODE_OPTIONS="--max-old-space-size=2014"  npm install
RUN --mount=type=cache,target=/root/.npm \
    NODE_OPTIONS="--max-old-space-size=2024" \
    npm install --prefer-offline --no-audit
COPY . ./
# Accept multiple build-time variables
#ARG VITE_S3_URL
#ARG VITE_API_URL
# Export them so React/Vite can use them
#ENV VITE_S3_URL=$VITE_S3_URL
#ENV VITE_API_URL=$VITE_API_URL


RUN NODE_OPTIONS="--max-old-space-size=2014" npm run build
#RUN vite build
# Use Nginx for serving static files
FROM nginx:alpine
COPY --from=nodework /app/dist /usr/share/nginx/html
COPY frontend.conf /etc/nginx/conf.d/admin-ig-panel.sourcecodelab.co.conf
COPY ssl/scl.crt /etc/nginx/ssl/scl.crt
COPY ssl/scl.key /etc/nginx/ssl/scl.key
COPY ssl/scl-ca.crt /etc/nginx/ssl/scl-ca.crt
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
