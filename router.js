const express = require('express');
const  router = express.Router();

// 数据库
const mysql = require('mysql');
const conn = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'root',
    database:'node_demo'
});

// 路由监听请求
router.get('/',function(req,res){
    // res.send('基本服务器搭建成功了。');
    if(req.session.isLogin){
        res.render('index',{ 
            isLogin:req.session.isLogin,
            user:req.session.user
        });
    }else{
        res.redirect('/api/login');
    }
});

// 注册页面监听5
router.get('/api/register',function(req,res){
    res.render('register');
});

// 登录页面监听
router.get('/api/login',function(req,res){
    res.render('login');
});

// 注册接口
router.post('/api/register',function(req,res){
    // console.log(req.body);
    const sqlStr = 'SELECT COUNT(*) as count FROM users where users.username= ?';
    // 校验接受的数据
    if(req.body.username.length == 0 || req.body.pwd.length==0 || req.body.nickname.length==0){
        return res.json({
            err_code:1,
            message:'注册信息不完整，请完善',
        })
    }

    // 校验用户名是否已经被注册
    conn.query(sqlStr,req.body.username,function(err,results){
        if(err){
            return res.json({
                err_code:1,
                message:'数据查询失败',
            })
        }else if(results[0].count >= 1){
            return res.json({
                err_code:1,
                message:'用户名已经被注册，请更换一个',
            })
        }
    })

    // 注册信息通过
    const registerstr = 'insert into users set ?';
    conn.query(registerstr,req.body,function(err,results){
        if(err){
            return res.json({
                err_code:1,
                message:'注册失败',
            })
        }else {
            return res.json({
                err_code:0,
                message:results,
            })
        }
    })


})

// 登录接口
router.post('/api/login',function(req,res){
    // console.log(req.body);
    const loginstr = 'SELECT * FROM users WHERE users.username= ? and pwd = ?';
    // 初步判断输入的数据
    if(req.body.username.length == 0 || req.body.pwd.length == 0){
        return res.json({
            err_code:1,
            message:'登录信息输入不完整'
        })
    }

    conn.query(loginstr,[req.body.username,req.body.pwd],function(err,results){
        console.log(results)
        if(err){
            return res.json({
                err_code:1,
                message:'登录失败'
            })
        }else if(results.length != 1){
            return res.json({
                err_code:1,
                message:'登录失败:账户密码错误'
            })
        }else {
            // 登录状态保存
            req.session.isLogin = true;
            // 登录人信息保存
            req.session.user = results[0];
            // console.log(req.session);
            // console.log('_______________')
            return res.json({
                err_code:0,
                message:'登录成功'
            })
        }
    })
})

// 注销接口
router.get('/api/logout',function(req,res){
    // 清除session
    req.session.destroy(function(err){
        // 服务器端跳转方法：
        res.redirect('/');
    });
})

// 暴露路由
module.exports = router;