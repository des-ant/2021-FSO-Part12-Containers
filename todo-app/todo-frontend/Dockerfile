FROM node:16

WORKDIR /usr/src/app

COPY . .

ENV REACT_APP_BACKEND_URL=//localhost:8080/api

RUN CI=true npm test

RUN npm ci

RUN npm run build

RUN npm install -g serve

CMD ["serve", "build"]
