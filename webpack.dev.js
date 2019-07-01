/**
 *  === 该部分为开发环境使用的配置 === 
 */

const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'development',
   devtool: 'inline-source-map', // 当发生错误时的解释说明（仅开发环境使用）
    // 为你提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)
    devServer: {
        contentBase: './dist',
        hot: true, // 启用 HMR 模块热替换 https://www.webpackjs.com/guides/hot-module-replacement/
    },
    plugins:[
        new webpack.NamedModulesPlugin(), //用于启动HMR时可以显示模块的相对路径
        new webpack.HotModuleReplacementPlugin(), //hot module replacement 启动模块热替换的插件
    ]
})