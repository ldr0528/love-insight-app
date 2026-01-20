# 项目部署指南

本指南将帮助你将 React + Express 全栈项目部署到服务器（推荐香港服务器）。

## 1. 服务器准备

推荐选择 **阿里云** 或 **腾讯云** 的 **香港节点** 轻量应用服务器。
*   **系统**：推荐 Ubuntu 22.04 LTS 或 Debian 11/12
*   **配置**：最低 1核 2G 内存即可运行

## 2. 环境安装

登录到你的服务器（使用 SSH），执行以下命令安装 Node.js 和 PM2：

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v
npm -v

# 安装 PM2 (用于后台运行服务)
sudo npm install -g pm2
```

## 3. 部署代码

你可以通过 Git 拉取代码，或者直接将本地代码上传到服务器。

### 方法 A：上传本地代码 (简单)
使用 FTP 工具 (如 FileZilla) 或 SCP 命令将代码上传到服务器 `/var/www/app` 目录。
注意：**不要**上传 `node_modules` 文件夹。

### 方法 B：Git 拉取
```bash
git clone <你的仓库地址> /var/www/app
```

## 4. 安装依赖与构建

进入项目目录并安装依赖：

```bash
cd /var/www/app

# 安装依赖 (生产环境)
npm install

# 构建前端 (生成 dist 目录)
npm run build
```

## 5. 启动服务

使用 PM2 启动服务，这样即使断开 SSH 连接，服务也会一直运行。

```bash
# 设置环境变量为 production 并启动
NODE_ENV=production pm2 start npm --name "my-app" -- run start

# 查看日志
pm2 logs

# 保存当前进程列表 (开机自启)
pm2 save
pm2 startup
```

此时，你的服务应该运行在 `3001` 端口。

## 6. 配置 Nginx (使用域名访问)

为了通过域名直接访问（去掉端口号），建议安装 Nginx。

```bash
# 安装 Nginx
sudo apt install nginx -y
```

创建配置文件 `/etc/nginx/sites-available/my-app`：

```nginx
server {
    listen 80;
    server_name your-domain.com; # 替换为你的域名

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置并重启 Nginx：

```bash
sudo ln -s /etc/nginx/sites-available/my-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 7. 域名解析

1.  去你的域名服务商控制台。
2.  添加一条 `A` 记录。
3.  主机记录：`@` (或 `www`)。
4.  记录值：填写你服务器的 **公网 IP 地址**。

等待几分钟解析生效后，即可通过域名访问！
