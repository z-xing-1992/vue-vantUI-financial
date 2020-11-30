<!-- login -->
<template>
  <div class="index-container about-wrapper">
    <van-nav-bar left-arrow @click-left="onClickLeft" title="系统消息" fixed placeholder class="title"/>
    <div class="content">
        <div v-if="currentTotal==0" class="no-message">
          <img :src="no_message_icon" alt="no message">
          <p>暂无消息</p>
        </div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="list" v-else>
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
            <div class="item"  v-for="item in itemList" :key="item.id" @click="gotoDetailBtn(item.id)">
              <div class="item-top">
                <div class="item-left">
                  <div class="item-top-icon">
                    <van-image width="40" height="40" :src="message_icon" />
                    <span class="unread" v-if="!item.readStatus"></span>
                  </div>
                  <div class="item-info">
                    <div class="message-content">{{item.detail}}</div>
                    <div class="message-date">{{item.updateTime}}</div>
                  </div>
                </div>
                <div class="item-right">
                  <van-icon :name="message_right" />
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import {getUserNotifyList} from "@/api/home"
import { isEmpty } from '@/utils/validate'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        false: '系统消息未读',
        true: '系统消息已读'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      no_message_icon: require('../../../static/nomessage.png'),
      message_icon: require('../../../static/message_icon.png'),
      message_right: require('../../../static/message_right.png'),
      obj: {
        keyword:'',
        sortBy:'readStatus,createTime_DESC',
        beginTime:'',
        endTime:'',
        debtHousekeeperId:'',
        debtAdvisoryFormType:'',
        page:0,
        rows:10
      },
      currentTotal:0,
      itemList: [],
      loading: false,
      finished: false,
      refreshing: false,
      total:0
    }
  },

  created () {
    let that = this
    let currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if(!isEmpty(currentUser)){
      that.obj.debtHousekeeperId = currentUser.debtFilingUser.id
      that.checkItemListBtn()
    }
  },

  mounted () {},

  methods: {
    gotoDetailBtn(id){
      console.log('点击查看详情')
      this.$router.push({
        path: "/messageDetails",
        query: {
          id: id
        }
      })
    },
    onClickLeft(){
      this.$router.go(-1)
    },
    checkItemListBtn(){
      let that = this
      getUserNotifyList(that.obj).then((res) => {
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
    onRefresh() {
      this.finished = false
      this.loading = true
      this.itemList = []
      this.onLoad()
    },
    onLoad() {
      this.obj.page++
      this.getUserNotifyListBtn()
    },
    getUserNotifyListBtn(){
      let that = this
      if (that.refreshing) {
        that.itemList = []
        that.obj.page = 1
        that.refreshing = false
      }
      getUserNotifyList(that.obj).then((res) => {
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
</style>
<style lang="scss" scoped>
.index-container {
  width: 100%;
  height: auto;
  overflow: hidden;
  margin: 0 auto;
  min-height: 100vh;
  background: #F5F5F5;
  background-size: cover;
  .title{
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    line-height: 31px;
    color: #000000;
  }
  .content{
    width: 100%;
    height: calc(100vh - 46px);
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
      height: 100%;
      overflow: hidden;
      overflow-y: scroll;
      .item{
        margin: 15px;
        border-radius: 6px;
        background: #ffffff;
        overflow: hidden;
        margin-bottom: 10px;
        box-shadow: 0px 3px 6px rgba(137, 137, 137, 0.06);
        .item-top{
          display: flex;
          margin-top: 15px;
          margin-right: 15px;
          align-items: center;
          justify-content: space-between;
          .item-left{
            display: flex;
            justify-content: flex-start;
          }
          .item-top-icon{
            margin-left: 10px;
            margin-right: 10px;
            position: relative;
            .unread{
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: #FF0000;
              position: absolute;
              top: 0;
              right: 0;
            }
          }
          .item-info{
            .message-content{
              font-size: 14px;
              font-weight: 400;
              line-height: 24px;
              display: -webkit-box;
              overflow: hidden;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
            .message-date{
              margin-top: 10px;
              font-size: 12px;
              font-weight: 400;
              line-height: 14px;
              color: #999999;
              margin-bottom: 15px;
            }
          }
          .item-right{
            margin-left: 30px;
            .van-icon{
              font-size: 24px;
              color: #B8C2CC;
            }
          }
        }
      }
    }
  }
}
</style>
