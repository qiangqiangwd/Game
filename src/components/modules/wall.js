
/**
 *  === 墙体部分 ===
 * 相关参数：
 * id:canvas对应id 默认 'Wall'
 */
import Canvas from '../../utils/canvas';
import publicOptions from '../../utils/public'; // 公共参数的地方

import _ from 'lodash'; // 相关文档 https://www.lodashjs.com/docs/latest
import wallJson from '../../utils/mapWallOptions'; // 地图数据


class wall {
    constructor(options = {}) {
        this.options = options;
        let id = options.id || 'Wall';

        // 生成墙
        this.wallCanvas = new Canvas({
            id: id
        });

        this.drawWall();
    }
    // 开始绘制地图
    drawWall() {
        let map = publicOptions.map; // 获取关卡信息
        
        let content = [];
        content.length = 900; // 生成900个空值得数组
        content = _.fill(content, '1');
        content = _.chunk(content, 30);

        // 根据当前关卡等级获取对应地图的数据并改变
        let mapOpts = wallJson[map.level - 1].content;
        mapOpts.forEach(item => {
            let arr = item.split('-');
            content[arr[0]][arr[1]] = arr[2];
        });
        // 保存当前关卡的总的数据到公共地图参数中
        if (wallJson[map.level - 1].allContentArr && wallJson[map.level - 1].allContentArr.length <= 0){
            wallJson[map.level - 1].allContentArr = content;
        }

        // 开始绘制地图
        content.forEach((item,index) => {
            item.forEach((itm,idx)=>{
                // x轴、y轴、宽度、高度、类型
                this.wallCanvas.writeWall(idx * map.wallWH, index * map.wallWH, map.wallWH, map.wallWH, itm);
            });
        });
    }
}

export default wall