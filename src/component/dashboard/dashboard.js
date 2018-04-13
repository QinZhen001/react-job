import React from 'react'
import {connect} from 'react-redux'
import {NavBar} from 'antd-mobile'
import NavTabBar from '../navtabbar/navtabbar'
import Genius from '../genius/genius'
import Boss from '../boss/boss'
import {Switch, Route} from 'react-router-dom'
import User from '../user/user'
import Msg from '../msg/msg'
import {getMsgList, recvMsg} from '../../redux/chat.redux'
import QueueAnim from 'rc-queue-anim'


@connect(
    state => state,
    {getMsgList, recvMsg}
)
class Dashboard extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        if (!this.props.chat.chatmsg.length) {
            this.props.getMsgList()
            this.props.recvMsg()
        }
    }

    render() {
        const user = this.props.user
        const navList = [
            {
                path: '/boss',
                text: '牛人',
                icon: 'boss',
                title: '牛人列表',
                component: Boss,
                hide: user.type === 'genius'
            },
            {
                path: '/genius',
                text: 'boss',
                icon: 'job',
                title: 'BOSS列表',
                component: Genius,
                hide: user.type === 'boss'
            },
            {
                path: '/msg',
                text: '消息',
                icon: 'msg',
                title: '消息列表',
                component: Msg
            },
            {
                path: '/me',
                text: '我',
                icon: 'user',
                title: '个人中心',
                component: User
            }
        ]
        const {pathname} = this.props.location
        console.log("this.props.location", this.props.location)
        const page = navList.find(item => item.path == pathname)
        return (
            <div>
                <NavBar className="fixed-header" mode="dark">
                    {page ? page.title : ''}
                </NavBar>
                <div style={{marginTop: 45}}>
                    {/*<QueueAnim type={"scaleX"} duration={500}>*/}
                    {/*<Route key={page.path} path={page.path} component={page.component}>*/}
                    {/*</Route>*/}
                    {/*</QueueAnim>*/}
                </div>
                <NavTabBar data={navList}>
                </NavTabBar>
            </div>
        )
    }
}

export default Dashboard