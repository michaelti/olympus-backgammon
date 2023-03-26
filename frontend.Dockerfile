FROM node:alpine AS build
WORKDIR /app/olympus-bg
COPY ./olympus-bg/package.json ./olympus-bg/package-lock.json ./
RUN npm install
COPY ./olympus-bg/ .
WORKDIR /app/frontend
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install
COPY ./frontend/ .
ARG VITE_BACKEND_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
