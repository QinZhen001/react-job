import React from 'react'

// 高阶组件 包裹handleChange方法
export default function handleChange(Comp) {
    return class WrapperComp extends React.Component {
        constructor(props) {
            super(props)
            this.state = {}
            this.handleChange = this.handleChange.bind(this)
        }

        handleChange(key, val) {
            this.setState({
                [key]: val
            })
        }

        render() {
            return (
                <Comp
                    handleChange={this.handleChange}
                    state={this.state}
                    {...this.props}>
                </Comp>
            )

        }
    }
}