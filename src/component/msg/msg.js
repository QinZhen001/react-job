import React from 'react'
import {connect} from 'react-redux'
import {List, Item, Brief} from 'antd-mobile'
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
    render() {
        const msgGroup = {}
        this.props.chat.chatmsg.forEach(v => {
            msgGroup[v.chatid] = msgGroup[v.chatid] || []
            msgGroup[v.chatid].push(v)
        })
        console.log('msgGroup', msgGroup)
        const chatList = Object.values(msgGroup)
        const Item = List.Item
        const Brief = Item.Brief
        return (
            <div>
                <List>
                    {chatList.map(v => {
                        const  
                        <Item>
                            <Brief></Brief>
                        </Item>
                    })}
                </List>
            </div>
        )
    }
}

export default Msg