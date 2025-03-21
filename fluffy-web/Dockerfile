# Giai đoạn xây dựng (build)
FROM node:18-alpine AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép mã nguồn
COPY . .

# Xây dựng ứng dụng
RUN npm run

# Giai đoạn chạy (run)
FROM nginx:alpine

# Sao chép tệp cấu hình Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Sao chép tệp static từ giai đoạn xây dựng
COPY --from=build /app/dist/fluffy-web /usr/share/nginx/html

# Expose port
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]