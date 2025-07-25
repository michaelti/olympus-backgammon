FROM node:alpine

WORKDIR /app/olympus-bg

COPY ./olympus-bg/package.json ./olympus-bg/package-lock.json ./
RUN npm install
COPY ./olympus-bg/ .
RUN npm run build

WORKDIR /app/frontend

COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install
COPY ./frontend/ .
RUN npm run build

CMD npm start
EXPOSE 3000
