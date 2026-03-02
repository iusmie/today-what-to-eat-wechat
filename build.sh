#!/bin/bash
# 构建脚本

echo "构建 '今天吃什么' 微信小程序..."

# 检查目录结构
if [ ! -d "miniprogram" ]; then
  echo "错误: miniprogram 目录不存在"
  exit 1
fi

# 检查必要的文件
REQUIRED_FILES=("app.js" "app.json" "app.wxss")
for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "miniprogram/$file" ]; then
    echo "错误: 缺少必要文件 miniprogram/$file"
    exit 1
  fi
done

# 检查页面目录
PAGES=("chat" "index" "profile" "history")
for page in "${PAGES[@]}"; do
  if [ ! -d "miniprogram/pages/$page" ]; then
    echo "警告: 页面目录 miniprogram/pages/$page 不存在"
  fi
done

# 检查云函数
if [ ! -d "miniprogram/cloudfunctions" ]; then
  echo "警告: 云函数目录不存在"
else
  echo "云函数目录存在"
fi

echo "构建完成！项目结构检查通过。"
echo ""
echo "下一步："
echo "1. 在微信开发者工具中打开此项目"
echo "2. 配置云开发环境ID"
echo "3. 上传云函数"
echo "4. 测试功能"