
/**
 * === 该部分用于将所有组件整合成一个集合 ===
 */
const modules = {}; // 所有的模型

// 使用webpack提供的API，构造一个上下文files，相当于引入modules文件夹下所有js文件
// 具体文档请参照：
// 通过下面奇怪的写法，就不用一个一个引入模块了
const files = require.context('./modules', false, /\.js$/); // 搜寻所有js文件

// 由该方法获得 modules 下的js文件，注：只能获取第一级下的js文件，多级以下无法获取
files.keys().forEach(key => {
    // 前面为获取文件名，后面为其内容
    modules[key.replace(/(\.\/|\.js)/g,'')] = files(key).default;
});


export default modules