# ---- Dev stage (used by docker compose locally) ----
FROM node:24-alpine AS dev

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]

# ---- Build stage ----
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm install

COPY . .
RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine

# nginx official image processes /etc/nginx/templates/*.template with envsubst
# and writes the result to /etc/nginx/conf.d/ on container start
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 8080
