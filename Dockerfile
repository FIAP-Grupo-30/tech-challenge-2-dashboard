FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 9003
CMD ["npm", "run", "dev", "--", "--host"]
