const express = require('express');
const server = express();
const session = require("express-session");  //session
// const ejs = require('ejs');

// 注册seeion
server.use(session({
    // cookieName: 'session',  
    secret: 'random_string_goes_here', //一个随机字符串，因为客户端的数据都是不安全的，所以需要进行加密
    duration: 30*60*1000, //session的过期时间，过期了就必须重新设置
    // activeDuration: 5* 60*1000, // 激活时间，比如设置为30分钟，那么只要30分钟内用户有服务器的交互，那么就会被重新激活。
}))

// 配置bodyparser
const bodyparser = require('body-parser');
server.use(bodyparser.urlencoded({ extended: false }));

// 配置模板引擎：
server.set('view engine','ejs');
server.set('View','./views');

// 静态资源托管：
server.use('/node_modules',express.static('./node_modules'));

// 导入自己注册的路由：
const router = require('./router.js'); 
server.use(router);

// server.get('/',function(req,res){
//     res.send('基本服务器搭建成功了。');
// })

server.listen('3002',function(){
    console.log('服务器启动了');
});