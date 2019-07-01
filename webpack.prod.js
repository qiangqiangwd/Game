/**
 *  === 该部分为线上环境使用的配置 === 
 */

const merge = require('webpack-merge');
const MinifyPlugin = require("babel-minify-webpack-plugin"); // 代码压缩 插件
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode:'production',
    plugins: [
        new MinifyPlugin(),
    ]
})