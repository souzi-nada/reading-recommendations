FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
# RUN npm run dev
# RUN npm i -g pm2 \
#     pm2 start index.js
