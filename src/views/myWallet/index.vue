<!-- login -->
<template>
  <div class="index-container about-wrapper">
    <van-nav-bar left-arrow @click-left="onClickLeft" title="我的钱包" class="title"/>
    <div class="content">
      <div class="content-top">
        <div class="content-top-top">
          <div class="content-top-topL">
            <p class="balance">账户余额（￥）</p>
            <p class="amount">{{myWallet.totalBalance}}</p>
          </div>
          <div class="content-top-topR">
            <span class="cash-out" @click="cashOutBtn">提现</span>
          </div>
        </div>
        <div class="content-top-bottom">
          <div class="content-top-bottomL">
            <p class="amount-title">可提现金额</p>
            <p class="amount-info">¥{{myWallet.canWithdrawBalance}}</p>
          </div>
          <div class="content-top-bottomR">
            <p class="amount-title">冻结金额</p>
            <p class="amount-info">¥{{myWallet.freezeAmount}}</p>
          </div>
        </div>
      </div>
      <div class="content-bottom">
        <div class="content-bottom-top">
          <div class="content-bottom-topT">
            <p class="details-title">明细</p>
            <p class="date" @click="showDateBtn">
              {{currentDate}}
            </p>
            <span :class="show== false ? 'down' : 'up'"  @click="showDateBtn"></span>
            <van-calendar v-model="show" @confirm="onConfirm" :min-date="minDate"/>
          </div>
          <ul class="content-bottom-topB">
            <li :class="tabIndex== 1? 'active':''" @click="switchBtn(1)">全部</li>
            <li :class="tabIndex== 2? 'active':''" @click="switchBtn(2)">收入</li>
            <li :class="tabIndex== 3? 'active':''" @click="switchBtn(3)">提现</li>
          </ul>
        </div>
        <div class="content-bottom-bottom">
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="list">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad">
              <div class="item"  v-for="item in itemList" :key="item.id" @click="gotoDetailsBtn(item.id)">
                <template v-if="tabIndex == 1">
                  <!-- 全部 -->
                  <div class="item-left">
                    <p class="item-title">{{item.type | statusFilter}}</p>
                    <p class="item-date">{{item.updateTime}}</p>
                  </div>
                  <p class="item-changeAmount">{{item.changeAmount}}</p>
                </template>
                <template v-if="tabIndex == 2 && item.type == 1">
                  <!-- 收入 -->
                  <div class="item-left">
                    <p class="item-title">{{item.type | statusFilter}}</p>
                    <p class="item-date">{{item.updateTime}}</p>
                  </div>
                  <p class="item-changeAmount">{{item.changeAmount}}</p>
                </template>
                <template v-if="tabIndex == 2 && item.type == 0">
                  <!-- 提现 -->
                  <div class="item-left">
                    <p class="item-title">{{item.type | statusFilter}}</p>
                    <p class="item-date">{{item.updateTime}}</p>
                  </div>
                  <p class="item-changeAmount">{{item.changeAmount}}</p>
                </template>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getWalletLog,getWallet} from "@/api/home"
import moment from 'moment'
export default {
  filters: {
    statusFilter(status) {
      // type 0 1
      const statusMap = {
        0: '提现',
        1: '邀请好友佣金'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      myWallet:{},
      minDate:new Date(2010, 0, 1),
      currentDate: moment().format('YYYY年MM月'),
      show:false,
      tabIndex:1,
      obj:{
        keyword:'',
        sortBy:'createTime_DESC',
        beginTime:'',
        endTime:'',
        page:0,
        rows:10
      },
      itemList: [],
      loading: false,
      finished: false,
      refreshing: false,
      total:0
    }
  },

  created () {
    this.obj.beginTime = moment().format('YYYY-MM')
    this.getWalletBtn()
  },

  mounted () {},

  methods: {
    gotoDetailsBtn(id){
      let that = this
      console.log('点击查看详情')
      that.$router.push({
        path: "/myWalletDetails",
        query: {
          id: id
        }
      })
    },
    getWalletBtn(){
      let that = this
      getWallet().then(res=>{
        if(res && res.code == 200){
          that.myWallet = res.data
        }
      }).catch(error=>{
        that.$dialog.alert({
          title: '温馨提示',
          message: res.msg
        })
      })
    },
    onClickLeft(){
      this.$router.go(-1)
    },
    cashOutBtn(){
      this.$dialog.alert({
        title: '温馨提示',
        message: '暂未开放提现权限，请联系管理员'
      })
    },
    onConfirm(date) {
      console.log('点击了')
      let currentDate = moment(date).format('YYYY年MM月')
      let currentDate1 = moment(date).format('YYYY-MM')
      this.show = false
      this.currentDate = currentDate
      this.obj.beginTime = currentDate1
      
      this.itemList = []
      this.obj.page = 0
      this.refreshing = false
      this.onLoad()
    },
    showDateBtn(){
      console.log('点击')
      this.show = true
    },
    switchBtn(index){
      this.tabIndex = index
      this.itemList = []
      this.obj.page = 0
      this.refreshing = false
      this.onLoad()
    },
    onRefresh() {
      this.finished = false
      this.loading = true
      this.itemList = []
      this.onLoad()
    },
    onLoad() {
      this.obj.page++
      this.getWalletLogListBtn()
    },
    getWalletLogListBtn(){
      let that = this
      if (that.refreshing) {
        that.itemList = []
        that.obj.page = 1
        that.refreshing = false
      }
      getWalletLog(that.obj).then((res) => {
        if(res && res.code == 200){
          let rows = res.data.list
          that.loading = false
          that.total = Number(res.data.totalElements)
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
    }
  }
}
</script>
<style>
.about-wrapper .van-hairline--bottom::after{
  border: none;
}
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
.list .van-list{
  padding-bottom: 50px;
}
</style>
<style lang="scss" scoped>
.index-container {
  width: 100%;
  height: auto;
  overflow: hidden;
  margin: 0 auto;
  height: 100vh;
  background-size: cover;
  .title{
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    line-height: 31px;
    color: #000000;
  }
  .content{
    // background: #ffffff;
    text-align: center;
    overflow: hidden;
    .content-top{
      margin: 15px;
      opacity: 1;
      overflow: hidden;
      border-radius: 6px;
      background: url('../../../static/myWallet_bg.png') no-repeat;
      background-size: cover;
      .content-top-top{
        margin: 20px;
        display: flex;
        overflow: hidden;
        justify-content: space-between;
        align-items: center;
        // margin-bottom: 36px;
        .content-top-topL{
          flex: 1;
          text-align: left;
          p{
            margin: 0;
            padding: 0;
          }
          .balance{
            font-size: 12px;
            line-height: 20px;
            font-weight: 400;
            opacity: 0.8;
            color: #FFFFFF;
          }
          .amount{
            margin-top: 6px;
            font-size: 24px;
            line-height: 30px;
            font-weight: 500;
            color: #FFFFFF;
          }
        }
        .content-top-topR{
          overflow: hidden;
          .cash-out{
            display: inline-block;
            width: 68px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            background: rgba($color: #ffffff, $alpha: 0.1);
            font-size: 12px;
            font-weight: 400;
            border-radius: 12px;
            color: #ffffff;
          }
        }
      }
      .content-top-bottom{
        margin: 20px 40px;
        display: flex;
        overflow: hidden;
        justify-content: space-between;
        align-items: center;
        p{
          margin: 0;
          padding: 0;
        }
        .amount-title{
          font-size: 12px;
          line-height: 20px;
          font-weight: 400;
          opacity: 0.8;
          color: #FFFFFF;
        }
        .amount-info{
          font-size: 14px;
          line-height: 20px;
          font-weight: 500;
          color: #FFFFFF;
          word-wrap: break-word;
        }
        .content-top-bottomL{
          width: 40%;
          text-align: left;
          overflow: hidden;
          margin-right: 6px;
        }
        .content-top-bottomR{
          width: 40%;
          text-align: right;
          overflow: hidden;
          margin-left: 6px;
        }
      }
    }
    .content-bottom{
      width: 100%;
      overflow: hidden;
      .content-bottom-top{
        margin: 0px 15px;
        overflow: hidden;
        .content-bottom-topT{
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          p{
            margin: 0;
            padding: 0;
          }
          .details-title{
            font-size: 18px;
            font-weight: 500;
            line-height: 31px;
            color: #000000;
            margin-right: 15px;
          }
          .date{
            font-size: 14px;
            font-weight: 500;
            line-height: 24px;
            color: #000000;
          }
          .up{
            width:0;
            height:0;
            border-right:5px solid transparent;
            border-left:5px solid transparent;
            border-bottom:5px solid #000000;
            margin-bottom: 2px;
            margin-left: 2px;
          }
          .down{
            width:0;
            height:0;
            border-right:5px solid transparent;
            border-left:5px solid transparent;
            border-top:5px solid #000000;
            margin-left: 2px;
          }
        }
        .content-bottom-topB{
          width: 100;
          display: flex;
          text-align: center;
          li{
            width: 56px;
            font-size: 16px;
            font-weight: 500;
            line-height: 27px;
            color: #000000;
            padding-bottom: 4px;
            text-align: center;
          }
          .active{
            color: #5089FF;
            border-bottom: 3px solid #5089FF;
          }
        }
      }
      .content-bottom-bottom{
        margin-top: 15px;
        overflow: hidden;
        height: calc(100vh - 274px);
        .list{
          height: 100%;
          overflow: hidden;
          overflow-y: scroll;
        }
        .item{
          margin: 0px 15px;
          overflow: hidden;
          background: #ffffff;
          border-radius: 6px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          p{
            margin: 0;
            padding: 0;
          }
          .item-left{
            text-align: left;
            margin-left: 12px;
            margin-top: 12px;
            margin-bottom: 14px;
            .item-title{
              font-size: 14px;
              font-weight: 400;
              line-height: 24px;
              color: #000000;
            }
            .item-date{
              margin-top: 4px;
              font-size: 12px;
              font-weight: 400;
              line-height: 14px;
              color: #999999;
            }
          }
          .item-changeAmount{
            margin-right: 12px;
            font-size: 16px;
            font-weight: 400;
            line-height: 27px;
            color: #000000;
          }
        }
      }
    }
  }
}
</style>
