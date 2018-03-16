import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'
import {composeWithDevTools} from 'redux-devtools-extension'
import reducers from './reducer'

import AuthRoute from './component/authroute/authroute'
import Login from './container/login/login'
import Register from './container/register/register'
import './config/config'
import './index.css'

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))

function Boss() {
    return <h2>BOSS页面</h2>
}


ReactDOM.render(
    (
        <Provider store={store}>
            <BrowserRouter>
                <div>
                    <AuthRoute/>
                    <Route path="/boss" component={Boss}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                </div>
            </BrowserRouter>
        </Provider>
    ),
    document.getElementById('root')
)





