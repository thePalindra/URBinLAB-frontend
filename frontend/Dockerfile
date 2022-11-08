FROM node:16.15.0

WORKDIR /

ENV PATH /node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

COPY . ./
EXPOSE 3000

CMD ["npm", "start"]