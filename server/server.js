const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const model = require('./model')
const Chat = model.getModel('chat')
// work with express
const path = require('path')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

//hook放前面(在import App之前)
import csshook from 'css-modules-require-hook/preset'
import assethook from 'asset-require-hook'
assethook({
    extensions: ['png'],
    limit: 8000
})

import {renderToString, renderToNodeStream} from 'react-dom/server'
import React from 'react'
import {Provider} from 'react-redux'
import App from '../src/app.js'
import {StaticRouter} from 'react-router-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import reducers from '../src/redux/reducer'
import thunk from 'redux-thunk'
import staticPath from '../build/asset-manifest.json'   //这里有css 和 js 文件的动态路径

// console.log(staticPath)

// function pp() {
//     return (
//         <div>
//             <p>server render</p>
//             <p>imooc rocks!</p>
//         </div>
//     )
// }
// console.log(renderToString(<pp/>))


//io是全局 socket是本次链接
io.on('connection', function (socket) {
    console.log("socket.io connect")
    socket.on("sendmsg", function (data) {
        const {from, to, msg} = data
        const chatid = [from, to].sort().join('_')
        Chat.create({chatid, from, to, content: msg}, function (err, doc) {
            io.emit('recvmsg', Object.assign({}, doc._doc))
        })
    })
})


const userRouter = require('./user')

app.use(cookieParser())
app.use(bodyParser.json())
app.use('/user', userRouter)

app.use(function (req, res, next) {
    if (req.url.startsWith('/user/') || req.url.startsWith('/static/')) {
        return next()
    }

    const context = {}
    const store = createStore(reducers, compose(
        applyMiddleware(thunk),
    ))

    const markup = renderToString(
        (<Provider store={store}>
            <StaticRouter
                location={req.url}
                context={context}
            >
                <App></App>
            </StaticRouter>
        </Provider>)
    )

    //骨架 (可以在这里做SEO)
    const pageHtml = `
    <!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
  <meta name="theme-color" content="#000000">
  <meta name="keywords" content="React,Redux,Imooc,聊天，SSR">
  <title>React App</title>
  <link rel="stylesheet" href="${staticPath["main.css"]}">
</head>
<body>
<noscript>
  You need to enable JavaScript to run this app.
</noscript>
<div id="root">${markup}</div>

</body>
<script src="${staticPath["main.js"]}"></script>
</html>
`


    res.send(pageHtml)
})

app.use('/', express.static(path.resolve('build')))


server.listen(9093, function () {
    console.log('Node app start at port 9093')
})