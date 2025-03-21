FROM node:18-alpine

# Tạo thư mục ứng dụng
WORKDIR /app

# Sao chép package.json và package-lock.json trước
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install --production

# Sao chép toàn bộ mã nguồn
COPY . .

# Expose port
EXPOSE 3000

# Khởi động ứng dụng
CMD ["node", "server.js"]