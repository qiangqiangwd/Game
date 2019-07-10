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
    // 人物当前 环绕的格子的信息
    nearbyGridInfo: {},
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

        this.nearbyGridInfo = this._getNearGrideInfo(this.row, this.col, _wh);
        // 参数分别为：x轴位置、y轴位置（左上位置的）、速度、墙体宽高、本身宽、本身高
        return this[type](x, y, _s, _w, _h);
    },
    // 获取人物当前 环绕的格子的信息 【围绕的一共有八个】
    _getNearGrideInfo(row, col, _wh) {
        let mapConent = map[opts.map.level - 1].allContentArr;
        let [rowDel, rowAdd, colDel, colAdd] = [
            row - 1 > 0 ? row - 1 : '0',
            row + 1 > 29 ? '' + opts.height : row + 1,
            col - 1 > 0 ? col - 1 : '0',
            col + 1 > 29 ? '' + opts.width : col + 1,
        ];
        return {
            // 上方
            T: {
                row: rowDel,
                col: col,
                mapType: typeof rowDel == 'string' ? '2' : mapConent[rowDel][col],
                // btnXL: _wh * col, // 底部x（靠左）
                btnY: typeof rowDel == 'string' ? Number(rowDel) : (_wh * rowDel + _wh), // 底部y
            },
            // 左上方
            LT: {
                row: rowDel,
                col: colDel,
                mapType: (typeof colDel == 'string' || typeof rowDel == 'string') ? '2' : mapConent[rowDel][colDel], // 类型
                btnXR: typeof colDel == 'string' ? Number(colDel) : (_wh * colDel + _wh), // 底部x（靠右）
                btnY: typeof rowDel == 'string' ? Number(rowDel) : (_wh * rowDel + _wh), // 底部y
            },
            // 右上方
            RT: {
                row: rowDel,
                col: colAdd,
                mapType: (typeof colAdd == 'string' || typeof rowDel == 'string') ? '2' : mapConent[rowDel][colAdd], // 类型
                btnXL: typeof colAdd == 'string' ? Number(colAdd) : _wh * colAdd, // 底部x（靠左）
                btnY: typeof rowDel == 'string' ? Number(rowDel) : (_wh * rowDel + _wh), // 底部y
            },
            // 左方
            L: {
                row: row,
                col: colDel,
                mapType: typeof colDel == 'string' ? '2' : mapConent[row][colDel], // 类型
                btnXR: typeof colDel == 'string' ? Number(colDel) : _wh * colDel + _wh, // 底部x（靠右）
                // btnY: _wh * rowDel + _wh, // 底部y
            },
            // 左下方
            LB: {
                row: rowAdd,
                col: colDel,
                mapType: (typeof colDel == 'string' || typeof rowAdd == 'string') ? '2' : mapConent[rowAdd][colDel], // 类型
                topXR: typeof colDel == 'string' ? Number(colDel) : _wh * colDel + _wh, // 顶部x（靠右）
                topY: typeof rowAdd == 'string' ? Number(rowAdd) : _wh * rowAdd, // 顶部y
            },
            // 正下方
            B: {
                row: rowAdd,
                col: col,
                mapType: typeof rowAdd == 'string' ? '2' : mapConent[rowAdd][col], // 类型
                // topXL: _wh * colDel + _wh, // 顶部x（靠右）
                topY: typeof rowAdd == 'string' ? Number(rowAdd) : _wh * rowAdd, // 顶部y
            },
            // 右下方
            RB: {
                row: rowAdd,
                col: colAdd,
                mapType: (typeof colAdd == 'string' || typeof rowAdd == 'string') ? '2' : mapConent[rowAdd][colAdd], // 类型
                topXL: typeof colAdd == 'string' ? Number(colAdd) : _wh * colAdd, // 顶部x（靠左）
                topY: typeof rowAdd == 'string' ? Number(rowAdd) : _wh * rowAdd, // 顶部y
            },
            // 右方
            R: {
                row: row,
                col: colAdd,
                mapType: typeof colAdd == 'string' ? '2' : mapConent[row][colAdd], // 类型
                topXL: typeof colAdd == 'string' ? Number(colAdd) : _wh * colAdd, // 顶部x（靠左）
                // topY: _wh * rowAdd, // 顶部y
            },
            // 本身（中心点）所在表格
            self:{
                mapType: mapConent[row][col], // 类型
            }
        }
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
    top(x, y, _s, _w, _h) {
        let gride = this.nearbyGridInfo; //环绕的格子信息
        let delY = y - _s; // 下一次移动后的位置
        let resType = 2;
        if (delY >= 0) {
            let checkFlag = name =>{
                resType = gride[gride[name].btnY < delY ? 'self' : name].mapType; 
                return (gride[name].mapType == 1 || gride[name].btnY <= delY)// 获取当前所在类型
            }; // 上移判断：可通行或者小于顶部距离
            // 先判断是否有涉及到右边一格的位置，有的话判断右边上面那格是否可以通过，
            // 可以就继续判断所在的上一格位置是否可以通过
            let flag = (x + _w) > gride.RT.btnXL ? (checkFlag('RT') && checkFlag('T')) // 在右侧，可通行或右上底部y小于y
                : (x < gride.LT.btnXR ? (checkFlag('LT') && checkFlag('T')) : checkFlag('T'));   // 在左侧，

            if (flag) {
                y -= _s;
            } else {
                y = gride.T.btnY;
            }
        } else {
            y = 0;
        }
        return {
            pos: [x, y],
            mapType: resType
        }
    },
    // 下移：
    down(x, y, _s, _w, _h) {
        let gride = this.nearbyGridInfo; //环绕的格子信息
        let addY = y + _s + _h; // 下一次移动后的位置，需加上本身的高度
        let resType = 2;

        if (addY <= opts.height) {
            let checkFlag = name =>{
                resType = gride[gride[name].topY > addY ? 'self':name].mapType; 
                return (gride[name].mapType == 1 || gride[name].topY >= addY); // 下移判断：可通行或者小于底部距离
            }

            let flag = (x + _w) > gride.RB.topXL ? (checkFlag('RB') && checkFlag('B')) // 在右侧，可通行或右上底部y小于y
                : (x < gride.LB.topXR ? (checkFlag('LB') && checkFlag('B')) : checkFlag('B'));   // 在左侧，

            if (flag) {
                y += _s;
            } else {
                y = gride.B.topY - _h;
            }

        } else {
            y = opts.height - _h;
        }
        return {
            pos: [x, y],
            mapType: resType
        }
    },
    // 左移
    left(x, y, _s, _w, _h) {
        let gride = this.nearbyGridInfo; //环绕的格子信息
        let delX = x - _s; // 下一次移动后的位置
        let resType = 2;

        if (delX >= 0) {
            let XR = gride.LT.btnXR; // 获取左边格子右侧 x 坐标
            let checkFlag = name => {
                resType = gride[XR < delX ? 'self' : name].mapType; 
                return (gride[name].mapType == 1 || XR <= delX); // 下移判断：可通行或者小于底部距离
            }

            let flag = y < gride.LT.btnY ? (checkFlag('LT') && checkFlag('L')) // 在右侧，可通行或右上底部y小于y
                : ((y + _h) > gride.LB.topY ? (checkFlag('LB') && checkFlag('L')) : checkFlag('L'));   // 在左侧，

            if (flag) {
                x -= _s;
            } else {
                x = XR;
            }
        } else {
            x = 0;
        }
        return {
            pos: [x, y],
            mapType: resType
        }
    },
    // 右移
    right(x, y, _s, _w, _h) {
        let gride = this.nearbyGridInfo; //环绕的格子信息
        let addX = x + _s + _w; // 下一次移动后的位置
        let resType = 2;

        if ((x + _s + _w) <= opts.width) {
            let XL = gride.RT.btnXL; // 获取左边格子右侧 x 坐标
            let checkFlag = name =>{
                resType = gride[XL > addX ? 'self' : name].mapType; 
                return (gride[name].mapType == 1 || XL >= addX); // 下移判断：可通行或者小于底部距离
            }

            let flag = y < gride.RT.btnY ? (checkFlag('RT') && checkFlag('R')) // 在右侧，可通行或右上底部y小于y
                : ((y + _h) > gride.RB.topY ? (checkFlag('RB') && checkFlag('R')) : checkFlag('R'));   // 在左侧，

            if (flag) {
                x += _s;
            } else {
                x = XL - _w;
            }
        }else{
            x = opts.width - _w;
        }
        return {
            pos: [x, y],
            mapType: resType
        }
    },
}