

import GameInit from './utils/init'; // 初始化的地方
import './style/main.less';
import publicOptions from './utils/public'; // 公共参数的地方

let Game = null;
// 开始进行初始化
window.Game = new GameInit();

// if (module.hot) {
//     module.hot.accept('./utils/init.js', function () {
//         document.body.removeChild(publicOptions.outerElement); // 先清除在重新添加
//         Game = new GameInit();
//     });
// }