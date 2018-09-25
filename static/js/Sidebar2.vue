<template>
  <div class="main-sidebar jquery-accordion-menu blue" id="slidermain">
    <el-tree ref="menutree" :data="menuData" :props="defaultProps" highlight-current node-key="id" @node-click="handleNodeClick"
             :expand-on-click-node="expClickNode">
       <span class="custom-tree-node" slot-scope="{ node, data }" :title="node.label">
         <i :class="['fa',!node.expanded?'fa-plus-square-o':'fa-minus-square-o']"
            @click.stop="nodeExpandToggle(node,data)" v-show="node.data.type!=='2'&&!data.isNeedHide"></i>
        <span> <i class="fa fa-folder" v-if="node.data.type==='0'||node.data.type==='1'"></i>
         <i class="fa fa-tasks" v-else></i>{{ node.label }}</span>
      </span>
    </el-tree>
    <div class="lineDiv" style="background-color:red;width:5px;position: absolute;top:0;right: 0;height: 300px" ref="lineDiv"></div>
  </div>
</template>
<style lang="styl" rel="stylesheet/stylus" type="text/stylus" scoped>
  .main-sidebar .submenu li
    &.active>a
      border-left-color: transparent;
      background: #3a74c0;
      color: #fff;

  .main-sidebar
    background-color #284163
    height calc(100vh)
  & >>> .el-tree
          overflow-y auto
          max-height calc(100vh - 50px)
  & >>> .el-tree__empty-block .el-tree__empty-text
          color #f0f0f0

  & >>> .el-tree__empty-block
          background #284163

  & >>> .el-tree-node__content
          position relative
          height 40px
          font-size 14px
          color #f0f0f0
          background #284163
          border-top none
          border-left 6px solid transparent
          transition border .2s linear

  & >>> .el-tree-node:focus>.el-tree-node__content
          background #284163

  & >>> .el-tree>div[role="treeitem"]>.el-tree-node__content
          background #284163
  & >>> .el-tree-node.is-current.is-focusable>.el-tree-node__content
          background #3a74c0

  & >>> span.el-tree-node__expand-icon.el-icon-caret-right
              display none

  .custom-tree-node
    width 100%
    overflow hidden
    text-overflow ellipsis
    white-space nowrap

  .fa
    display inline-block
    font-size 16px

  .fa-folder, .fa-tasks
    margin 0 4px 0 2px
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import {mapState} from 'vuex'
  import Server from '../extend/Server'
  export default {
    mixins: [ BaseComponent ],
    name: 'Sidebar',
    data () {
      return {
        currentPage: '',
        highlightCurrent: '',
        expClickNode: false,
        defaultExpKeys: [],
        menuData: [],
        defaultProps: {
          label: 'label',
          children: 'children'
        }
      }
    },
    computed: mapState({
      activeIndex: state => state.app.activeIndex,
      packageInfo: state => state.app.packageInfo,
      navTwoIndex: state => state.app.navTwoIndex,
      mainNav: state => {
        if (state.app.menuData[ state.app.navIndex ]) {
          return state.app.menuData[ state.app.navIndex ].child
        } else {
          return []
        }
      }
    }),
    methods: {
      nodeExpandToggle (node, data) {
        node.expanded = !node.expanded
        if (!data.children || data.children.length === 0) {
          node.loading = true
          this.runServer({id: data.id, type: data.type}, node)
        }
      },
      handleNodeClick (data, node, self) {
        let path = '/task/'
        path += (data.type === '0' || data.type === '1' ? 'group' : 'task')
        this.$router.push({path: path + '?id=' + data.id + '&&type=' + data.type})
        this.highlightCurrent = this.$refs.menutree.getCurrentKey()
      },
      getDefaultExpKeys (data) {
        data.map(item => {
          if (item.open) {
            this.defaultExpKeys.push(item.id)
          }
          if (item.children && item.children.length > 0) {
            this.getDefaultExpKeys(item.children)
          }
        })
      },
      runServer (params = {id: ''}, node) {
        Server({
          url: '/group/getTree',
          method: 'post',
          data: params,
          needLoading: true
        }).then((response) => {
          let res = response.data
          if (response && res && Object.prototype.toString.call(res) === '[object Array]') {
            if (!node) {
              this.menuData = res
            } else {
              if (!node.data.children) {
                this.$set(node.data, 'children', [])
              }
              node.data.children = res
              if (node.data.children.length === 0) {
                this.$set(node.data, 'isNeedHide', true)
              }
              node.loading = false
            }
          }
//          this.getDefaultExpKeys(res)
        }).catch(() => {
          if (node) {
            node.loading = false
          }
        })
      }
    },
    mounted () {
      let sliderMain = document.getElementById('slidermain')
      let oDiv = this.$refs.lineDiv
      oDiv.onmousedown = function (evt) {
        let fromWidth = parseInt(sliderMain.offsetWidth) // parseInt为了不指向对象
        oDiv.style.cursor = 's-resize'
        let curevt = evt || event
        // 鼠标按下坐标
        let mouseDownX = curevt.clientX
        // IE8 取消默认行为-设置全局捕获
        if (oDiv.setCapture) {
          oDiv.setCapture()
        }
        document.onmousemove = function (docevt) {
          let outevt = docevt || event
          //  鼠标移动时的鼠标位置
          let mouseMoveX = outevt.clientX
          if (fromWidth + (mouseMoveX - mouseDownX) < 230) {
            return
          }
          sliderMain.style.width = fromWidth + (mouseMoveX - mouseDownX) + 'px'
        }
      }

      document.onmouseup = function () {
        document.onmousemove = null
        // 释放全局捕获
        if (oDiv.releaseCapture) {
          oDiv.releaseCapture()
        }
      }

      this.runServer()
      this.bindEvent('updateOther', (data) => {
        let type = data.type
        let node = this.$refs.menutree.getNode(data.id)
        if (type === 'delete') {
          this.$router.replace({path: '/task'})
          this.highlightCurrent = ''
          node && (this.$refs.menutree.remove(node))
          /**
           * 更新左侧树,当前节点的父节点是否展示+-标识
           */
          let nodeParent = this.$refs.menutree.getNode(data.parent)
          nodeParent && this.$set(nodeParent.data, 'isNeedHide', nodeParent.childNodes && nodeParent.childNodes.length === 0)
        } else if (type === 'add') {
          node && (node.expanded = true)
          /**
           * 新增节点时,节点有子节点,
           * 1 未拉取,从后台拉取数据更新节点;
           * 2 已经拉取,在现有数据上添加当前节点
           */
          if (node && node.childNodes.length === 0) {
            this.runServer({id: data.id, type: node.data.type}, node)
          } else if (node && node.childNodes.length > 0) {
            data.data.map(item => {
              this.$refs.menutree.append(item, node.data.id)
            })
          }
          node && this.$set(node.data, 'isNeedHide', false)
        } else if (type === 'update') {
          /***
           * 右侧,编辑->保存后,更新左侧树当前项名称
           */
          node && node.data && (node.data.label = data.label)
        }
      })
    },
    initEvent () {
    }
  }
</script>

