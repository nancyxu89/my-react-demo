import React, {Component} from "react"
const HigherComponent = (ComposedComponent) => class extends Component {
    constructor(props) {
        super(props)
        this.state = { data: null }
    }
    componentDidMount() {
        this.setState({ data: 'HigherComponent' })
        console.info('componentDidMount')
    }
    render() {
        return <ComposedComponent {...this.props} data={this.state.data} />
    }
}

export default HigherComponent