import React from 'react'
import Logo from '../../component/logo/logo'
import {List, InputItem, WingBlank, WhiteSpace, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {login} from '../../redux/user.redux'
import handleChange from '../../component/handleChange/handleChange'


// 高阶组件学习
// class Hello extends React.Component {
//     render() {
//         return <h2>HELLO</h2>
//     }
// }
//
// function WrapperHello(Comp) {
//     class WrapComp extends React.Component {
//         componentDidMount() {
//             console.log("高级组件新增的生命周期"); //反向继承
//         }
//
//         render() {
//             return (
//                 <div>
//                     <p>这是高阶组件特有的元素</p>   //属性代理
//                     <Comp name={"text"} {...this.props}/>
//                 </div>
//             )
//         }
//     }
// }
// Hello = WrapperHello(Hello)


@connect(
    state => state.user,
    {login}
)
@handleChange
class Login extends React.Component {
    constructor(props) {
        super(props)
        this.handleLogin = this.handleLogin.bind(this)
        this.handleRegister = this.handleRegister.bind(this)
    }


    handleRegister() {
        this.props.history.push('/register')
    }

    handleLogin() {
        this.props.login(this.props.state)
    }

    render() {
        return (
            <div>
                {this.props.redirectTo && this.props.redirectTo != '/login' ?
                    <Redirect to={this.props.redirectTo}/> : null}
                <Logo/>
                <WingBlank>
                    <List>
                        {this.props.msg ? <p className="error-msg">{this.props.msg}</p> : null}
                        <InputItem onChange={v => this.props.handleChange('user', v)}>用户</InputItem>
                        <InputItem onChange={v => this.props.handleChange('pwd', v)}>密码</InputItem>
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