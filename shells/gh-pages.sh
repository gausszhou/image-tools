#!/bin/bash

# 确保脚本在遇到错误时停止执行
set -e

# 删除旧的目录
echo "删除旧的构建目录..."
rm -rf dist

# 构建
npm run build

# 进入构建目录
cd dist
cp index.html 404.html

# 初始化 git 仓库（如果不存在）
if [ ! -d .git ]; then
    git init
    git remote add origin git@github.com:gausszhou/image-tools.git
fi

# 添加所有文件到 git
git add .

# 提交更改
git commit -m "部署到 GitHub Pages"

# 推送到 gh-pages 分支
echo "正在推送到 GitHub Pages..."
git push -f origin HEAD:gh-pages

echo "部署完成！" 