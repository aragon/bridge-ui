FROM node:14

WORKDIR /app
COPY . /app/
RUN npm install && npm install ts-node node-fetch
EXPOSE 4040
CMD ["yarn", "start"]
