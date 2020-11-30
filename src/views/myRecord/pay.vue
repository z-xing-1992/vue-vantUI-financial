<template>
  <div class="index-container about-wrapper">
    <van-nav-bar left-arrow @click-left="onClickLeft" class="title" fixed>
      <template #title>
        {{currentType | currentTitleName}}
      </template>
    </van-nav-bar>
    <div class="content">
      <div class="success-wrapper" v-if="currentType == 1">
        <van-icon :name="successUrl" class="success-tips"/>
        <p class="tips">支付成功</p>
      </div>
      <div class="fail-wrapper" v-if="currentType == 2">
        <van-icon name="close" class="fail-tips"/>
        <p class="tips">支付失败</p>
      </div>
      <div class="btn-wrapper">
        <van-button type="info" class="btn" @click="confirmBtn">确定</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty,getQueryString,isWeiXin } from '@/utils/validate'
import { getOrderState } from "@/api/myDebt"
export default {
  filters: {
    currentTitleName(status) {
      const statusMap = {
        1: '支付成功',
        2: '支付失败'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      currentType:1,
      successUrl:require('../../../static/success.png'),
      currentObj:{}
    }
  },

  created () {
    let orderFormId = getQueryString('orderFormId') || this.$route.query.orderFormId
    if(!isEmpty(orderFormId)){
      this.getOrderStateBtn(orderFormId)
    }
  },

  mounted () {},

  methods: {
    onClickLeft(){
      this.$router.go(-1)
    },
    getOrderStateBtn(orderFormId){
      let that = this
      getOrderState(orderFormId).then((res)=>{
        if(res && res.code == 200){
          that.currentObj = res.data
          if(res.data.state == 0){
            that.currentType = 2
          }
        }
      }).catch((error)=>{
        that.$dialog.alert({
          title: '温馨提示',
          message: error
        })
      })
    },
    confirmBtn(){
      if(this.currentType == 1){
        // 支付成功 返回备案
        this.$router.replace('/myRecordForm')
      }
      if(this.currentType == 2){
        // 支付失败 返回
        this.onClickLeft()
      }
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
}

</style>
<style lang="scss" scoped>
.index-container {
  width: 100%;
  height: auto;
  overflow: hidden;
  margin: 0 auto;
  height: 100vh;
  background: #ffffff;
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
    padding-top: 46px;
    overflow: hidden;
    position: relative;
    .success-wrapper{
      width: 100%;
      text-align: center;
      margin-top: 51px;
      .success-tips{
        font-size: 116px;
      }
    }
    .fail-wrapper{
      width: 100%;
      text-align: center;
      margin-top: 51px;
      .fail-tips{
        font-size: 116px;
      }
    }
    .tips{
      margin-top: 15px;
      font-size: 18px;
      font-weight: 400;
      line-height: 31px;
      color: #000000;
      letter-spacing: 2px;
      margin-bottom: 60px;
    }
    .btn-wrapper{
      padding: 0px 15px;
      overflow: hidden;
      .btn{
        width: 100%;
        background: #5089FF;
        border-color: #5089FF;
        font-size: 18px;
        font-weight: 400;
        color: #FFFFFF;
        letter-spacing: 2px;
        border-radius: 4px;
      }
    }
  }
}
</style>
