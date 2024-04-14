#!/bin/bash

# 后续计划，像是git clone rpc 问题，任意一步出现问题，如何合理回滚。

# Step 1: Read git repository URL from user input
read -p "Enter git repository URL(not contains .git): " git_url
echo "Git repository URL: $git_url"

# Step 2: Add .git suffix to the URL if it's missing
if [[ ! $git_url == *".git" ]]; then
    git_url="$git_url.git"
fi

# Step 3: Clone repository to current directory
echo "Cloning repository..."
git clone $git_url

# Step 4: Get the cloned folder name
folder_name=$(basename "$git_url" .git)
echo "Cloned folder name: $folder_name"

# Step 5: Find CSS file in the cloned folder and copy it to parent directory
echo "Finding CSS file..."
css_file=$(find "$folder_name" -type f -name "*.css" -print -quit)
if [[ -n "$css_file" ]]; then
    echo "CSS file found: $css_file"
    cp "$css_file" .
    echo "CSS file copied to parent directory."
else
    echo "CSS file not found."
fi

# Step 6
dir=$(basename "$css_file" .css)
echo "file directory: $dir"
cp -r "$folder_name/$dir" .
echo "file directory copied to parent directory."

# Step 7: Remove original git repository directory
echo "Removing original git repository directory..."
rm -rf "$folder_name"
echo "Original git repository directory removed."

echo "Typora theme installation completed."

# 我想写一个 sh 脚本：
# 1. 输入 `https://github.com/IORoot/typora__notion-theme` 这种格式的仓库地址
# 2. 从github api 中，找到地址根目录中的 `.css` 文件
# 3. 用 `.css` 的文件名，找到同名目录
# 这个方案废弃，下载文件夹还是不如直接完全复制方便。