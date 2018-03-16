import React from 'react'
import Logo from '../../component/logo/logo'
import {List, InputItem, WingBlank, WhiteSpace, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {login} from '../../reducer/user.redux'


@connect(
    state => state.user,
    {login}
)
class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: "",
            pwd: ""
        }
        this.handleLogin = this.handleLogin.bind(this)
        this.handleRegister = this.handleRegister.bind(this)
    }

    handleChange(key, value) {
        this.setState({
            [key]: value
        })
    }

    handleRegister() {
        this.props.history.push('/register')
    }

    handleLogin() {
        this.props.login(this.state)
    }

    render() {
        return (
            <div>
                {this.props.redirectTo ? <Redirect to={this.props.redirectTo}/> : null}
                <Logo/>
                <WingBlank>
                    <List>
                        {this.props.msg ? <p className="error-msg">{this.props.msg}</p> : null}
                        <InputItem onChange={v => this.handleChange('user', v)}>用户</InputItem>
                        <WhiteSpace/>
                        <InputItem onChange={v => this.handleChange('pwd', v)}>密码</InputItem>
                    </List>
                    <WhiteSpace/>
                    <Button onClick={this.handleLogin} type="primary">登录</Button>
                    <WhiteSpace/>
                    <Button onClick={this.handleRegister}>注册</Button>
                </WingBlank>
            </div>
        )
    }
}

export default Login