import axios from 'axios'
import {getRedirectPath} from '../util/util'
import {REGISTER_SUCCESS, LOGIN_SUCESS, ERROR_MSG, LOAD_DATA} from '../constant/constant'

const initState = {
    redirectTo: '',
    isAuth: false,
    msg: '',
    user: '',
    type: ''
}

//reducer
export function user(state = initState, action) {
    switch (action.type) {
        case REGISTER_SUCCESS:
            return {...state, msg: '', redirectTo: getRedirectPath(action.payload), isAuth: true, ...action.payload}
        case LOGIN_SUCESS:
            return {...state, msg: '', redirectTo: getRedirectPath(action.payload), isAuth: true, ...action.payload}
        case LOAD_DATA:
            return {...state, ...action.payload}
        case ERROR_MSG:
            return {...state, isAuth: false, msg: action.msg}
        default:
            return state
    }
}

//actionCreator
export function registerSuccess(data) {
    return {type: REGISTER_SUCCESS, payload: data}
}

export function loginSuccess(data) {
    return {type: LOGIN_SUCESS, payload: data}
}

export function errorMsg(msg) {
    return {type: ERROR_MSG, msg}
}

export function loadData(userinfo) {
    console.log("loadData", userinfo)
    return {type: LOAD_DATA, payload: userinfo}
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
                    dispatch(loginSuccess(res.data.data))
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
                    dispatch(registerSuccess({user, pwd, type}))
                } else {
                    dispatch(errorMsg(res.data.msg))
                }
            })
    }
}
