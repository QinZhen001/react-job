import React from 'react'
import {Grid, List} from 'antd-mobile'
import {AVATAR_LIST} from "../../constant/constant"
import PropTypes from 'prop-types'

class AvatarSelector extends React.Component {
    static propTypes = {
        selectAvatar: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const avatarList = AVATAR_LIST.split(',').map(v => ({
            icon: require(`../img/${v}.png`),
            text: v
        }))
        const gridHeader = this.state.icon ? (
            <div>
                <span>已选择头像</span>
                <img style={{display: "inline-block", width: 20, marginLeft: 5, verticalAlign: "bottom"}}
                     src={this.state.icon} alt=""/>
            </div>) : '请选择头像'
        return (
            <div>
                <List renderHeader={() => gridHeader}>
                    <Grid data={avatarList}
                          columnNum={5}
                          onClick={elm => {
                              this.setState(elm)
                              console.log(elm);
                              this.props.selectAvatar(elm.text)
                          }}
                    />
                </List>
            </div>
        )
    }
}

export default AvatarSelector