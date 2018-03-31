import React from 'react'
import PropTypes from 'prop-types'
import {Card, WhiteSpace, WingBlank} from 'antd-mobile'
import {withRouter} from 'react-router-dom'

@withRouter
class UserCard extends React.Component {
    static propTypes = {
        userlist: PropTypes.array.isRequired
    }

    handleClick(user) {
        this.props.history.push(`/chat/${user._id}`)
    }

    render() {
        const Header = Card.Header
        const Body = Card.Body
        return (
            <WingBlank>
                <WhiteSpace/>
                {this.props.userlist.map(user => (
                    user.avatar ? (
                        <div key={user._id}>
                            <Card onClick={() => this.handleClick(user)}>
                                <Header
                                    title={user.user}
                                    thumb={require(`../img/${user.avatar}.png`)}
                                    extra={<span>{user.title}</span>}
                                />
                                <Body>
                                {user.type === "boss" ? <div>公司:{user.company}</div> : null}
                                {user.desc.split('\n').map(v => (
                                    <div key={v}>{v}</div>
                                ))}
                                {user.type === "boss" ? <div>薪资:{user.money}</div> : null}
                                </Body>
                            </Card>
                            < WhiteSpace/>
                        </div>
                    ) : null
                ))
                }
            </WingBlank>
        )
    }
}

export default UserCard