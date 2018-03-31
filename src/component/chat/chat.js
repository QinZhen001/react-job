import React from 'react'
import {List, InputItem, NavBar, Icon, Grid} from 'antd-mobile'
import {connect} from 'react-redux'
import {getMsgList, sendMsg, recvMsg, readMsg} from '../../redux/chat.redux'
import {EMOJI} from '../../constant/constant'
import {getChatId} from '../../util/util'
import QueueAnim from 'rc-queue-anim'

@connect(
    state => state,
    {getMsgList, sendMsg, recvMsg, readMsg}
)
class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            msg: [],
            showEmoji: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleEmojiClick = this.handleEmojiClick.bind(this)
        this.back = this.back.bind(this)
    }

    componentDidMount() {
        console.log("重新绑定")
        if (!this.props.chat.chatmsg.length) {
            this.props.getMsgList()
            this.props.recvMsg()
        }
    }

    componentWillUnmount() {
        const to = this.props.match.params.user
        this.props.readMsg(to)
    }


    handleEmojiClick() {
        this.setState(preState => ({
            showEmoji: !preState.showEmoji
        }))
        this.fixCarousel()
    }

    fixCarousel() {
        setTimeout(function () {
            window.dispatchEvent(new Event('resize'))
        }, 0)
    }

    handleSubmit() {
        const from = this.props.user._id
        const to = this.props.match.params.user
        const msg = this.state.text
        this.props.sendMsg({from, to, msg})
        this.setInitState()
    }

    setInitState() {
        this.setState({
            text: '',
            showEmoji: false
        })
    }

    back() {
        this.props.history.goBack()
    }

    render() {
        const chatterId = this.props.match.params.user
        const users = this.props.chat.users

        if (!users[chatterId]) {
            return null
        }
        //filter(v => v) 为了除去一些无法显示的 一些为空的表情
        const emoji = EMOJI.split(' ').filter(v => v && v !== '🙃').map(v => ({text: v}))
        const Item = List.Item
        const chatid = getChatId(chatterId, this.props.user._id)
        const chatMsgs = this.props.chat.chatmsg.filter(v => v.chatid === chatid)
        // console.log('chatMsgs', chatMsgs);
        return (
            <div id='chat-page'>
                <NavBar mode="dark"
                        icon={<Icon type="left"/>}
                        onLeftClick={this.back}
                >
                    {users[chatterId].name}
                </NavBar>
                <QueueAnim delay={50}>
                    {chatMsgs.map(v => {
                        const avatar = require(`../img/${users[v.from].avatar}.png`)
                        return v.from === chatterId ? (
                            <List key={v._id}>
                                <Item thumb={avatar}>
                                    {v.content}
                                </Item>
                            </List>
                        ) : (
                            <List key={v._id}>
                                <Item className="chat-me"
                                      extra={<img alt="头像" src={avatar}/>}
                                >
                                    {v.content}
                                </Item>
                            </List>
                        )
                    })}
                </QueueAnim>
                <div className="stick-footer">
                    <List>
                        <InputItem
                            placeholder="请输入"
                            value={this.state.text}
                            onChange={v => {
                                this.setState({text: v})
                            }}
                            extra={
                                <div>
                                    <span style={{marginRight: 15}}
                                          onClick={this.handleEmojiClick}>
                                        😃
                                    </span>
                                    <span onClick={this.handleSubmit}>发送</span>
                                </div>
                            }>
                        </InputItem>
                    </List>
                    {this.state.showEmoji ?
                        <Grid
                            data={emoji}
                            columnNum={9}
                            carouselMaxRow={4}
                            isCarousel={true}
                            onClick={el => {
                                this.setState({
                                    text: this.state.text + el.text
                                })
                            }
                            }
                        /> : null}
                </div>
            </div>
        )

    }
}

export default Chat