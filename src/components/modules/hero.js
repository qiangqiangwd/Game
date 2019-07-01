/**
 *  === 英雄模板 ===
 * 相关参数：
 */
import Canvas from '../../utils/canvas'; // 画布
import opts from '../../utils/public'; // 公共参数的地方
import move from '../../utils/moveJudge'; // 移动判断

class Hero {
    constructor(options = {}) {
        this.options = options;
        // 画布上生成英雄
        this.wallCanvas = new Canvas({
            id: 'Hero'
        });

        /**
         *  === 初始的一些参数 ===
         */
        // 初始位置（第几行几列的位置，0 开始）
        this.initPos = {
            row: 0, // 行
            col: 0, // 列
        };

        this.drawHero();
    }
    // 开始绘制
    drawHero() {
        let _w = opts.map.wallWH; // 墙的宽高
        let heroAttr = opts.hero; // 英雄的基本属性
        // 从0开始数，在第三行、第四列、 宽度，高度
        this.wallCanvas.drawHero(_w * this.initPos.col, _w * this.initPos.row, heroAttr.width, heroAttr.height);

        // 保存当前坐标位置（初始化）
        this.movePos = [_w * this.initPos.col, _w * this.initPos.row]; // 坐标位置（该坐标为人物右上的坐标位置）
    }
    // 移动判断
    heroMove(type) {
        // let _w = opts.map.wallWH; // 墙体的宽高
        let heroAttr = opts.hero; // 英雄的基本属性

        let arr = move.collideJudgment(this.movePos[0], this.movePos[1], type, heroAttr); // 获取新的位置

        this.wallCanvas.move(...arr, heroAttr.width, heroAttr.height); // 画布上移动
        this.movePos = arr; // 保存当前位置
    }
}

export default Hero