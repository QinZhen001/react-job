const express = require("express")
const utils = require("utility")

const Router = express.Router()
const model = require("./model")
const User = model.getModel('user')
const _filter = {'pwd': 0, '__v': 0}  //表示pwd和__v字段不显示

Router.get('/list', function (req, res) {
    User.find({}, function (err, doc) {
        return res.json(doc)
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


//加密方式密码加盐两次MD5
function md5Pwd(pwd) {
    const SALT = 'imooc_is_good_qinzhen0001zxcasd!@#IUHJh~'
    return utils.md5(utils.md5(pwd + SALT))
}

module.exports = Router