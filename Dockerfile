FROM node:20-alpine
WORKDIR /usr/src/app/
COPY client ./client/
RUN cd client && npm install && npm run build && cd ../
COPY package*.json / ./
RUN npm install
COPY ./models ./
COPY ./routes ./
COPY index.js ./
COPY .env ./
COPY start.sh ./

EXPOSE 3000
CMD [ "./start.sh" ]