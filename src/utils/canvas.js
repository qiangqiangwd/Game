
import publicOptions from '../utils/public'; // 公共参数的地方

// 加载的图片部分
import road from '../image/wall/road.jpg' // 草地
import wall from '../image/wall/wall2.jpg' // 墙

class Canvas {
    constructor(options = {}) {
        this.options = options;

        this.init();
    }
    // 初始化一个 canvas
    init() {
        let id = this.options.id || null;
        //  若不包含id则不进行初始化
        if (!id) return

        let boxOpt = publicOptions;
        // 重新生成一个 canvas 且赋予相应的 id ,在插入总盒子的后方
        let ele = document.createElement('canvas');
        ele.setAttribute('id', id);
        ele.setAttribute('width', boxOpt.width);
        ele.setAttribute('height', boxOpt.height);
        boxOpt.outerElement && boxOpt.outerElement.appendChild(ele);

        this.ele = ele; // 保存对应节点
        // let canvas = document.getElementById('tutorial');
        this.ctx = ele.getContext('2d');

    }
    // 绘制地图部分
    // x轴、y轴、宽度、高度、类型
    writeWall(x, y, w, h, type) {
        let ctx = this.ctx;

        // 使用图片填充地图
        var img = new Image();
        // 1 - 草地、2 - 墙
        img.src = type == 1 ? road : wall;
        img.onload = function () {
            ctx.drawImage(img, x, y, w, h);
        }
        // 也可以用颜色填充
        ctx.fillStyle = type == 1 ? "#71af26" : "#f19120";
        ctx.clearRect(x, y, w, h); // 先清除原有在进行填充
        ctx.fillRect(x, y, w, h);
    }
    drawHero(x, y, w, h) {
        let ctx = this.ctx;
        // 也可以用颜色填充
        ctx.fillStyle = "#000000";
        ctx.clearRect(x, y, w, h); // 先清除原有在进行填充
        ctx.fillRect(x, y, w, h);
    }
    // 移动
    move(x, y, w, h) {
        let ele = this.ele;
        this.ctx.clearRect(0, 0, ele.width, ele.height);
        // this.ctx.translate(x, y);
        this.drawHero(x, y, w, h); // 先清空画布后在重新绘制图形在重新绘制
    }
    /**
     * === 炸弹部分
     */
    // 生成炸弹
    drawBomb(bombArr) {
        let ctx = this.ctx;
        ctx.textAlign = 'center';

        ctx.clearRect(0, 0, publicOptions.width, publicOptions.height); // 先清除原有在进行填充
        //  循环生成炸弹
        bombArr.forEach(item => {
            // 外边圆
            ctx.beginPath();
            ctx.globalAlpha = 0.8; // 设置透明度
            ctx.strokeStyle = "#ca0c16"; // 边框颜色
            ctx.fillStyle = "#ca0c16"; // 填充颜色
            ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);//绘制圆形
            ctx.fill();
            ctx.stroke();

            //  绘制文字
            ctx.beginPath();
            ctx.fillStyle = "#ffffff"; // 文字填充颜色
            ctx.fillText(item.timer, item.x, (item.y + item.radius)); // 进行绘制
            ctx.stroke();
        });
    }
    // 爆炸效果
    boomStyle(x, y, r,callback) {
        let wh = r * 2;
        let ctx = this.ctx;
        ctx.clearRect(x - r, y - r, wh, wh); // 清除对应部分的圆 

        ctx.fillStyle = "#f9f702";

        let index = 0;
        let timer = setInterval(() => {
            ctx.fillRect(x - r, y - r, index, wh);
            ctx.fill();
            index++;
            if (index >= publicOptions.map.wallWH * 3) { // 3格范围
                clearInterval(timer);
                callback && callback();
            }
        }, 20);
    }
}

export default Canvas