/**
 * 存放公共参数的地方
 */

export default {
    /**
     * === 地图相关 ===
     */
    map: {
        level: 1, // 关卡等级，从 1 开始
        wallWH: 0, // 墙体每格的宽高 （宽高是一致的）
    },
    /**
     * === 英雄人物相关 ===
     */
    hero:{
        level:1, // 等级
        blood:10, // 血量
        speed:1, // 移动速度
        attack:1, // 攻击力
        width:0, // 宽度 （默认 人物的宽高和墙体宽高一致）
        height:0, // 高度
    },
    // 最外层的盒子的相关数据
    outerElement:null, // 对应元素
    // 宽高
    width:0,
    height:0,
}
