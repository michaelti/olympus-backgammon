FROM node:lts-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json ./
COPY ./olympus-bg/package.json ./olympus-bg/package-lock.json ./olympus-bg/
COPY ./frontend/package.json ./frontend/package-lock.json ./frontend/

RUN npm ci

COPY ./olympus-bg/ ./olympus-bg/
COPY ./frontend/ ./frontend/

RUN npm run build --workspace=olympus-bg
RUN npm run build --workspace=frontend

CMD npm start --workspace=frontend
EXPOSE 3000
