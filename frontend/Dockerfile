FROM node:16.15.0

WORKDIR /

ENV PATH /node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

COPY src ./
COPY public ./

CMD ["npm", "start"]