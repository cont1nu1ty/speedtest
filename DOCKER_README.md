# 网速测试应用 Docker 部署指南

## 项目概述

这是一个集成了前端和后端的网速测试应用，使用Go语言开发后端，Vue.js开发前端，通过Docker容器化部署。

## 特性

- 🚀 前后端一体化部署
- 📱 响应式Web界面
- 🔧 网速测试功能
- 🐳 容器化部署
- 🏥 健康检查
- 🔒 非root用户运行

## 快速开始

### 前置要求

- Docker 20.10+
- Docker Compose 2.0+ (可选)

### 构建镜像

#### Linux/macOS
```bash
chmod +x build.sh
./build.sh
```

#### Windows
```cmd
build.bat
```

#### 手动构建
```bash
docker build -t speedtest-app:latest .
```

### 运行应用

#### 使用Docker命令
```bash
# 使用默认配置
docker run -d \
  --name speedtest \
  -p 8080:8080 \
  --restart unless-stopped \
  speedtest-app:latest

# 使用环境变量文件
docker run -d \
  --name speedtest \
  -p 8080:8080 \
  --restart unless-stopped \
  --env-file config.env \
  speedtest-app:latest

# 直接指定环境变量
docker run -d \
  --name speedtest \
  -p 8080:8080 \
  --restart unless-stopped \
  -e PORT=9000 \
  -e LOG_LEVEL=debug \
  speedtest-app:latest
```

#### 使用Docker Compose
```bash
docker-compose up -d
```

### 访问应用

构建完成后，访问 http://localhost:8080 即可使用网速测试功能。

## 配置选项

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| BIND_ADDRESS | 0.0.0.0 | 绑定地址 |
| PORT | 8080 | 监听端口 |
| LOG_LEVEL | info | 日志级别 |
| BASE_URL | "" | 基础URL路径 |
| ENABLE_TLS | false | 启用TLS |
| ENABLE_HTTP2 | false | 启用HTTP/2 |
| TLS_CERT_FILE | "" | TLS证书文件路径 |
| TLS_KEY_FILE | "" | TLS密钥文件路径 |

### 命令行参数

应用支持以下命令行参数：

```bash
./speedtest --help
```

常用参数：
- `--bind-address`: 绑定地址
- `--port`: 监听端口
- `--base-url`: 基础URL路径

## 容器管理

### 查看容器状态
```bash
docker ps -a | grep speedtest
```

### 查看容器日志
```bash
docker logs speedtest
```

### 停止容器
```bash
docker stop speedtest
```

### 重启容器
```bash
docker restart speedtest
```

### 删除容器
```bash
docker rm -f speedtest
```

## 健康检查

容器内置健康检查，每30秒检查一次应用状态：

```bash
docker inspect --format='{{.State.Health.Status}}' speedtest
```

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 检查端口占用
   netstat -tulpn | grep 8080
   
   # 使用其他端口
   docker run -p 8081:8080 speedtest-app:latest
   ```

2. **容器启动失败**
   ```bash
   # 查看详细日志
   docker logs speedtest
   
   # 检查容器状态
   docker inspect speedtest
   ```

3. **前端无法访问**
   - 确保容器正在运行
   - 检查端口映射
   - 查看容器日志

### 调试模式

如需调试，可以进入容器：

```bash
docker exec -it speedtest sh
```

## 生产环境部署

### 使用外部数据库
```yaml
version: '3.8'
services:
  speedtest:
    build: .
    ports:
      - "8080:8080"
    environment:
      - BIND_ADDRESS=0.0.0.0
      - PORT=8080
    restart: unless-stopped
    networks:
      - speedtest-network
    volumes:
      - ./logs:/app/logs
      - ./config:/app/config

networks:
  speedtest-network:
    driver: bridge
```

### 反向代理配置

#### Nginx示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 性能优化

### 资源限制
```bash
docker run -d \
  --name speedtest \
  -p 8080:8080 \
  --memory=512m \
  --cpus=1.0 \
  speedtest-app:latest
```

### 网络优化
```bash
docker run -d \
  --name speedtest \
  -p 8080:8080 \
  --network=host \
  speedtest-app:latest
```

## 安全建议

1. 在生产环境中使用非默认端口
2. 配置防火墙规则
3. 定期更新基础镜像
4. 使用私有镜像仓库
5. 启用日志审计

## 许可证

请查看项目根目录的LICENSE文件。

## 贡献

欢迎提交Issue和Pull Request！

## 支持

如果遇到问题，请：

1. 查看本文档的故障排除部分
2. 检查GitHub Issues
3. 提交新的Issue并附上详细描述
