import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'
import {composeWithDevTools} from 'redux-devtools-extension'
import App from './app'

import reducers from './redux/reducer'
import './config/config'
import './index.css'

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))


ReactDOM.hydrate(
    (
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    ),
    document.getElementById('root')
)





