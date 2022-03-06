FROM node:16.5.0-alpine
WORKDIR /code

COPY package*.json ./
RUN npm install
COPY index.js ./
COPY middleware/ ./middleware/
COPY models/ ./models/
COPY routers/ ./routers/
COPY public/ ./public/

CMD ["npm", "run", "start"]
