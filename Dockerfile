FROM node:18-alpine

WORKDIR /usr/src

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build
CMD ["npm", "start"]