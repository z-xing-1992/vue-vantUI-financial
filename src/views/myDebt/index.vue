<!-- login -->
<template>
  <div class="index-container about-wrapper">
    <van-nav-bar left-arrow @click-left="onClickLeft" class="title">
       <template #title>
         <div class="current-title">
            <span :class="tabIndex ==1 ?'tab-active':''" @click="debtBtn(1)">债权</span>
            <span :class="tabIndex ==2 ?'tab-active':''" @click="debtBtn(2)">债务</span>
         </div>
      </template>
    </van-nav-bar>
    <div class="content">
      <div class="nav" >
        <div class="nav-left" ref="wrapper">
          <ul ref="list">
            <li v-for="(item,index) in currentNavList" :key="index" :class="navIndex == item.status ? 'navActive':''" @click="toogleBtn(item.status,$event)">{{item.tabName}}</li>
          </ul>
        </div>
        <div class="nav-right" @click="openNavBtn">
          <van-icon :name="downUrl" v-if="!openNav"/>
          <van-icon :name="upUrl" v-else/>
        </div>
      </div>
      <div class="debt-list">
        <div v-if="currentTotal==0" class="no-message">
          <img :src="no_message_icon" alt="no message">
          <p>暂无内容</p>
        </div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="list" v-else>
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
            <div class="item"  v-for="item in itemList" :key="item.id" @click="gotoDetailBtn(item.id)">
              <span class="editBtn" v-if="item.canUpdate">编辑</span>
              <ul class="item-left">
                <li>
                  <label class="label-title">{{ tabIndex | debtName}}人姓名/单位</label>
                  <p class="label-name">{{item.partiesName}}</p>
                </li>
                <li>
                  <label class="label-title">联系方式</label>
                  <p class="label-name">{{item.partiesPhone}}</p>
                </li>
                <li class="address-wrapper">
                  <label class="label-title">联系地址</label>
                  <p class="label-name">{{item.partiesAddress}}</p>
                </li>
                <li>
                  <label class="label-title">从事行业</label>
                  <p class="label-name">{{item.partiesOccupation}}</p>
                </li>
              </ul>
              <van-icon name="arrow" class="item-right"/>
            </div>
          </van-list>
        </van-pull-refresh>
        <!-- 菜单 -->
        <div class="menu" v-if="openNav">
          <ul>
            <li v-for="(item,index) in currentNavList" :key="index" :class="navIndex == item.status ? 'navActive':''" @click="toogleBtn(item.status,$event)">{{item.tabName}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getDebtList} from "@/api/myDebt"
import BScroll from "better-scroll"
import { isEmpty } from '@/utils/validate'
export default {
  filters:{
    debtName(status) {
      // type 0 1
      const statusMap = {
        1: '债权',
        2: '债务'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      obj: {
        sortBy:'createTime_DESC',//时间倒序
				type: 1, //1是债权人 2是债务人
        status: 1,//流程状态，共14个
        page:0,
        rows:10
      },
      currentTotal:0,
      downUrl:require('../../../static/menu_down.png'),
      upUrl:require('../../../static/menu_up.png'),
      no_message_icon: require('../../../static/no_debt_msg.png'),
      itemList: [],
      loading: false,
      finished: false,
      refreshing: false,
      total:0,
      tabIndex:1,//1=债权 2=债务
      navIndex:1,//菜单索引
      openNav:false,
      currentNavList:[
        {
          status:1,
          tabName:'待分配资产管理师'
        },
        {
          status:2,
          tabName:'待上传解债方案'
        },
        {
          status:3,
          tabName:'待确认解债方案'
        },
        {
          status:4,
          tabName:'待修改解债方案'
        },
        {
          status:5,
          tabName:'待上传合约'
        },
        {
          status:6,
          tabName:'待确认合约'
        },
        {
          status:7,
          tabName:'待修改合约'
        },
        {
          status:8,
          tabName:'待签署合约'
        },
        {
          status:9,
          tabName:'待运营中心审核'
        },
        {
          status:10,
          tabName:'解债中'
        },
        {
          status:11,
          tabName:'待上传支付佣金凭证'
        },
        {
          status:12,
          tabName:'待审核支付佣金凭证'
        },
        {
          status:13,
          tabName:'待修改支付佣金凭证'
        },
        {
          status:14,
          tabName:'解债成功'
        }
      ]
    }
  },

  created () {
    if(!isEmpty(localStorage.getItem('tabIndex')) && !isEmpty(localStorage.getItem('navIndex'))){
      this.tabIndex = localStorage.getItem('tabIndex')
      this.navIndex = localStorage.getItem('navIndex')
      // 重新执行请求
      this.obj.type = this.tabIndex
      this.obj.status = this.navIndex
    }
    this.checkItemListBtn()
  },

  mounted () {
    this.$nextTick(() => {
      let timer = setTimeout(() => {
        if (timer) {
          clearTimeout(timer)
          this._initScorll()
        }
      }, 0)
    })
  },

  beforeDestroy() {
    this.navScroll.destroy()
  },
  methods: {
    checkItemListBtn(){
      let that = this
      getDebtList(that.obj).then((res) => {
        if(res && res.code == 200){
          that.currentTotal = Number(res.data.totalElements)
        }
      }).catch((error) => {
        that.$dialog.alert({
          title: '温馨提示',
          message: error
        })
      })
    },
    gotoDetailBtn(id){
      // 进入详情
      localStorage.setItem('navIndex',this.navIndex)
      localStorage.setItem('tabIndex',this.tabIndex)
      this.$router.push({
        path: "/myDebtDetails",
        query: {
          id: id,
          type: this.tabIndex //记录状态
        }
      })
    },
    onClickLeft(){
      this.$router.go(-1)
    },
    debtBtn(index){
      this.tabIndex = index
      // 记录当前状态类型
      localStorage.setItem('tabIndex',index)
      this.obj.type = index
      // 重新执行请求
      this.itemList = []
      this.obj.page = 0
      this.refreshing = false
      this.onLoad()
    },
    toogleBtn(index,event){
      console.log('点击了')
      // if (!event._constructed) {
      //   return
      // }
      this.openNav = false
      this.navIndex = index
      // 记录当前菜单项索引位置
      localStorage.setItem('navIndex',index)
      this.obj.status = index
      // 滑动
      this._followScroll(index-1)
      // 重新执行请求
      this.itemList = []
      this.obj.page = 0
      this.refreshing = false
      this.onLoad()
    },
    _followScroll(index){
      let wrap1 = this.$refs.list.children
      let el = wrap1[index]
      let elWidth = el.clientWidth
      if (index < wrap1.length) {
        this.navScroll.scrollToElement(el, 300, -elWidth, 0)
      }
    },
    _initScorll(){
      //先判断是否有这个属性
      let that = this
      if (that.currentNavList) {
        that.$nextTick(() => {
          if (!that.navScroll) {
            that.navScroll = new BScroll(that.$refs.wrapper, {
              startX: 0,
              click: true,
              scrollX: true,
              scrollY: false,
              eventPassthrough: 'vertical'
            })
            this._followScroll(this.navIndex - 1)
          } else {
            that.navScroll.refresh()
          }
        })
      }
    },
    openNavBtn(){
      this.openNav = !this.openNav
    },
    onLoad() {
      this.obj.page++
      this.getDebtListBtn()
    },
    getDebtListBtn(){
      let that = this
      if (that.refreshing) {
        that.itemList = []
        that.obj.page = 1
        that.refreshing = false
      }
      getDebtList(that.obj).then((res) => {
        if(res && res.code == 200){
          let rows = res.data.list
          that.loading = false
          that.total = Number(res.data.totalElements)
          that.currentTotal = Number(res.data.totalElements)
          if(rows == null || rows.length === 0) {
            that.finished = true
            return
          }
          that.itemList = that.itemList.concat(rows)
          if(that.itemList.length >= that.total) {
            that.finished = true
          }
        }
      }).catch((error) => {
        that.$dialog.alert({
          title: '温馨提示',
          message: error
        })
      })
    },
    onRefresh() {
      this.finished = false
      this.loading = true
      this.itemList = []
      this.onLoad()
    },
  }
}
</script>
<style>
/* .about-wrapper .van-hairline--bottom::after{
  border: none;
} */
.about-wrapper .van-nav-bar__title{
  font-size: 18px;
  font-weight: 500;
  line-height: 31px;
  color: #000000;
}
.about-wrapper .van-icon-arrow-left{
  color: #000000;
  font-weight: 500;
  font-size: 24px;
}
</style>
<style lang="scss" scoped>
.index-container {
  width: 100%;
  height: auto;
  overflow: hidden;
  margin: 0 auto;
  min-height: 100vh;
  .title{
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    line-height: 31px;
    color: #000000;
  }
  .current-title{
    width: 140px;
    font-size: 16px;
    font-weight: 500;
    line-height: 27px;
    color: #666666;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tab-active{
      font-size: 18px;
      font-weight: 500;
      line-height: 31px;
      color: #000000;
      border-bottom: 3px solid #5089FF;
    }
  }
  .content{
    background: #ffffff;
    text-align: center;
    overflow: hidden;
    .nav{
      background: #ffffff;
      margin: 0 15px;
      height: 44px;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .nav-left{
        // wrapper
        flex:1;
        overflow: hidden;
        white-space: nowrap;
        ul{
          // list
          display: inline-block;
          li{
            display: inline-block;
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
            color: #333333;
            // width: 140px;
            padding: 0 10px;
          }
          .navActive{
            color: #5089FF;
          }
        }
      }
      .nav-right{
        width: 30px;
        .van-icon{
          font-weight: 500;
          font-size: 20px;
          color: #5089FF;
        }
      }
    }
    .debt-list{
      width: 100%;
      height: calc(100vh - 90px);
      position: relative;
      .no-message{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img{
          width: 106px;
        }
        p{
          font-size: 16px;
          font-weight: 400;
          line-height: 27px;
          color: #5089FF;
          opacity: 0.8;
        }
      }
      .list{
        background: #F5F5F5;
        height: 100%;
        overflow: hidden;
        overflow-y: scroll;
        .item{
          margin: 10px 15px;
          overflow: hidden;
          border-radius: 6px;
          background: #ffffff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0px 3px 6px rgba(137, 137, 137, 0.06);
          position: relative;
          .editBtn{
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
            color: #5089FF;
          }
          .item-left{
            overflow: hidden;
            margin-left: 14px;
            padding: 18px 0px;
            li{
              width: 100%;
              overflow: hidden;
              display: flex;
              align-items: center;
              text-align: left;
              margin-bottom: 18px;
              .label-title{
                min-width: 60px;
                margin-right: 18px;
                overflow: hidden;
                font-size: 14px;
                font-weight: 400;
                color: #666666;
              }
              .label-name{
                margin: 0;
                padding: 0;
                font-size: 14px;
                font-weight: 400;
                color: #000000;
              }
            }
            li:last-child{
              margin-bottom: 0px;
            }
            .address-wrapper{
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
            }
          }
          .item-right{
            font-size:20px;
            color: #B8C2CC;
            margin-right: 10px;
          }
        }
      }
      .menu{
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        background: rgba($color: #000000, $alpha: 0.5);
        z-index: 9999;
        ul{
          // margin: 0 15px;
          background: #ffffff;
          overflow: hidden;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-evenly;
          padding-bottom: 10px;
          li{
            overflow: hidden;
            width: 164px;
            height: 38px;
            line-height: 38px;
            text-align: center;
            background: #F5F5F5;
            opacity: 1;
            border-radius: 4px;
            margin: 8px 0px;
            font-size: 14px;
            font-weight: 400;
            color: #000000;
          }
          .navActive{
            color: #5089FF;
          }
        }
      }
    }
  }
}
</style>
