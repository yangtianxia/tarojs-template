const pkg = require('../package.json')
const { resolve } = require('../packages/utils/basic')

const isDev = process.env.NODE_ENV === 'development'

const config = {
  projectName: pkg.name,
  date: '2023-12-19',
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

      if (process.env.NODE_ENV === 'production') {
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
    [resolve('packages/taro-plugin-env')],
    [resolve('packages/taro-quick-compile')],
    [resolve('packages/taro-plugin-theme')],
    ['taro-plugin-style-resource', {
      less: {
        patterns: [
          resolve('src/assets/style/mixins/ellipsis.less'),
          resolve('src/assets/style/mixins/hairline.less')
        ]
      }
    }],
    ['@tarojs/plugin-framework-vue3', {
      vueLoaderOption: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('custom')
        }
      }
    }]
  ]
}

module.exports = function (merge) {
  if (isDev) {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
