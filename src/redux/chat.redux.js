import axios from 'axios'
import io from 'socket.io-client'
import {MSG_LIST, MSG_RECV, MSG_READ} from '../constant/constant'

const socket = io("ws://localhost:9093")

const initState = {
    chatmsg: [],
    users: {},
    unread: 0
}

export function chat(state = initState, action) {
    switch (action.type) {
        case MSG_LIST:
            return {
                ...state,
                users: action.payload.users,
                chatmsg: action.payload.msgs,
                unread: action.payload.msgs.filter(item => !item.read && item.to === action.payload.curUserId).length
            }
        case MSG_RECV:
            const n = action.payload.to === action.userid ? 1 : 0
            console.log('MSG_RECV', action.payload);
            return {
                ...state,
                chatmsg: [...state.chatmsg, action.payload],
                unread: state.unread + n
            }
        case MSG_READ:
            const {from, num} = action.payload
            return {
                ...state,
                chatmsg: state.chatmsg.map(item => ({...item, read: from === item.from ? true : item.read})),
                unread: state.unread - num
            }
        default:
            return state
    }
}


function msgList(msgs, users, curUserId) {
    return {type: MSG_LIST, payload: {msgs, users, curUserId}}
}

function msgRecv(msg, userid) {
    return {userid, type: MSG_RECV, payload: msg}
}

function msgRead({from, userid, num}) {
    return {type: MSG_READ, payload: {from, userid, num}}
}

export function readMsg(from) {
    return (dispatch, getState) => {
        axios.post('/user/msg', {from})
            .then(res => {
                const userid = getState().user._id
                if (res.status === 200 && res.data.code === 0) {
                    dispatch(msgRead({userid, from, num: res.data.num}))
                }
            })
    }
}


export function recvMsg() {
    return (dispatch, getState) => {
        socket.on("recvmsg", function (data) {
            console.log('recvmsg', data)
            const userid = getState().user._id
            dispatch(msgRecv(data, userid))
        })
    }
}

export function sendMsg({from, to, msg}) {
    return dispatch => {
        socket.emit('sendmsg', {from, to, msg})
    }
}

export function getMsgList() {
    return (dispatch, getState) => {
        axios.get('/user/msglist')
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    const curUserId = getState().user._id
                    dispatch(msgList(res.data.msgs, res.data.users, curUserId))
                }
            })
    }
}

