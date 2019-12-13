module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['view-design/dist/styles/iview.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['plugins/iview'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxt/typescript-build'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/style-resources'],
  srcDir: 'src/front',
  extensions: ['ts'], // 支持ts文件
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    babel: {
      presets: [['@nuxt/babel-preset-app', { modules: 'commonjs' }]]
    },
    devtools: true,
    additionalExtensions: ['ts'], // 添加支持ts结尾文件
    extend(config, ctx) {}
  },
  buildDir: 'build',
  // 覆盖nuxt-router
  router: {
    base: process.env.NODE_ENV === 'production' ? '/app/' : ''
  },
  proxy: {}
};
