import React from 'react'
import {NavBar, InputItem, TextareaItem, Button, WingBlank} from 'antd-mobile'
import AvatarSelector from '../../component/avatar-selector/avatar-selector'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {update} from '../../redux/user.redux'

@connect(
    state => state.user,
    {update}
)
class BossInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            desc: "",
            company: "",
            money: ""
        }
    }

    onChange = (key, val) => {
        this.setState({
            [key]: val
        })
    }

    selectAvatar = (imgname) => {
        this.setState({
            avatar: imgname
        })
    }

    render() {
        const path = this.props.location.pathname
        const redirect = this.props.redirectTo
        return (
            <div>
                {redirect && redirect !== path ? <Redirect to={this.props.redirectTo}/> : null}
                <NavBar mode="dark">Boss信息完善</NavBar>
                <AvatarSelector selectAvatar={imgname => this.selectAvatar(imgname)}/>
                <InputItem onChange={v=>this.onChange('title', v)}>招聘职位</InputItem>
                <InputItem onChange={v=>this.onChange('company', v)}>公司名称</InputItem>
                <InputItem onChange={v=>this.onChange('money', v)}>职位薪资</InputItem>
                <TextareaItem onChange={v=>this.onChange('desc', v)}
                              row={3}
                              autoHeight
                              title='职位要求'
                />
                <WingBlank>
                    <Button onClick={() => this.props.update(this.state)} type="primary" style={{marginTop: 15}}>
                        保存
                    </Button>
                </WingBlank>
            </div>
        )
    }
}

export default BossInfo