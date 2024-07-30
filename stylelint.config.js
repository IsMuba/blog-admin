module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order' // 配置css属性书写顺序插件
  ],
  ignoreFiles: ['src/**/normalize.min.scss'], // 忽略文件设置，可以写多个，可以是文件和文件夹
  overrides: [
    {
      files: ['**/*.(scss|css|vue|html)'],
      customSyntax: 'postcss-scss'
    },
    {
      files: ['**/*.(html|vue)'],
      customSyntax: 'postcss-html'
    }
  ]
}
