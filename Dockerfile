FROM node:16-alpine

RUN apk add python3 py3-pip

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

COPY requirements.txt ./
RUN pip3 install  -r requirements.txt

RUN chmod +x index.js

EXPOSE 3000

ENTRYPOINT ["node", "index.js"]
