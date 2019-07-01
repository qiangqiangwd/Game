
// 获取所有显示模型
import modules from '../components/index'
import publicOptions from './public'; // 公共参数的地方

class GameInit{
    constructor(){
        /**
         * 注意：该部分的初始化只会加载一次
         *  */
        // 外层盒子、画布等公共参数设置
        this.outerBoxInit();
        // 初始化墙体
        // console.log(modules);
        this.wall = new modules.wall();
        // 生成英雄人物
        this.hero = new modules.hero();

        this.useKeyboard();
    }
    // 最外层进行初始化
    outerBoxInit(){
        let element = document.createElement('div');
        element.classList.add('hello'); // 给该dom元素添加 class
        element.setAttribute('id', 'Game'); //  最外层添加 id Game
        document.body.appendChild(element); // body中添加最外层

        publicOptions.outerElement = element; // 保存最外层盒子

        // 游戏的显示部分必须保持 1:1 的宽高，所以选取盒子宽高中最小的值为画布的宽高
        let setNum = element.offsetWidth >= element.offsetHeight ? element.offsetWidth : element.offsetHeight;
        publicOptions.width = publicOptions.height = setNum;
        /**
         * 地图参数部分修改
         */
        let wallWH = (setNum / 30);
        // 注：墙体的宽高由最外层盒子的宽（高）/30,30是由于地图是由 30*30 的格子组成的（暂不支持修改，懒~）
        publicOptions.map.wallWH = wallWH; // 墙体的宽高

        /**
         * 英雄人物角色的修改
         */
        // 宽高设置
        if (publicOptions.hero.width <= 0 && publicOptions.hero.height <= 0){
            publicOptions.hero.width = publicOptions.hero.height = wallWH;
        }
    }

    // 使用键盘
    useKeyboard() {
        // 设置键盘点击事件
        document.addEventListener('keydown', (event) => {
            let keyCode = event.keyCode;
            // console.log('点击了按键:', event.keyCode);//弹出按键的对应值 
            switch (keyCode) {
                case 38: // 英雄上移
                    this.hero.heroMove('top');
                    break
                case 40: // 英雄下移
                    this.hero.heroMove('down');
                    break
                case 37: // 英雄左移
                    this.hero.heroMove('left');
                    break
                case 39: // 英雄右移
                    this.hero.heroMove('right');
                    break
            }
        });
    }
}

export default GameInit