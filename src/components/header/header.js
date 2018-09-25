import React, {Component} from "react"
import {Link, withRouter} from "react-router-dom"
import {observer, inject} from "mobx-react"
import logo from '../../logo.svg'
import './header.scss'
import {Menu, Button} from 'element-react'
import HigherComponent from '../HigherComponent/HigherComponent'

@inject('stores')
@observer
class Header extends Component {
    constructor(props) {
        super(props)
        this.store = this.props.stores
        this.state = {
            isShowListInfo: true
        }

        this.onSelect = this.onSelect.bind(this)
        this.onClickPrintNum = this.onClickPrintNum.bind(this)
        this.login = this.login.bind(this)
    }

    onClickPrintNum() {
        this.store.add()
    }

    onSelect() {

    }

    login() {
        this.store.login({username: 'admin', password: 'admi'})
    }

    render() {
        return (
            <header className="demo-header clearFix">
                <img src={logo} className="App-logo" alt="logo" />
                <nav className="demo-nav">
                    <Menu defaultActive={this.store.defaultActive} className="el-menu-demo" mode="horizontal" onSelect={this.onSelect}>
                        <Menu.Item index="1"><Link to="/home">自我介绍</Link></Menu.Item>
                        <Menu.Item index="2"><Link to="/share">技术分享</Link></Menu.Item>
                    </Menu>
                </nav>
                <div className="demo-opt">
                    <span className="mgt-10">徐媛媛 <span className="mgt-10" onClick={this.onClickPrintNum}> <i className="icon iconfont icon-zan" />{this.store.number}</span></span>
                    <Button plain type="info" onClick={this.login}>登录</Button>
                </div>
            </header>
        )
    }
}

export default withRouter(HigherComponent(Header))