/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // 安装eslint插件 配置自动报错修复
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true, //单引号
        semi: false, //无分号
        printWidth: 80, //每行宽度至多到80字符
        trailingComma: 'none', // 不加最后的逗号
        endOfLine: 'auto' // 换行符号不限制
      }
    ],
    'vue/no-setup-props-destructure': ['off'], //关闭props解构丢失响应式的问题
    'no-undef': 'error' //添加未定义变量报错提示
  }
}
yu