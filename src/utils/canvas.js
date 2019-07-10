
import publicOptions from '../utils/public'; // 公共参数的地方
import mapWallOptions from '../utils/mapWallOptions'; // 地图公共参数的地方

// 加载的图片部分
import road from '../image/wall/road.jpg' // 草地
import wall from '../image/wall/wall2.jpg' // 墙

// 循环生成动画所调用的函数
const RAF = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
})();
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
        ele.setAttribute('name', id); // 每个画布的名字
        ele.setAttribute('width', boxOpt.width);
        ele.setAttribute('height', boxOpt.height);
        boxOpt.outerElement && boxOpt.outerElement.appendChild(ele);

        this.ele = ele; // 保存对应节点
        // let canvas = document.getElementById('tutorial');
        this.ctx = ele.getContext('2d');

        // // 取消动画
        // this.cancelAnimation = function () {
        //     return window.cancelRequestAnimationFrame ||
        //         window.webkitCancelRequestAnimationFrame ||
        //         window.mozCancelRequestAnimationFrame ||
        //         window.oCancelRequestAnimationFrame ||
        //         window.msCancelRequestAnimationFrame
        // };

    }
    // 清空画布
    clearCanvas() {
        this.ctx.clearRect(0, 0, publicOptions.width, publicOptions.height); // 先清除原有在进行填充
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
    drawHero(x, y, w, h, color = '0,0,0,1') {
        let ctx = this.ctx;
        // 也可以用颜色填充
        ctx.beginPath();
        ctx.clearRect(x, y, w, h); // 先清除原有在进行填充
        ctx.fillStyle = `rgba(${color})`;
        ctx.fillRect(x, y, w, h);
        ctx.closePath();
    }
    drawMonster(posArr, w, h, color = '204,0,0,1') {
        let ctx = this.ctx;

        this.clearCanvas(); // 清空画布
        posArr.forEach(item => {
            // 也可以用颜色填充
            ctx.beginPath();
            ctx.fillStyle = `rgba(${color})`;
            ctx.arc(item[0] + 5, item[1] + 5, 5, 0, Math.PI * 2);//绘制圆形
            // ctx.fillText(10, item[0], item[1] + 5); // 进行绘制
            // ctx.fillRect(item[0], item[1], w, h);
            ctx.closePath();
            ctx.fill();
        });
    }
    // 受伤
    heroGetHurt(x, y, w, h) {
        let index = 0;
        let hurt = () => {
            this.drawHero(x, y, w, h, `147, 0, 8, ${index}`);
            if (index < 1) {
                index += 0.01;
                RAF(hurt);
            } else {
                this.drawHero(x, y, w, h);
            }
        }
        RAF(hurt);
    }
    // 移动
    move(x, y, w, h) {
        let ele = this.ele;
        this.ctx.clearRect(0, 0, ele.width, ele.height);
        this.drawHero(x, y, w, h); // 先清空画布后在重新绘制图形在重新绘制
    }
    /**
     * === 炸弹部分
     */
    // 生成炸弹
    drawBomb(bombArr) {
        let ctx = this.ctx;
        ctx.textAlign = 'center';
        // console.log(JSON.parse(JSON.stringify(bombArr)));

        this.clearCanvas(); // 先清除原有在进行填充
        //  循环生成炸弹
        bombArr.forEach(item => {
            // 外边圆
            ctx.beginPath();
            ctx.globalAlpha = 0.8; // 设置透明度
            ctx.strokeStyle = "#ca0c16"; // 边框颜色
            ctx.fillStyle = "#ca0c16"; // 填充颜色
            ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);//绘制圆形
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            //  绘制文字
            ctx.beginPath();
            ctx.fillStyle = "#ffffff"; // 文字填充颜色
            ctx.fillText(item.timer, item.x, (item.y + item.radius)); // 进行绘制
            ctx.closePath();
            ctx.stroke();
        });
    }
    // 爆炸效果【爆炸宽高还是以每格墙壁宽高为基准】
    boomStyle(bombOpt, checkFun, callback) {
        // 现货区对应的详情
        let [x, y, r] = [
            bombOpt.x, bombOpt.y, bombOpt.radius
        ];

        let wh = r * 2;
        let wallWH = publicOptions.map.wallWH; // 墙的宽高度
        let ctx = this.ctx;
        let map = mapWallOptions[publicOptions.map.level - 1].allContentArr; //当前所在map 总的类型数据
        // ctx.clearRect(x - r, y - r, wh, wh); // 清除对应部分的圆 

        let gride = bombOpt.bombRange; // 爆炸的范围（以自己为中心，单位：格）
        let allWidth = wallWH * gride;
        // 3 1/3   5  2/5  7  3/7
        let slot = allWidth * (Math.floor(gride / 2) / gride);
        let slotNum = Math.floor(gride / 2);


        // 立即发生爆炸
        let opacity = 1;

        /**
         * 当爆炸碰到墙壁（后续可能会加判断？）时停止
         */
        // 中心点的行列位置
        let posArr = [
            Math.floor(y / wallWH), // 行
            Math.floor(x / wallWH), // 列
        ];
        // 注：x - r 其中x是中心点的坐标，可以由此判断出当前所在的格子坐标
        let setPosition = {
            // 横线部分
            x1: x - r - slot, // 最右的x坐标
            y1: y - r, // y坐标
            w1: allWidth, // 显示总的长度
            // 竖线部分
            x2: x - r, //  x坐标
            y2: y - r - slot, // 最上的y坐标
            w2: allWidth, // 显示总的长度
        }

        //  获取爆炸所显示的范围坐标
        for (let i = 0; i < gride; i++) {
            let addRow = posArr[0] - slotNum + i; // 行
            let delCol = posArr[1] - slotNum + i; // 列

            // 横线部分
            if (delCol < 0 || delCol > 29 || map[posArr[0]][delCol] == 2) { // 不包含本格的下一个格子
                if (delCol < posArr[1]) { // 在中心点之前
                    setPosition.x1 = (delCol + 1) * wallWH;
                    setPosition.w1 = (11 - i - 1) * wallWH;
                } else {
                    setPosition.w1 = delCol * wh - setPosition.x1;
                }
            }
            // // 竖线部分
            if (addRow < 0 || addRow > 29 || map[addRow][posArr[1]] == 2) { // 不包含本格的下一个格子
                if (addRow < posArr[0]) { // 在中心点之上
                    setPosition.y2 = (addRow + 1) * wallWH;
                    setPosition.w2 = (11 - i - 1) * wallWH;
                } else {
                    setPosition.w2 = addRow * wh - setPosition.y2;
                }
            }
        }

        checkFun(setPosition, wallWH, bombOpt); // 爆炸影响检测函数

        // 横线生成（需判断当前地图是否有墙的存在）
        // 延时展开
        let timer = () => {
            ctx.fillStyle = `rgba(254,225,0,${opacity})`; // ${1 - index / allWidth}
            // 横线生成（需判断当前地图是否有墙的存在）
            // 注：x - r 其中x是中心点的坐标，可以由此判断出当前所在的格子坐标
            ctx.beginPath();
            ctx.clearRect(setPosition.x1, setPosition.y1, setPosition.w1, wh); // 清除对应部分
            // ctx.globalCompositeOperation = 'source-in';
            ctx.fillRect(setPosition.x1, setPosition.y1, setPosition.w1, wh);
            ctx.closePath();
            // 竖线生成 
            ctx.beginPath();
            ctx.clearRect(setPosition.x2, setPosition.y2, wh, setPosition.w2); // 清除对应部分
            ctx.fillRect(setPosition.x2, setPosition.y2, wh, setPosition.w2);
            ctx.closePath();
            ctx.fill();

            opacity -= 0.01;
            if (opacity < 0) { //透明度为0时消失
                callback && callback();
            } else {
                RAF(timer);
            }
        };

        RAF(timer);
    }
}

export default Canvas