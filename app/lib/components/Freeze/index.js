import { Component } from 'react'

export default class Freeze extends Component {
    state = {
        value: this.props.value,
    }
    frozen = false

    componentWillReceiveProps(next) {
        if (next.visible) {
            this.frozen = false
            return this.setState({
                value: next.value,
            })
        }

        if (next.visible === false && this.frozen === false) {
            this.frozen = true
            return this.setState({
                value: this.props.value,
            })
        }
    }

    render() {
        return this.props.children(this.state.value)
    }
}
