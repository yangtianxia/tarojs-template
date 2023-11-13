const path = require('path')
const pkg = require('../package.json')

const resolve = (...dir) => path.resolve(__dirname, '..', ...dir)

const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'

const config = {
  projectName: pkg.name,
  date: '2022-12-13',
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  framework: 'vue3',
  compiler: 'webpack5',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  cache: {
    enable: true
  },
  alias: {
    '@': resolve('src')
  },
  mini: {
    webpackChain: (chain) => {
      const rule = [
        {
          test: /\.mjs$/,
          include: [/pinia/],
          loader: 'babel-loader'
        }
      ]

      if (isProd) {
        rule.push({
          test: /\.js$/,
          loader: 'babel-loader'
        })
      }

      chain.merge({
        module: {
          rule
        }
      })
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024
        }
      },
      cssModules: {
        enable: true,
        config: {
          auto: true,
          namingPattern: 'module',
          generateScopedName: isDev ? '[local]_[hash:base64:8]' : '[hash:base64:6]'
        }
      }
    },
    lessLoaderOption: {
      lessOptions: {
        javascriptEnabled: true
      }
    },
    optimizeMainPackage: {
      enable: true
    }
  },
  plugins: [
    [resolve('config/plugin/taro-mini-worker')],
    [resolve('config/plugin/taro-mini-compile')],
    [resolve('config/plugin/taro-mini-config'), {
      sourceRoot: 'public',
      global: {
        projectname: pkg.name,
        setting: {
          // 不启用es6转es5
          es6: false,
          // 默认不压缩
          minified: false,
          // 开发环境不检查域名
          urlCheck: isProd
        }
      }
    }],
    [resolve('config/plugin/taro-theme')],
    [resolve('config/plugin/taro-env')],
    ['@tarojs/plugin-framework-vue3', {
      vueLoaderOption: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('custom')
        }
      }
    }],
    ['taro-plugin-style-resource', {
      less: {
        patterns: [
          resolve('src/style/mixins/ellipsis.less'),
          resolve('src/style/mixins/hairline.less')
        ]
      }
    }]
  ]
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
