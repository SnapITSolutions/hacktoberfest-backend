FROM node:16.9.1

WORKDIR /app

COPY ./src ./src
COPY ./tsconfig.json .
COPY ./config.yml .
COPY ./package.json .

EXPOSE 5353
RUN npm i --global typescript
RUN npm i
RUN tsc
CMD ["npm", "run", "start"]
