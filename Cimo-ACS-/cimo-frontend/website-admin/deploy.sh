#!/bin/bash

# ==============================
# 🚀 DEPLOY REACT APP TO AWS EC2
# ==============================

# Cấu hình thông tin server
EC2_USER="ec2-user"
EC2_HOST="13.213.46.24"  # Thay bằng IP EC2 của bạn
EC2_PATH="/home/ec2-user/cimo-admin"
SSH_KEY="my-key.pem"  # Đường dẫn tới SSH Key của bạn

# Thư mục build local
BUILD_DIR="dist"

# ==============================
# 🛠 BUILD REACT APP
# ==============================

echo "🔨 Bắt đầu build React App..."
yarn cache clean
yarn install
yarn build

if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ Build thất bại. Kiểm tra lại code!"
  exit 1
fi

echo "✅ Build thành công!"

# ==============================
# 📤 DEPLOY TO EC2
# ==============================

echo "🚀 Đang upload code lên EC2..."
scp -r $BUILD_DIR/* $EC2_USER@$EC2_HOST:$EC2_PATH/

if [ $? -ne 0 ]; then
  echo "❌ Upload thất bại!"
  exit 1
fi

echo "✅ Upload thành công!"

# ==============================
# 🔄 RESTART NGINX (NẾU DÙNG)
# ==============================

echo "🔄 Restart Nginx trên server..."
ssh $EC2_USER@$EC2_HOST "sudo systemctl restart nginx"

if [ $? -ne 0 ]; then
  echo "❌ Restart Nginx thất bại!"
  exit 1
fi

echo "✅ Restart Nginx thành công!"

echo "🎉 DEPLOY HOÀN TẤT!"