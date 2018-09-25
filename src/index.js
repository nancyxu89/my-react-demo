// import React from 'react'
// import ReactDOM from 'react-dom'
// import './index.css'
// import App from './App'
// import registerServiceWorker from './registerServiceWorker'
//
// ReactDOM.render(<App />, document.getElementById('root'))
// registerServiceWorker()


import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './assets/font/iconfont.css'
import ROOT from './router'
import registerServiceWorker from './registerServiceWorker'
import 'element-theme-default'
import './assets/css/main.scss'
ReactDOM.render(<ROOT />, document.getElementById('root'))

registerServiceWorker()