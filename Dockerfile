# 到 Docker Hub 上找此 image
FROM node:22.13.1-alpine

# 之後的指令，都會針對此 WORKDIR 執行
WORKDIR /app

# 第一個點是指 myapp 所在目錄，第二個點是指 WORKDIR，即 container 的 /app 目錄
COPY . .

# 檔案中可以有多個 RUN 指令
RUN npm install

# 標示 image 是跑在哪一個 port
EXPOSE 3000

# 檔案中只有最後一個 CMD 指令會生效
CMD ["npm", "start"]

