const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成默认 html 模板的插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 每次build前会先清理 /dist 文件夹下文件

// console.log(CleanWebpackPlugin);
module.exports = {
    entry: {
        app: "./src/index.js", // 设置入口为 index.js
    },
    // 其他功能组件
    plugins: [
        new CleanWebpackPlugin(), // 生成前先 清理 /dist 多余的
        new HtmlWebpackPlugin({ // 生成默认 index.html
            title: '...',
            bodyHtmlSnippet:'<div id="canvasBox"></div>'
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    // 添加新的模块
    module: {
        rules: [
            // 样式模块 .css
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            // 样式模块 .less
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            // 添加图片
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: ['file-loader']
            }
        ],
    }
};