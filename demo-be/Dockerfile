FROM mcr.microsoft.com/playwright:v1.61.0-jammy

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server.mjs ./

ENV NODE_ENV=production

CMD ["npm", "start"]
