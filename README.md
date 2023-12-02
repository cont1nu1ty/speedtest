# Speed Test

简单的网页测速。

## Build

项目依赖：

- `go`
- `node.js`
- `make`

项目后端使用`go`开发，前端使用`vue`开发，使用`make`作为编译工具。

```shell
make
```

将编译出一个静态的可执行文件`speedtest`。

```shell
make container
```

将编译容器镜像文件。

## 后端提供的终结点

- `backend/getIP` 查询当前的IP地址
- `backend/garbage` 返回固定大小的垃圾数据
- `backend/empty`接受任意大小的上传文件


