/**
 * === 怪物相关
 */

import Canvas from '../../utils/canvas'; // 画布
import opts from '../../utils/public'; // 公共参数的地方
import moveJudge from '../../utils/moveJudge'; // 移动判断

class monster {
    constructor(options) {
        this.options = options;
        // 画布上生成英雄
        this.wallCanvas = new Canvas({
            id: 'monster'
        });

        this.drawMonster();
    }
    // 绘制
    drawMonster() {
        let _w = opts.map.wallWH; // 墙的宽高
        let heroAttr = opts.hero; // 英雄的基本属性
        // 获取当前初始位置（第几行几列的位置，0 开始）
        let initPos = [
            {
                row: 3, // 行
                col: 2, // 列
            },
        ];

        this.movePos = [];
        initPos.forEach(item => {
            // 保存当前坐标位置（初始化）
            this.movePos.push([_w * item.col, _w * item.row]); // 坐标位置（该坐标为人物右上的坐标位置）
        });
        console.log(this.movePos)
        // 进行绘制
        this.wallCanvas.drawMonster(this.movePos, heroAttr.width, heroAttr.height);

        this.monsterMoveCheck(); // 行走判断
    }
    monsterMoveCheck() {
        let hAttr = opts.hero; // 人物相关属性
        // 循环生成动画所调用的函数
        let RAF = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                }
        })();

        let move = () => {
            let hero = Game.hero.movePos; // 人物当前位置
            let movePos = this.movePos; // 怪兽当前位置
            // 若地图上无怪兽后
            if (movePos.length <= 0) return
            movePos.forEach((item, index) => {
                let mWH = 10; // 怪物宽高
                let speed = 0.5; // 怪物移速
                // debugger
                // 是否在同一直线
                // 最左x和最右x是否在人物x对应的范围内
                if (item[0] + mWH < hero[0] + hAttr.width || item[0] > hero[0]) { // 先横线行驶
                    let gogogo = moveJudge.collideJudgment(...item, item[0] > hero[0] ? 'left' : 'right', hAttr); // 判断当前行进方向是否可行进

                    if (gogogo.mapType == 2) { // 若不可行则上下移动
                        movePos[index][1] = item[1] > hero[1] ? item[1] - speed : item[1] + speed; // 上下
                    } else {
                        movePos[index][0] = item[0] > hero[0] ? item[0] - speed : item[0] + speed; // 左右
                    }
                } else if (item[1] > hero[1] || item[1] + mWH < hero[1] + hAttr.height) { // 纵线撞人（...
                    let gogogo = moveJudge.collideJudgment(...item, item[1] > hero[1] ? 'top' : 'down', hAttr); // 判断当前行进方向是否可行进
                   
                    if (gogogo.mapType == 2) { // 若不可行则上下移动
                        movePos[index][0] = item[0] > hero[0] ? item[0] - speed : item[0] + speed; // 左右
                    } else {
                        movePos[index][1] = item[1] > hero[1] ? item[1] - speed : item[1] + speed; // 上下
                    }
                }
            });
            // console.log(movePos);
            this.movePos = movePos;

            this.wallCanvas.drawMonster(this.movePos, hAttr.width, hAttr.height);
            // setTimeout(() => {}, 500);
            // RAF(move);
        }

        RAF(move);
    }
}

export default monster