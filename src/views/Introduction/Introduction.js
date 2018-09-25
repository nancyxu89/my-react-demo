import React, {Component} from "react"
import {Layout, Tree, Table} from "element-react"
import "./introduction.scss"
import {observer, inject} from "mobx-react"

@inject('stores')
@observer
class Introduction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isShow: true,
            data: [{
                label: '工作经验',
                children: [{
                    label: 'Android开发工程师',
                    main: {type: '教育类,针对小学生各科目', projects: [{name: '手机端'}, {name: 'pad端'}, {name: '机顶盒'}]}
                },
                    {
                        label: '前端开发工程师',
                        main: {
                            type: '主要针对金融类项目的PC端开发',
                            projects: [{name: '前期: 可视化组件开发'}, {name: 'PC端开发: 西南证券、福建征金在线、新三板等'}, {name: '手机h5开发: 农业类项目'}]
                        }
                    }]
            },
                {label: '兴趣爱好', children: [{label: '看电影'}, {label: '享美食'}, {label: '溜达'}, {label: '......'}]}],
            options: {
                children: 'children',
                label: 'label'
            },
            columns: [
                {
                    label: "日期",
                    prop: "name"
                }],
            rightContent: {type: '教育类,针对小学生各科目', projects: [{name: '手机端'}, {name: 'pad端'}, {name: '机顶盒'}]}
        }

        this.store = this.props.stores
        this.store.setDefaultActive('1')
        this.handlerNodeClick = this.handlerNodeClick.bind(this)
    }

    handlerNodeClick(data, checked, indeterminate) {
        if (data.main) {
            this.setState({rightContent: data.main, isShow: true})
        } else {
            this.setState({isShow: false})
        }
    }

    render() {
        return (
            <div className="introduction-main">
                <Layout.Row>
                    <Layout.Col span="6">
                        <Tree
                            defaultExpandAll
                            data={this.state.data}
                            options={this.state.options}
                            highlightCurrent
                            onNodeClicked={this.handlerNodeClick}
                        />
                    </Layout.Col>
                    <Layout.Col span="18">
                        <div style={{padding:'10px',display:this.state.isShow?'block':'none'}}>
                            <h5 style={{'fontSize':'24px','textAlign':'center'}}>{this.state.rightContent.type}</h5>
                            <Layout.Col span="12" style={{position: 'relative',left: '50%', transform: 'translateX(-50%)'}}>
                                <Table
                                    border
                                    showHeader={false}
                                    style={{width: '100%'}}
                                    columns={this.state.columns}
                                    data={this.state.rightContent.projects}
                                />
                            </Layout.Col>
                        </div>
                    </Layout.Col>
                </Layout.Row>
            </div>
        )
    }
}

export default Introduction