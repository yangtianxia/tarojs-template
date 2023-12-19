## Taro-plugin-env

环境配置插件，在项目根目录添加 `.env` 环境配置文件即可使用，有任何问题可以 [issues](https://github.com/yangtianxia/tarojs-template/issues)

> 注意：配置环境字段没有前缀要求，可自行处理避免出现意外问题

### 配置文件选项
- 全局环境 `.env`
- 自定义环境 `.env.[mode]`
- 小程序环境 `.env.[type]`
- 本地环境 `*.local`，以上环境都支持本地环境配置

### 本地环境 `*.local` 配置示例：
- 全局本地环境 `.env.local`
- 本地开发环境 `.env.development.local`

### 运行命令配置
例如：配置一个 `test` 环境

1. 在根目录添加一个 `.env.test` 环境文件
2. 在 `package.json` 的 `scripts` 添加命令行

命令解析是使用 `minimist` 包，具体可前往查看 [minimist 文档](https://www.npmjs.com/package/minimist)

添加 `test` 命令
```json
{
  "scripts": {
    "test": "npm run dev:weapp -- --mode test"
  }
}
```

### 环境文件加载
只修改环境配置文件，环境变量不会得到更新。这个是因为加载 `.env*` 配置文件是在 `tarojs/cli` 的 [`modifyWebpackChain`](https://taro-docs.jd.com/docs/plugin-custom#%E7%BC%96%E8%AF%91%E8%BF%87%E7%A8%8B%E6%89%A9%E5%B1%95) 方法下调用的，所以只有项目本身有内容修改，环境配置文件才会得到重新加载

### 环境文件加载顺序
后加载的配置文件，将覆盖前面加载的配置

.env -> .env.[mode] -> .env.[type] -> *.local

### 字段配置示例
```
key1 = hello
key2 = world

// 使用变量形式定义字段值
key3 = @key1
// => hello
```

### 环境字段拼接
可以在任意环境配置文件内，使用其他环境配置文件的字段

> 注意：拼接字段之间不支持其他字符，可以多个字段拼接使用

#### 示例
.env 配置文件
```
key1 = hello
key2 = world
```

.env.development 配置文件
```
key3 = @key1@key2
// => helloworld
```

### 关于 `prefix` 字段说明
使用 `prefix` 可以避免很多问题，特别是组件命名很有用。因为想要 `node` 环境和 `less` 环境同时拥有相同的 `prefix` 字段内容，所以将它写入了环境配置文件，并且自动加载到两个环境当中。

`node` 的中使用
```js
process.env.PREFIX
```

`less` 的中使用
```less
// 组件样式命名
@button-cls: ~'@{prefix}-button';
```

### 添加微信

添加请备注-项目名

![weixin](./images/weixin.jpg)
