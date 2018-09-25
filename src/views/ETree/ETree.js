import React, { Component } from 'react'
import './etree.scss'
import echarts from 'echarts'

class DTree extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentWillReceiveProps(nextProps) {
        this.drawTree(nextProps.containerId,nextProps.graphData)
    }

    drawTree(id, rst) {
        let myChart = echarts.init(document.getElementById(id))
        let rightToLeftTreeData = rst.leftNodes || {}
        let leftToRightTreeData = rst.rightNodes || {}
        let option = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [{
                type: 'tree',
                name: 'hhh',
                data: [rightToLeftTreeData],
                top: 0,
                left: '20%',
                bottom: 0,
                right: 0,
                width: '30%',
                height: '100%',
                symbolSize: 12,
                initialTreeDepth: 1,
                orient: 'RL',
                label: {
                    normal: {
                        position: 'bottom',
                        verticalAlign: 'middle',
                        align: 'right'
                    }
                },
                leaves: {
                    label: {
                        normal: {
                            position: 'top',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    }
                },
                // expandAndCollapse: false,
                animationDuration: 550,
                animationDurationUpdate: 750
            },
                {
                    type: 'tree',
                    name: 'hhh65',
                    data: [leftToRightTreeData],
                    top: 0,
                    left: '50%',
                    bottom: 0,
                    right: '20%',
                    width: '30%',
                    height: '100%',
                    symbolSize: 12,
                    initialTreeDepth: 1,
                    label: {
                        normal: {
                            position: 'bottom',
                            show: false,
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    },
                    leaves: {
                        label: {
                            normal: {
                                position: 'top',
                                verticalAlign: 'middle',
                                align: 'right'
                            }
                        }
                    },
                    // expandAndCollapse: false,
                    animationDuration: 550,
                    animationDurationUpdate: 750
                }]
        }

        myChart.setOption(option)
    }

    render() {
        return (
            <div id={this.props.containerId} className="echarts-tree" />
        )
    }
}

export default DTree
