# Use this Dockerfile to build a production image for the Moments-Mingle backend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
