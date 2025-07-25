FROM node:alpine

WORKDIR /app

COPY ./package.json ./package-lock.json ./
COPY ./olympus-bg/package.json ./olympus-bg/package-lock.json ./olympus-bg/
COPY ./frontend/package.json ./frontend/package-lock.json ./frontend/

RUN npm install

COPY ./olympus-bg/ .
COPY ./frontend/ .

RUN npm run build --workspace=olympus-bg
RUN npm run build --workspace=frontend

CMD npm start
EXPOSE 3000
