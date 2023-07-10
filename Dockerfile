FROM node:20-alpine AS ui-build
WORKDIR /usr/src/app
COPY client/ ./client/
RUN cd client && npm install && npm run build

FROM node:20-alpine
WORKDIR /root/
COPY --from=ui-build /usr/src/app/client/build ./client/build
COPY package*.json ./
RUN npm install --production
COPY images ./images/
RUN mkdir images/user_drinks
COPY models ./models/
COPY routes ./routes/
COPY index.js ./

EXPOSE 5000

CMD ["node", "index.js"]
