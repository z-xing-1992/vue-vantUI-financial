<!-- login -->
<template>
  <div class="index-container about-wrapper">
    <van-nav-bar left-arrow @click-left="onClickLeft" title="消息详情" fixed placeholder class="title"/>
    <div class="content">
      <div class="article">
        <p class="date">{{messageInfo.updateTime}}</p>
        <p class="info">{{messageInfo.summary}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {getWalletLogDetails} from "@/api/home"
import { isEmpty,getQueryString } from '@/utils/validate'
export default {
  data () {
    return {
      messageInfo:{}
    }
  },

  created () {
    let id = getQueryString('id') || this.$route.query.id
    if(!isEmpty(id)){
      this.getWalletLogDetailsBtn(id)
    }
  },

  mounted () {},

  methods: {
    onClickLeft(){
      this.$router.go(-1)
    },
    getWalletLogDetailsBtn(id){
      let that = this
      getWalletLogDetails(id).then((res)=>{
          if(res && res.code == 200){
            that.messageInfo = res.data
          }
        }).catch((error)=>{
          that.$dialog.alert({
            title: '温馨提示',
            message: res.msg
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
    .article{
      margin: 15px;
      border-radius: 6px;
      overflow: hidden;
      background: #ffffff;
      padding: 15px;
      .date{
        font-size: 12px;
        font-weight: 400;
        line-height: 14px;
        color: #999999;
        text-align: right;
      }
      .info{
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        color: #000000;
      }
    }
  }
}
</style>
