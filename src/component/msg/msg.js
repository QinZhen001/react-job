import React from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'
import {getLast} from '../../util/util'
// import {createSelector} from 'reselect'
//
// const selector = createSelector(
//     [
//         state => state.user,
//         state => state.chat
//     ],
//     (user, chat) => {
//         const msgGroup = {}
//         chat.chatmsg.forEach(v => {
//             msgGroup[v.chatid] = msgGroup[v.chatid] || []
//
//         })
//     }
// )

@connect(
    state => state
)
class Msg extends React.PureComponent {

    goChat(targetId) {
        console.log('goChat')
        this.props.history.push(`/chat/${targetId}`)
    }


    render() {
        const msgGroup = {}
        this.props.chat.chatmsg.forEach(v => {
            msgGroup[v.chatid] = msgGroup[v.chatid] || []
            msgGroup[v.chatid].push(v)
        })
        //chatList是数组 而且他的子元素也是数组
        const chatList = Object.values(msgGroup).sort((arrA, arrB) => {
            const a_last = getLast(arrA).create_time
            const b_last = getLast(arrB).create_time
            return b_last - a_last
        })
        console.log('chatList', chatList)

        const Item = List.Item
        const Brief = Item.Brief
        const userid = this.props.user._id
        const userinfo = this.props.chat.users


        return (
            <div>
                {chatList.map(v => {
                    const lastItem = getLast(v)
                    const targetId = lastItem.from === userid ? lastItem.to : lastItem.from
                    const unreadNum = v.filter(v => !v.read && v.to === userid).length
                    if (!userinfo[targetId]) {
                        console.log('userinfo', userinfo, targetId);
                        return
                    }
                    return (
                        <List key={lastItem._id}>
                            <Item
                                extra={<Badge text={unreadNum}/>}
                                thumb={require(`../img/${userinfo[targetId].avatar}.png`)}
                                arrow="horizontal"
                                onClick={() => this.goChat(targetId)}
                            >
                                {lastItem.content}
                                <Brief>{userinfo[targetId].name}</Brief>
                            </Item>
                        </List>
                    )
                })}

            </div>
        )
    }
}

export default Msg