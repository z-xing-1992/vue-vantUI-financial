<!-- login -->
<template>
  <div class="index-container about-wrapper">
    <van-nav-bar left-arrow @click-left="onClickLeft" title="关于我们" fixed class="title"/>
    <div class="content">
      <van-image width="120" height="168" :src="aboutLogo" />
      <div class="info-title">
        <span class="title-left"></span>
        <p class="title-content">公司简介</p>
        <span class="title-right"></span>
      </div>
      <div v-html="aboutUs" class="article"></div>
    </div>
  </div>
</template>

<script>
import {getDebtSetting} from "@/api/home"
export default {
  data () {
    return {
      aboutLogo:require('../../../static/about_logo.png'),
      aboutUs:''
    }
  },

  created () {
    this.getDebtSettingBtn()
  },

  mounted () {},

  methods: {
    onClickLeft(){
      this.$router.go(-1)
    },
    getDebtSettingBtn(){
      let that = this
      getDebtSetting().then((res) => {
        if(res && res.code == 200){
          that.aboutUs = res.data.aboutUs
        }
      }).catch((error)=>{
        that.$dialog.alert({
          title:'温馨提示',
          message: error
        }).then(() => {})
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
  overflow-y: scroll;
  margin: 0 auto;
  min-height: 100vh;
  background: url('../../../static/about_bg.png') no-repeat;
  background-size: cover;
  .title{
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    line-height: 31px;
    color: #000000;
  }
  .content{
    margin: 15px;
    margin-top: 61px;
    background: #ffffff;
    border-radius: 6px;
    text-align: center;
    overflow: hidden;
    .info-title{
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .title-left{
        width: 23px;
        height: 2px;
        overflow: hidden;
        background: url('../../../static/about_icon1.png') no-repeat;
        background-size: cover;
      }
      .title-right{
        width: 23px;
        height: 2px;
        overflow: hidden;
        background: url('../../../static/about_icon2.png') no-repeat;
        background-size: cover;
      }
      .title-content{
        margin: 0 4px;
        font-size: 18px;
        font-weight: 500;
        color: #000000;
      }
    }
    .article{
      margin: 0 15px 15px 15px;
      font-size: 16px;
      font-weight: 400;
      color: #000000;
      text-align: left;
      text-indent: 2em;
    }
  }
}
</style>
