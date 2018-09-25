import React, {Component} from 'react'
import { DTree, ETree} from '../../components'
import {observer, inject} from "mobx-react"
import {Upload, Button} from 'element-react'
import http from "../../api/request"
import './share.scss'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import axios from 'axios'

@inject('stores')
@observer
class Share extends Component{
    constructor(props){
        super(props)
        this.state = {
            headers:{'Content-Type':null},
            echartsTree1:{},
            echartsTree2:{},
            points:[['树布局, d3.layout.tree().size([h, w]),\n其中利用d3.layout.hierarchy排列树节点',
                'size的设置,影响节点的x,y坐标值,d.y的数值是按层级平分size入参的第二位数值', '垂直方向排列,设置size([w,h]),circle坐标原点cx:d.x cy:d.y',
                '水平方向排列,设置size([h,w]),circle坐标原点cx:d.y cy:d.x','d3.svg.diagonal(),生成路径,绘制边'],
            ['echarts版本号:4.1.0,树图新增配置orient,支持从右向左，从下向上','左右树数据对称,中点节点便在一个地方,否则出现左右分离的树']]
        }
        this.store = this.props.stores
        this.store.setDefaultActive('2')
    }

    componentDidMount() {
        http.post('http://result.eolinker.com/Xqkc6Hsab40971d62256e684b7e73c3e9008076b8db5f32?uri=/react/echart/doubletree', {}).then(response => {
            let res = response.data
            this.setState({
                echartsTree1:{leftNodes:{name:res.name,children:res.parents},rightNodes:{name:res.name,children:res.children}},
                echartsTree2:{leftNodes:{name:res.name,children:res.parents},rightNodes:{name:res.name,children:res.parents}}
            })
        })
        // http.post('http://192.168.205.176:8889/info', {firstName: 'Fred', lastName: 'Flintstone'}).then(response => {
        //     console.info(response)
        // })
    }
    addEmoji = (val) => {
        console.info(val)
    }

    submitUpload = () => {
        this.uploadRef.submit()
        console.info(this.uploadRef.refs['upload-inner'])
        if (!this.uploadRef || !this.uploadRef.files) {
            return
        }
        var formData = new FormData()
        formData.append('file', this.uploadRef.files[0])
        let config = { // 配合multer上传文件,不能设置content-type
            headers: {
                'Content-Type': null
            }
        }
        axios.post('http://192.168.205.176:8889/upload', formData,config).then( res => {
            console.log(res)
        }).catch( res => {
            console.log(res)
        })
    }

    render() {
        let uploadRef = null
        return (
            <div className="share-main clearFix">
                <div className="module-main clearFix">
                    <div className="module-item" style={{width:'100%',float:'left'}}>
                        <h5>D3绘制双侧树(V3)</h5>
                        <DTree />
                    </div>
                    <div className="module-item" style={{width:'100%',float:'left',height:'640px'}}>
                        <h5>d3技术点</h5>
                        <div style={{fontSize:'24px',textAlign:'center'}}>
                            {
                                this.state.points[0].map((item,index)=>{
                                    return <p key={index}><span style={{marginRight:'10px'}}>{index+1}</span>{item}</p>
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className="module-main clearFix">
                    <div className="module-item" style={{width:'49%',float:'left'}}>
                        <h5>echarts绘制双侧树(V4),双侧数据非对称</h5>
                        <ETree containerId="container2" graphData={this.state.echartsTree1} />
                    </div>
                    <div className="module-item" style={{width:'49%',marginLeft:'2%',float:'left'}}>
                        <h5>echarts绘制双侧树(V4),双侧数据对称</h5>
                        <ETree containerId="container3" graphData={this.state.echartsTree2} />
                    </div>
                </div>

                <div className="module-main clearFix">
                    <div className="module-item" style={{width:'49%',float:'left',height:'640px'}}>
                        <h5>echarts技术点</h5>
                        <div style={{fontSize:'24px'}}>
                            {
                                this.state.points[1].map((item,index)=>{
                                    return <p key={index}><span style={{marginRight:'10px'}}>{index+1}</span>{item}</p>
                                })
                            }
                        </div>
                    </div>
                    <div style={{display:'none'}}>
                        <Picker onSelect={this.addEmoji} />
                    </div>
                    <div>
                        <form id="editfile" method="post" action="http://192.168.205.176:8889/upload" encType="multipart/form-data">
                            选择图片：<input name="avatar" id="upfile" type="file"/>
                        </form>
                        <button type="button" onClick={this.submitUpload2}>提交2</button>
                        {uploadRef}
                        <Upload
                            className="upload-demo"
                            ref={(val) => {this.uploadRef = val}}
                            action="http://192.168.205.176:8889/upload"
                            autoUpload={false}
                            trigger={<Button size="small" type="primary">选取文件</Button>}>
                            <Button style={{ marginLeft: '10px'}} size="small" type="success" onClick={this.submitUpload}>上传到服务器</Button>
                        </Upload>
                        <form id="editfile2" method="post" action="http://192.168.205.176:8889/upload" encType="multipart/form-data">
                            选择图片：<input name="avatar" id="upfile2" type="file"/>
                            <input type="submit" value="提交"/>
                        </form>
                    </div>
                </div>

            </div>
        )
    }
}

export default Share