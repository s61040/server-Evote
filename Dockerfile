#ใช้ image node version 16-alpine
FROM node:16-alpine 

#สร้าง folder /usr/src/app
RUN mkdir -p /usr/src/app

#กำหนด พื้นที่ทำงาน
WORKDIR /usr/src/app

#copy file package.json มาวางที่ /usr/src/app/
COPY package.json /usr/src/app/

#install nodemodule 
RUN npm install -f

#copy all file ยกเว้น file ใน dockeringore
COPY . /usr/src/app

#port 3001
EXPOSE 3001
CMD ["npm","start"]
