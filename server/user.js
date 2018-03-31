const express = require("express")
const utils = require("utility")

const Router = express.Router()
const model = require("./model")
const User = model.getModel('user')
const Chat = model.getModel('chat')
const _filter = {'pwd': 0, '__v': 0}  //表示pwd和__v字段不显示

Router.get('/list', function (req, res) {
    const {type} = req.query
    User.find({type}, function (err, doc) {
        return res.json({code: 0, data: doc})
    })
})

Router.get('/msglist', function (req, res) {
    const userid = req.cookies.userid
    User.find({}, function (err, doc) {
        let users = {}
        doc.forEach(item => {
            users[item._id] = {name: item.user, avatar: item.avatar}
        })
        Chat.find({'$or': [{from: userid}, {to: userid}]}, function (err, doc) {
            if (!err) {
                return res.json({code: 0, msgs: doc, users: users})
            }
        })
    })
})

Router.get('/info', function (req, res) {
    const {userid} = req.cookies
    if (!userid) {
        return res.json({code: 1})
    }
    User.findOne({_id: userid}, _filter, function (err, doc) {
        if (err) {
            return res.json({code: 1, msg: "后端出错了"})
        }
        if (doc) {
            return res.json({code: 0, data: doc})
        }
    })
})


Router.post('/login', function (req, res) {
    const {user, pwd} = req.body
    User.findOne({user, pwd: md5Pwd(pwd)}, _filter, function (err, doc) {
        if (!doc) {
            return res.json({code: 1, msg: "用户名或者密码错误"})
        }
        res.cookie('userid', doc._id)
        return res.json({code: 0, data: doc})
    })
})

Router.post('/register', function (req, res) {
    const {user, pwd, type} = req.body
    console.log("user", user)
    User.findOne({user}, function (err, doc) {
        if (doc) {
            return res.json({code: 1, msg: "用户名重复"})
        }
        const userModel = new User({user, type, pwd: md5Pwd(pwd)})
        userModel.save(function (err, doc) {
            if (err) {
                return res.json({code: 1, msg: "后端出错了"})
            }
            const {user, type, _id} = doc
            res.cookie('userid', _id)
            return res.json({code: 0, data: {user, type, _id}})
        })
    })
})

Router.post('/update', function (req, res) {
    const {userid} = req.cookies
    if (!userid) {
        return res.json({code: 1, msg: "用户不存在"})
    }
    const body = req.body
    User.findByIdAndUpdate(userid, body, function (err, doc) {
        const data = Object.assign({}, {
            user: doc.user,
            type: doc.type
        }, body)
        return res.json({code: 0, data})
    })
})


//关闭聊天页面的时候 把聊天者发送给我的消息全部设为已读
Router.post('/msg', function (req, res) {
    const userid = req.cookies.userid
    const {from} = req.body
    Chat.update(
        {from, to: userid},
        {'$set': {read: true}},
        {'multi': true},
        function (err, doc) {
            console.log('readmsg', doc)
            if (!err) {
                return res.json({code: 0, num: doc.nModified})
            }
            return res.json({code: 1, msg: '修改失败'})
        }
    )
})


//加密方式密码加盐两次MD5
function md5Pwd(pwd) {
    const SALT = 'imooc_is_good_qinzhen0001zxcasd!@#IUHJh~'
    return utils.md5(utils.md5(pwd + SALT))
}

module.exports = Router