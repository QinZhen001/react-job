import React from 'react'
import {connect} from 'react-redux'
import {Result, List, Brief, WhiteSpace, Modal} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import {logoutSubmit} from '../../redux/user.redux'
import browserCookie from 'browser-cookies'

@connect(
    state => state.user,
    {logoutSubmit}
)
class User extends React.Component {
    constructor(props) {
        super(props)
        this.logout = this.logout.bind(this)
    }

    logout() {
        const alert = Modal.alert
        alert("注销", "确认退出登录吗?", [
            {text: "取消", onPress: () => console.log('cancel')},
            {
                text: "确认", onPress: () => {
                browserCookie.erase("userid")
                this.props.logoutSubmit()
            }
            }
        ])
    }

    render() {
        const Item = List.Item
        const Brief = Item.Brief
        return this.props.user ? (
            <div>
                <Result
                    img={<img src={require(`../img/${this.props.avatar}.png`)} style={{width: 50}}/>}
                    title={this.props.user}
                    message={this.props.type === "boss" ? this.props.company : null}
                />
                <List renderHeader={() => '简介'}>
                    <Item multipleLine={true}>
                        {this.props.title}
                        {this.props.desc.split('\n').map(item => <Brief key={item}>{item}</Brief>)}
                        {this.props.money ? <Brief>薪资:{this.props.money}</Brief> : null}
                    </Item>
                </List>
                <WhiteSpace/>
                <List>
                    <Item onClick={this.logout}>
                        退出登录
                    </Item>
                </List>
            </div>
        ) : <Redirect to={this.props.redirectTo}/>
    }
}

export default User