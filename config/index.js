const pkg = require('../package.json')
const { resolve } = require('../packages/utils/basic')

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

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

      if (isProd) {
        rule.push({
          test: /\.js$/,
          loader: 'babel-loader'
        })
      }

      chain.merge({
        module: { rule }
      })

      chain
        .plugin('providerPlugin')
        .tap((args) => {
          args[0].$t = [resolve('src/shared/locale.ts'), 'default']
          args[0].BEM = [resolve('src/shared/bem.ts'), 'default']
          args[0].emitter = [resolve('src/shared/emitter.ts'), 'default']
          args[0].toast = [resolve('src/shared/toast.ts'), 'default']
          args[0].modal = [resolve('src/shared/modal.ts'), 'default']
          args[0].request = [resolve('src/shared/request.ts'), 'default']
          args[0].router = [resolve('src/router/index.ts'), 'default']
          return args
        })
        .end()
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
          generateScopedName: isDev
            ? '[local]_[hash:base64:8]'
            : '[hash:base64:6]'
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
    [resolve('packages/taro-plugin-types')],
    [resolve('packages/taro-plugin-theme')],
    [resolve('packages/taro-plugin-compile'), {
      path: resolve('public/compile.config.js')
    }],
    [resolve('packages/taro-plugin-config'), {
      sourceRoot: 'public',
      global: {
        projectname: pkg.name,
        setting: {
          es6: false,
          minified: false,
          urlCheck: isProd
        }
      }
    }],
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
