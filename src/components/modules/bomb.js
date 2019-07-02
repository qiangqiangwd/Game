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
            timer: 4, // 爆炸剩余时间
            // radius: (hW * 0.8) / 2, // 半径为人物宽度0.8倍的一半
            radius: hW / 2, // 半径为人物的一半
            id: (new Date).getTime(), // 唯一性的id【时间戳】
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
    deletOneById(opts) {
        let _this = this;
        let arr = this.bombArr;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == opts.id){
                // 在爆炸完后刷新下现有炸弹
                this.bombCanvas.boomStyle(opts.x, opts.y, opts.radius,()=>{
                    _this.bombCanvas.drawBomb(this.bombArr); // 重新绘制
                }); //爆炸效果及炸弹消失
                this.bombArr.splice(i,1); // 删除该条数据
                break;
            }
        }
    }
    // 清除所有
    clearAll() {
        this.bombArr.forEach(item => {

        });
    }
}

export default bomb