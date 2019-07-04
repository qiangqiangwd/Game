/**
 * === 炸弹 boom！
 */

import Canvas from '../../utils/canvas'
import opts from '../../utils/public'; // 公共参数的地方
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

class bomb {
    constructor(options = {}) {
        this.bombCanvas = new Canvas({
            id: 'bomb'
        });

        this.bombArr = [];
    }
    // 生成一个
    creatOne(x, y) {
        let hero = opts.hero;
        let [hW, hH] = [hero.width, hero.height];
        let bombObj = {
            x: x + (hW / 2),
            y: y + (hH / 2),
            timer: 2, // 爆炸剩余时间
            // radius: (hW * 0.8) / 2, // 半径为人物宽度0.8倍的一半
            radius: hW / 2, // 半径为人物的一半(后面也许有改动)
            id: (new Date).getTime(), // 唯一性的id【时间戳】
            attack: 1,// 伤害
            bombRange: 11, // 爆炸的范围
        }

        // 每个炸弹都设定一个定时器，到时间后消失
        let underTime = setInterval(() => {
            let t = bombObj.timer;
            if (t > 1) {
                bombObj.timer--; // 时间减1
                this.bombCanvas.drawBomb(this.bombArr); // 重新绘制
            } else {
                this.deletOneById(bombObj);
                clearInterval(underTime);
            }
        }, 1000);
        bombObj.underTime = underTime; // 保存当前计时器（后面清空时会用）
        // 炸弹均默认 4s 后爆炸
        this.bombArr.push(bombObj);
        this.bombCanvas.drawBomb(this.bombArr); // 创建一个
    }
    // 删除其中一个炸弹【在外体现为爆炸】
    deletOneById(bombOpt) {
        let _this = this;
        let arr = this.bombArr;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == bombOpt.id) {
                // 在爆炸完后刷新下现有炸弹
                this.bombCanvas.boomStyle(bombOpt, this.checkBoomEffect.bind(this), () => {
                    this.bombCanvas.drawBomb(this.bombArr); // 重新绘制
                }); //爆炸效果及炸弹消失

                this.bombArr.splice(i, 1); // 删除该条数据
                break;
            }
        }
    }
    // 爆炸判断
    checkBoomEffect(bombPos, wh, bombOpt) {
        // console.log('范围数据',bombPos);
        let boomRange = {
            // 横向部分
            hMinY: bombPos.y1,
            hMaxY: bombPos.y1 + wh,
            hMinX: bombPos.x1,
            hMaxX: bombPos.x1 + bombPos.w1,
            // 竖向部分
            vMinY: bombPos.y2,
            vMaxY: bombPos.y2 + bombPos.w2,
            vMinX: bombPos.x2,
            vMaxX: bombPos.x2 + wh,
        }
        // 人物爆炸时的判断（是否有被炸到）【前面为当前坐标，后面为其他信息、宽高血量等】
        if (this._boomCheck(Game.hero.movePos, opts.hero, boomRange)) {
            Game.hero.youGeturt(bombOpt.attack);
        }
    }
    // 是否命中的关键就是双方范围是否有交集
    _boomCheck(pos, info, boomRange) {
        // debugger
        // x轴范围的，y轴范围
        let [xArr, yArr] = [
            [pos[0], pos[0] + info.width],
            [pos[1], pos[1] + info.height]
        ];
        // 横轴部分判断
        let xCheck1 = xArr.filter(item => item >= boomRange.hMinX && item <= boomRange.hMaxX);
        let yCheck1 = yArr.filter(item => item >= boomRange.hMinY && item <= boomRange.hMaxY);
        // 竖轴部分判断
        let xCheck2 = xArr.filter(item => item >= boomRange.vMinX && item <= boomRange.vMaxX);
        let yCheck2 = yArr.filter(item => item >= boomRange.vMinY && item <= boomRange.vMaxY);

        return xCheck1.length > 0 && yCheck1.length > 0 || xCheck2.length > 0 && yCheck2.length > 0
    }
    // 清除所有
    clearAll() {
        this.bombArr.forEach(item => {

        });
    }
}

export default bomb