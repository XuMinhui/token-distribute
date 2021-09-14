### 配置

在根路径下创建 config.json 文件添加以下配置

```
{
    "PRIVATE_KEY": "",                                                                  // 私钥
    "RPC": "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",             // RPC 链接
    "START_ACCOUNT": "0x323ADE210Dbc9A8d77fBb3ca6408a9eEB626458D"                       // 配合 whiteList 使用，指定从哪个地址开始分发
}
```ts