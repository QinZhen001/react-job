import axios from 'axios'
import {getRedirectPath} from '../util/util'
import {AUTH_SUCCESS, ERROR_MSG, LOAD_DATA, LOGOUT} from '../constant/constant'

const initState = {
    redirectTo: '',
    isAuth: false,
    msg: '',
    user: '',
    type: '',
    avatar: ""
}

//reducer
export function user(state = initState, action) {
    switch (action.type) {
        case AUTH_SUCCESS:
            return {...state, msg: '', redirectTo: getRedirectPath(action.payload), ...action.payload}
        case LOAD_DATA:
            return {...state, ...action.payload}
        case ERROR_MSG:
            return {...state, isAuth: false, msg: action.msg}
        case LOGOUT:
            return {...initState, redirectTo: '/login'}
        default:
            return state
    }
}

//actionCreator
function authSuccess(obj) {
    const {pwd, ...data} = obj //去除密码这一项
    return {type: AUTH_SUCCESS, payload: data}
}

export function errorMsg(msg) {
    return {type: ERROR_MSG, msg}
}

export function loadData(userinfo) {
    console.log("loadData", userinfo)
    return {type: LOAD_DATA, payload: userinfo}
}

export function logoutSubmit() {
    return {type: LOGOUT}
}

//利用了thunk
export function update(data) {
    return dispatch => {
        axios.post('/user/update', data)
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    dispatch(authSuccess(res.data.data))
                } else {
                    dispatch(errorMsg(res.data.msg))
                }
            })
    }
}


//利用了thunk
export function login({user, pwd}) {
    if (!user || !pwd) {
        return errorMsg("用户密码必须输入")
    }
    return dispatch => {
        axios.post('/user/login', {user, pwd})
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    dispatch(authSuccess(res.data.data))
                } else {
                    dispatch(errorMsg(res.data.msg))
                }
            })
    }
}

export function register({user, pwd, repeatpwd, type}) {
    if (!user || !pwd) {
        return errorMsg('用户名密码必须输入')
    }
    if (!type) {
        return errorMsg("type不存在")
    }
    if (pwd !== repeatpwd) {
        return errorMsg("密码和确认密码不同")
    }
    return dispatch => {
        axios.post('/user/register', {user, pwd, type})
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    dispatch(authSuccess({user, pwd, type}))
                } else {
                    dispatch(errorMsg(res.data.msg))
                }
            })
    }
}
