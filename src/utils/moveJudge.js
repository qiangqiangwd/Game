/**
 * === 该部分为移动判断部分，会根据多重因素返回不同的结果 ===
 * 
 */

import opts from './public'; // 公共参数的地方
import map from './mapWallOptions';

export default {
    // 私有参数部分
    // 中心点信息
    x0: null,
    y0: null,
    // 当前所在 行列（以中心点为基准）
    row: null,
    col: null,
    // 本身的属性
    _attr: {},
    // 移动碰撞判断 当前x轴、y轴、自身属性 
    collideJudgment(x, y, type, attr = {}) {
        let [_w, _h, _s] = [
            attr.width, attr.height, attr.speed
        ];
        this._attr = attr;

        let _wh = opts.map.wallWH; // 墙体的宽高
        // 获取当前中心点位置
        this.x0 = x + (_w / 2);
        this.y0 = y + (_h / 2);
        // 所在行列
        this.row = Math.floor(this.y0 / _wh);
        this.col = Math.floor(this.x0 / _wh);

        // 参数分别为：x轴位置、y轴位置（左上位置的）、速度、墙体宽高、本身宽、本身高
        return this[type](x, y, _s, _wh, _w, _h);
    },
    /**
     * 因为人物不能超出盒子最外围，所以最基本的判断为：
     * 上移时：y - 速度 >= 0
     * 下移时：y + 速度 + 本身的高度 >= 盒子的高度
     * 左移时：x - 速度 >= 0
     * 右移时：x + 速度 + 本身的宽度 >= 盒子的宽度
     *
     * === 进阶判断（根据当前关卡的等级）：
     * 地图中会存在墙体等障碍物，会造成禁止通行或减速等操作，此时需要进行判断
     * 先获取当前所在的 行列（以人物中心点为基准）
     * 详细规则见下面注释
     */
    // 上移: y0 >= 
    top(x, y, _s, wh, _w, _h) {
        let row = this.row - 1 < 0 ? 0 : this.row - 1; // 本身上一个行
        let col = this.col + 1 > 29 ? 29 : this.col + 1; // 下一个列

        let xw = col * wh; // 上一行的底部最右 x坐标
        let mapType1 = map[opts.map.level - 1].allContentArr[row][col]; // 获取右边上个格子的类型

        let yh = row * wh + wh; // 上一行的底部 y坐标
        let mapType2 = map[opts.map.level - 1].allContentArr[row][this.col]; // 获取上个格子的类型
        if (y - _s >= 0) {
            // 先判断是否有涉及到右边一格的位置，有的话判断右边上面那格是否可以通过，
            // 可以就继续判断所在的上一格位置是否可以通过
            let flag = (x + _w) > xw ? (mapType1 == 1 && (mapType2 == 1 || (y - _s - yh) >= 0)) : (mapType2 == 1 || (y - _s - yh) >= 0);
            if (flag) {
                y -= _s;
            } else {
                y = yh;
            }
        } else {
            y = 0;
        }
        return [x, y]
    },
    // 下移：
    down(x, y, _s, wh, _w, _h) {
        let row = this.row - 1 < 0 ? 0 : this.row - 1; // 本身下一个行
        let col = this.col + 1 > 29 ? 29 : this.col + 1; // 下一个列

        let xw = col * wh; // 下一行的底部最右 x坐标
        let mapType1 = map[opts.map.level - 1].allContentArr[row][col]; // 获取右边下个格子的类型

        let yh = row * wh + wh; // 下一行的底部 y坐标
        let mapType2 = map[opts.map.level - 1].allContentArr[row][this.col]; // 获取下个格子的类型

        if ((y + _s + _h) <= opts.height) {
            y += _s;
        } else {
            y = opts.height;
        }
        return [x, y]
    },
    // 左移
    left(x, y, _s, wh, _w, _h) {
        if (x - _s >= 0) {
            x -= _s;
        } else {
            x = 0;
        }
        return [x, y]
    },
    // 右移
    right(x, y, _s, wh, _w, _h) {
        if ((x + _s + _w) <= opts.width) {
            x += _s;
        }
        return [x, y]
    },
}