FROM node:alpine
WORKDIR /app/olympus-bg
COPY ./olympus-bg/package.json ./olympus-bg/package-lock.json ./
RUN npm install
COPY ./olympus-bg/ .
RUN npm run build
WORKDIR /app/backend
COPY ./backend/package.json ./backend/package-lock.json ./
RUN npm install
COPY ./backend/ .
CMD PORT=8000 npm run start-server
EXPOSE 8000
