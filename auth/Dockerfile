FROM node:alpine

WORKDIR /app
COPY package.json .
# dont install dev dependencies (mongo in memeory db is 80mb!)
RUN npm install --omit=dev
COPY . .

CMD ["npm", "start"]