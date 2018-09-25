import React, { Component } from 'react'
import http from "../../api/request"
import './dtree.scss'
import '../../../static/js/d3.layout'

class DTree extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        http.post('http://result.eolinker.com/Xqkc6Hsab40971d62256e684b7e73c3e9008076b8db5f32?uri=/react/echart/doubletree', {}).then(response => {
            this.drawTree(response)
        })
    }

    drawTree(rst) {
        let jusfD3Tree = require('../../../static/js/concept-graph')
        let tree = jusfD3Tree.CollapsibleTree.drawTree('container')
        tree.init(rst.data)
    }

    render() {
        return (
            <div id="container" className="d3-tree" />
        )
    }
}

export default DTree
