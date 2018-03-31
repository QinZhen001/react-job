import {combineReducers} from 'redux'
import {user} from './user.redux'
import {chatuser} from './chatuser.redux'
import {chat} from './chat.redux'

export default combineReducers({user, chatuser, chat})