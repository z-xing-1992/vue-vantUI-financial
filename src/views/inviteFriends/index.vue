<!-- login -->
<template>
  <div class="index-container about-wrapper">
    <van-nav-bar left-arrow @click-left="onClickLeft" title="邀请好友" fixed placeholder class="title"/>
    <div class="content">
      <div class="article">
        <vue-qr :text="currentUrl" :size="200"></vue-qr>
        <p class="tips">扫描邀请码</p>
        <p class="tips1">邀请好友，赚佣金。</p>
        <div class="articl-bottom">
          <span class="articl-bottom-left"></span>
          <span class="articl-bottom-right"></span>
        </div>
      </div>
      <div class="article1">
        <div class="article1-top">
          <span class="article1-top-left"></span>
          <span class="article1-top-right"></span>
        </div>
        <p class="invitationCode">{{invitationCode}}</p>
        <div class="invitationCodeTips">
          <span></span>
          <p>我的邀请码</p>
          <span></span>
        </div>
        <van-button class="invitationCodeBtn" :data-clipboard-text="invitationCode" @click="copy">复制邀请码</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty } from '@/utils/validate'
import vueQr from 'vue-qr'
import ClipboardJS from 'clipboard'
export default {
  components: {
    vueQr
  },
  data () {
    return {
      invitationCode:'',
      currentUrl:''
    }
  },

  created () {
    let that = this
    let currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if(!isEmpty(currentUser)){
      that.currentUrl = that.$HOST_NAME+'/debtSystem/register?id='+currentUser.referrerCode
      that.invitationCode = currentUser.referrerCode
    }
  },

  mounted () {},

  methods: {
    onClickLeft(){
      this.$router.go(-1)
    },
    // 复制邀请码
    copy(){
      let that = this
      let clipboard = new ClipboardJS('.invitationCodeBtn')
      clipboard.on('success', function (e) {
        that.$toast({
          message: '复制成功',
          duration: 1000
        })
        clipboard.destroy()
      })
      clipboard.on('error', function (e) {
        that.$toast({
          message: '复制失败',
          duration: 1000
        })
        clipboard.destroy()
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
  background: url('../../../static/invite_bg.png') no-repeat;
  background-size: cover;
  .title{
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    line-height: 31px;
    color: #000000;
  }
  .content{
    margin-top: 15px;
    margin-left: 25px;
    margin-right: 25px;
    overflow: hidden;
    margin-bottom: 15px;
    .article{
      width: 100%;
      border-radius: 6px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px 0px 0px 0px;
      margin-bottom: 10px;
      p{
        margin: 0;
        padding: 0;
      }
      .tips{
        font-size: 16px;
        font-weight: 500;
        line-height: 27px;
        color: #000000;
      }
      .tips1{
        font-size: 12px;
        font-weight: 500;
        line-height: 20px;
        color: #000000;
        opacity: 0.3;
      }
      .articl-bottom{
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        justify-content:space-between;
        .articl-bottom-left{
          margin-left: 25px;
          width: 16px;
          height: 22px;
          overflow: hidden;
          background: url('../../../static/icon.png') no-repeat;
          background-size: cover;
        }
        .articl-bottom-right{
          margin-right: 25px;
          width: 16px;
          height: 22px;
          overflow: hidden;
          background: url('../../../static/icon.png') no-repeat;
          background-size: cover;
        }
      }
    }
    .article1{
      width: 100%;
      border-radius: 6px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .article1-top{
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        justify-content:space-between;
        .article1-top-left{
          margin-left: 25px;
          width: 16px;
          height: 22px;
          overflow: hidden;
          background: url('../../../static/icon.png') no-repeat 0px -28px;
          background-size: cover;
        }
        .article1-top-right{
          margin-right: 25px;
          width: 16px;
          height: 22px;
          overflow: hidden;
          background: url('../../../static/icon.png') no-repeat 0px -28px;
          background-size: cover;
        }
      }
      p{
        margin: 0;
        padding: 0;
      }
      .invitationCode{
        font-size: 36px;
        font-weight: bold;
        line-height: 43px;
        color: #000000;
      }
      .invitationCodeTips{
        font-size: 16px;
        font-weight: 500;
        line-height: 27px;
        color: #666666;
        margin-top: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        span{
          width: 4px;
          height: 4px;
          background: #999999;
          border-radius: 50%;
        }
        p{
          margin: 0 6px;
        }
      }
      .invitationCodeBtn{
        width: 160px;
        height: 48px;
        background: #D4B27B;
        border: none;
        margin-top: 20px;
        margin-bottom: 30px;
        font-size: 22px;
        font-weight: 500;
        line-height: 37px;
        color: #FFFFFF;
      }
    }
  }
}
</style>
