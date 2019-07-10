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
        // let heroInfo = {
        //     level: 1, // 等级
        //     blood: 10, // 血量
        //     speed: 1, // 移动速度
        // }
        // 在之后生成人物相关信息
        let parentEle = document.getElementsByClassName('otherInfo')[0];
        let heroInfoUl = document.createElement('ul');
        heroInfoUl.classList.add('heroInfo');
        let heroInfo = {};

        [['level', '等级'],['blood', '血量'],['speed', '速度']].forEach(item => {
            heroInfo[item[0]] = {};
            // 创建名字
            heroInfo[item[0]].name = document.createElement('li');
            heroInfo[item[0]].name.innerText = item[1] + '：';
            // 创建对应的信息
            heroInfo[item[0]].info = document.createElement('span');
            heroInfo[item[0]].info.classList.add(item[0]);
            heroInfo[item[0]].name.appendChild(heroInfo[item[0]].info);
            heroInfo[item[0]].info.innerText = opts.hero[item[0]]; // 赋予对应的信息

            heroInfoUl.appendChild(heroInfo[item[0]].name);
        });
        parentEle.appendChild(heroInfoUl);

        this.heroTextEle = heroInfo;
        /**
         *  === 初始的一些参数 ===
         */
        this.drawHero();
    }
    // 开始绘制
    drawHero() {
        let _w = opts.map.wallWH; // 墙的宽高
        let heroAttr = opts.hero; // 英雄的基本属性
        // 初始位置（第几行几列的位置，0 开始）
        let initPos = {
            row: 25, // 行
            col: 25, // 列
        };

        // 保存当前坐标位置（初始化）
        this.movePos = [_w * initPos.col, _w * initPos.row]; // 坐标位置（该坐标为人物左上的坐标位置）
        // 从0开始数，在第几行、第几列、 宽度，高度
        this.wallCanvas.drawHero(...this.movePos, heroAttr.width, heroAttr.height);
    }
    // 移动判断
    heroMove(type) {
        // let _w = opts.map.wallWH; // 墙体的宽高
        let heroAttr = opts.hero; // 英雄的基本属性

        let posObj = move.collideJudgment(...this.movePos, type, heroAttr); // 获取新的位置

        this.wallCanvas.move(...posObj.pos, heroAttr.width, heroAttr.height); // 画布上移动
        this.movePos = posObj.pos; // 改变当前位置的数据（左上坐标，非中心点）
    }
    // 人物受伤后的表现【参数为：伤害量】
    youGetHurt(attack) {
        let heroAttr = opts.hero; // 英雄的基本属性
        opts.hero.blood -= attack; // 减少血量
        this.heroTextEle['blood'].info.innerText = opts.hero.blood;
        // 当受伤时会冒红光【暂封印中】...
        // this.wallCanvas.heroGetHurt(...this.movePos, heroAttr.width, heroAttr.height);
    }
}

export default Hero