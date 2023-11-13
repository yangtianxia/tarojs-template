# ghost-miniprogram

> 基于 [tarojs](https://taro-docs.jd.com/docs/) 快速开发模板，API方法都是以[微信小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/)标准

## 常见问题

- [关于vue自定义组件警告](#vue自定义组件忽略配置)
- [关于vue开发调试下载失败](#vue开发调试下载-tarojsplugin-vue-devtools-失败)
- [关于navigation-bar返回按钮问题](#navigation-bar-组件返回按钮问题)

## 目录结构

```ts
ghost-miniprogram
├── .vscode
│   ├── settings.json
│   └── tsx.code-snippets
├── config
|   ├── plugin
│   ├── dev.js
│   ├── index.js
│   └── prod.js
├── src
│   ├── assets
│   ├── components
│   ├── examples
│   ├── hooks
│   ├── pages
│   ├── router
│   ├── store
│   ├── style
│   ├── subpackages
│   ├── shared
│   ├── app.config.ts
│   ├── app.ts
│   └── index.html
├── types
│   ├── env.d.ts
│   ├── global.d.ts
│   └── vue.d.ts
├── .editorconfig
├── .env
├── .env.development
├── .env.production
├── .eslintrc.js
├── .gitignore
├── .npmrc
├── babel.config.js
├── package.json
├── compile.config.js
├── README.md
└── tsconfig.json
```

## 环境配置

> 环境配置优先级，`.env.[type] > .env.[mode] > .env` 自动覆盖配置，如果运行指定环境不存在 **打包时不会提示异常**，会忽略文件不存在问题
>
> 所有小程序环境支持 `APP_ID` 配置相应小程序id

配置说明

1. 小程序配置，例如：`.env.wrapp` 微信小程序配置，运行 `npm run dev:weapp` 会自动加载指定小程序的配置
2. 环境配置，例如：`.env.test` 测试环境，运行 `npm run dev:weapp -- --mode test` 会自动加载指定环境配置

添加文件

- .env 默认环境配置
- .env.[type] 指定小程序配置
- .env.[mode] 自定义环境配置
- .env.[type].local 本地环境

配置 `.env` 文件示例

```env
key1 = hello
key2 = world

key3 = @key1
// => hello
```

运行 `.env.weapp` 和 `.env.test` 环境示例

```ts
npm run dev:weapp -- --mode test
```

添加自定义 `scripts` 命令

```ts
{
  "scripts": {
    "test": "npm run dev:weapp -- --mode test"
  }
}
```

## 内置命令配置

- `vue` 开发调试插件：[@tarojs/plugin-vue-devtools](https://taro-docs.jd.com/docs/vue-devtools)

- 数据 `mock` 插件：[@tarojs/plugin-mock](https://github.com/NervJS/taro-plugin-mock)

```ts
{
  "scripts": {
    // 调试命令：只支持微信小程序调试，通过 `vue-devtools` 调试
    "debug": "npm run dev:weapp -- --debug",
    // mockjs命令：@tarojs/plugin-mock
    "mock": "npm run dev:weapp -- --mock"
  }
}
```

运行小程序命令

```ts
{
  "scripts": {
    // 运行微信小程序
    "dev:weapp": "npm run build:weapp -- --watch",
    // 运行支付宝小程序
    "dev:alipay": "npm run build:alipay -- --watch",
    // 运行抖音小程序
    "dev:tt": "npm run build:tt -- --watch"
  }
}
```

打包小程序命令

```ts
{
  "scripts": {
    // 打包微信小程序
    "build:weapp": "taro build --type weapp",
    // 打包支付宝小程序
    "build:alipay": "taro build --type alipay",
    // 打包抖音小程序
    "build:tt": "taro build --type tt"
  }
}
```

## 小程序路由

> 路由配置完后，会根据配置生成路由地址
> 
> 注意：目前不支持自动生成小程序页面，路由配置完后依旧需要自行在 `app.config.ts` 配置

配置地址

- `src/router/routes/index.ts`

配置声明

```ts
export type Query = Record<string, any>

interface RouteMetaBase {
  readonly name: string
  readonly alias?: string
  readonly path: string
  readonly roles?: string[]
  requiresAuth?: boolean
  title: string
  query?: Query
}

export interface RouteMeta extends RouteMetaBase {
  children?: RouteMeta[]
  beforeEnter?: (
    payload: {
      query: Query,
      options: RouteMetaBase
    }
  ) => {
    validator?: () => false | Error | ResultProps | undefined
    options: RouteMetaBase
  }
}
```

router支持方法

* `beforeEnter`：全局跳转拦截
* `getPermission`：获取路由权限，可添加自己的权限逻辑
* `checkTabbar`：检查tabbar页面
* `getCurrentPages`：获取页面栈
* `getRoute`：获取指定路由
* `jumpLogin`：跳转登录页，主动携带当前页面信息
* `navigateBack`：返回上一页，会检查当前栈是否大于1，否则跳转首页
* `navigateTo`：`**支持拦截**` 跳转页面，会检查是否超出最大栈，否则关闭当前页面并跳转
* `switchTab`：`**支持拦截**` 跳转到tabBar页面
* `reLaunch`：`**支持拦截**` 关闭所有页面并跳转
* `redirectTo`：`**支持拦截**` 关闭当前页面并跳转

## 小程序项目配置

目前 `ghost-miniprogram` 项目配置未使用 `tarojs` 官方定义的方式。而是通过内置的 `taro-mini-config` 插件将指定的配置文件拷贝到生成根目录下，部分配置字段也可以通过配置注入

官方配置文档：[项目配置](https://taro-docs.jd.com/docs/project-config)

#### vue自定义组件忽略配置

`@vue/babel-preset-jsx` 插件配置

```ts
// babel.config.js
module.exports = {
  presets: {
    ['taro', {
      ...
      vueJsx: {
        isCustomElement: (tag) => tag.startsWith('custom')
      }
    }]
  }
}
```

`@tarojs/plugin-framework-vue3` 插件配置

```ts
const config = {
  plugins: [
    ['@tarojs/plugin-framework-vue3', {
      vueLoaderOption: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('custom')
        }
      }
    }]
  ]
}
```

#### vue开发调试下载 `@tarojs/plugin-vue-devtools` 失败

目前项目解决是给 `electron` 指定了淘宝的源，可在 `.npmrc` 配置查看

### `navigation-bar` 组件返回按钮问题

`navigation-bar` 组件 `返回按钮` 不会在支付宝小程序中展示。因为支付宝小程序默认返回按钮无法隐藏，且层级在页面层级之上，所以只能沿用支付宝小程序的默认返回按钮，需要自行做兼容处理
