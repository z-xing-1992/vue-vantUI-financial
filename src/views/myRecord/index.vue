<!-- login -->
<template>
  <div class="index-container about-wrapper">
    <!-- <van-nav-bar left-arrow @click-left="onClickLeft" class="title" fixed>
      <template #title>
        {{currentType | currentTitleName}}
      </template>
    </van-nav-bar> -->
    <div class="content">
      <div class="content-top">
        <van-icon name="arrow-left" class="back" @click="onClickLeft"/>
        <p>欢迎来到{{currentType | currentTitleName}}</p>
      </div>
      <div class="content-bottom">
        <p class="content-title">财务咨询费用</p>
        <ul class="pay-wrapper">
          <li class="pay-tips">
            <p class="tips-left">需支付金额</p>
            <p class="tips-rith">¥{{consultingFee}}</p>
          </li>
          <li>
            <van-radio-group v-model="radio">
              <van-cell-group>
                <van-cell :icon="weChat" title="微信支付" clickable @click="radio = '1'">
                  <template #right-icon>
                    <van-radio name="1" />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </li>
        </ul>
        <div class="tip-wrapper">
          <p class="tips-title">备案说明:</p>
          <div class="info-detials" v-html="recordDescription">
          </div>
        </div>
        <div class="btn-wrapper">
          <div class="agree-wrapper">
            <van-checkbox v-model="agreeBoolean">
              <p class="explain-tips">本人同意第三方免责声明</p>
            </van-checkbox>
            <p class="explainBtn" @click="explainBtn">{{explain}}</p>
          </div>
          <van-button type="info" class="confirm-pay" @click="confirmPayBtn">确认支付</van-button>
        </div>
      </div>
    </div>
    <!-- 免责说明 -->
    <van-popup v-model="showExplain" class="explain-content" closeable>
      <div class="explain-wrapper">
        <p class="explain-title">备案须知</p>
        <div class="explain-info" v-html="recordNotice">
        </div>
        <div class="explain-btns">
          <van-button plain type="info" class="rejectBtn" @click="agreeBtn(false)">不同意</van-button>
          <van-button type="info" class="agreeBtn" @click="agreeBtn(true)">同意</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { isEmpty,getQueryString,isWeiXin } from '@/utils/validate'
import { getDebtSetting,createOrderForm } from "@/api/myDebt"
export default {
  filters: {
    currentTitleName(status) {
      const statusMap = {
        1: '企业咨询备案',
        2: '个人咨询备案'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      weChat: require('../../../static/weChat.png'),
      currentType:1,
      radio:'1',
      agreeBoolean:false,
      explain:'<<熙阳小镇备案须知>>',
      showExplain:false,
      consultingFee:0,//咨询费
      recordDescription:'',//备案说明
      recordNotice:'',//备案须知
      code:'',
      info:{
        "orderFormData":{
          "advisoryType":1 //1是个人 2是企业
        },
        "paymentScenes":"JSAPI",//支付场景 JSAPI->微信内支付 NATIVE->原生支付 APP->程序内支付 MWEB->手机网页支付
        "paymentMode":1,// 付款方式 0->钱包支付 1->微信支付 2->支付宝支付 3->银联支付
        "redirectUrl":"",
        "orderFormType":5// 订单类型 0->商品订单 1->定制订单 2->充值订单 3->购买会员卡订单 4->积分订单 5->咨询备案订单
      }
    }
  },

  created () {
    let that = this
    let type = getQueryString('type') || that.$route.query.type
    if(!isEmpty(type)){
      that.currentType = type
      that.getSettingBtn()
      if (isWeiXin()) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        if(currentUser.wppOpenId){
          // 已存在不用继续授权code
        } else {
          // 不存在则需要授权code
          // that.getCode()
          // code 授权
          that.code = getQueryString('code')
          // 存在code
          if(that.code) {
            let obj = {
              "code": that.code,
              "userId": currentUser.id,
              "codeOrigin":0
            }
            getUserInfoByCode(obj).then(res=>{
              console.log('绑定')
              console.log(res)
              if(res.data.data.wppOpenId) {
                sessionStorage.setItem('wppOpenId',res.data.data.wppOpenId)
              }
            }).catch(error=>{
              console.log(error)
            })
          } else {
            // 不存在
            that.getCodeBtn()
          }
        }
      } else{
        console.log('不是微信浏览器，h5支付')
				that.info.paymentScenes = 'MWEB'
      }
    }
  },

  mounted () {},

  methods: {
    getCodeBtn(){
      let appid =  'wxef89d3e3e2b74ced' //熙阳小镇
      let REDIRECT_URI = encodeURIComponent(this.$HOST_NAME+'/debtSystem/myRecord?type='+this.currentType)
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+REDIRECT_URI+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
    },
    onClickLeft(){
      this.$router.go(-1)
    },
    getSettingBtn(){
      let that = this
      getDebtSetting().then((res)=>{
        if(res && res.code==200){
          if(that.currentType == 1){
            // 企业
            that.consultingFee = res.data.companyConsultingFee
            that.recordDescription = res.data.companyConsultingIntroduction
            that.recordNotice = res.data.filingInstructions
          }
          if(that.currentType == 2){
            // 个人
            that.consultingFee = res.data.selfConsultingFee
            that.recordDescription = res.data.selfConsultingIntroduction
            that.recordNotice = res.data.filingInstructions
          }
          that.info.redirectUrl = encodeURIComponent(that.$HOST_NAME+"/debtSystem/pay")
        }
      }).catch((error)=>{
        that.$dialog.alert({
          title:'温馨提示',
          message: error
        }).then(() => {})
      })
    },
    explainBtn(){
      console.log('点击查看备案须知')
      this.showExplain = true
    },
    agreeBtn(text){
      this.showExplain = false
      this.agreeBoolean = text
    },
    confirmPayBtn(){
      let that = this
      if(!that.agreeBoolean){
        that.showExplain = true
      } else {
        console.log('点击了确认支付')
				console.log(that.info)
				if(isWeiXin()){
					that.payJSAPIBtn()
				} else {
					that.payH5Btn()
				}
      }
    },
    payJSAPIBtn(){
      let that = this
      createOrderForm(that.info).then((res) => {
        if(res && res.code === 200) {
          const pay_params = res.data
          if (typeof WeixinJSBridge === "undefined"){
            if(document.addEventListener){
              document.addEventListener('WeixinJSBridgeReady', that.onBridgeReady, false)
            }else if (document.attachEvent){
              document.attachEvent('WeixinJSBridgeReady', that.onBridgeReady)
              document.attachEvent('onWeixinJSBridgeReady', that.onBridgeReady)
            }
          }else{
            that.onBridgeReady(pay_params)
          }
        }
      }).catch(error =>{
        that.$dialog.alert({
          title:'温馨提示',
          message: error
        }).then(() => {})
      })
    },
    payH5Btn(){
      createOrderForm(this.info).then((res) => {
        console.log('payH5')
        console.log(res)
        if(res && res.code == 200){
          window.location.href = res.data
        }
      }).catch(error =>{
        that.$dialog.alert({
          title:'温馨提示',
          message: error
        }).then(() => {})
      })
    },
    onBridgeReady(params){
      let that = this
      WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
        "appId": params.appId,  //公众号名称，由商户传入
        "timeStamp": params.timeStamp, //支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        "nonceStr": params.nonceStr,  //支付签名随机串，不长于 32 位
        "package": params.package,//统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        "signType": 'MD5',  //签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        "paySign": params.paySign, //支付签名
      },
      function (res) {
        if (res.err_msg === "get_brand_wcpay_request:ok") {
          that.$router.replace({
            path: '/pay',
            query: {
              orderFormId: params.orderFormId
            }
          })
        } else if (res.err_msg === "get_brand_wcpay_request:fail") {
          that.$dialog.alert({
            title:'温馨提示',
            message: '支付失败，请检查后重试'
          }).then(() => {})
        }
      })
    },
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
.pay-wrapper .van-cell{
  padding-left: 0px;
  padding-right: 0px;
}
.pay-wrapper .van-hairline--top-bottom::after{
  border: none;
}
.pay-wrapper .van-cell__left-icon{
  font-size: 24px;
  margin-right: 10px;
}
.pay-wrapper .van-cell__title span{
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: #000000;
}
.pay-wrapper .van-radio__icon--checked .van-icon{
  background-color: #5089FF;
  border-color: #5089FF;
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
  .content{
    width: 100%;
    overflow: hidden;
    position: relative;
    background: #5089FF;
    .content-top{
      width: 100%;
      height: 124px;
      background: url('../../../static/home_bg.png') no-repeat;
      background-size: cover;
      position: relative;
      .back{
        color: #ffffff;
        font-weight: 500;
        font-size: 24px;
        margin-left: 16px;
        margin-top: 16px;
      }
      p{
        margin: 0;
        padding: 0;
        font-size: 22px;
        font-weight: 400;
        line-height: 37px;
        color: #FFFFFF;
        letter-spacing: 2px;
        padding-top: 18px;
        padding-bottom: 44px;
        padding-left: 15px;
      }
    }
    .content-bottom{
      overflow: hidden;
      border-radius: 10px 10px 0px 0px;
      background: #ffffff;
      padding: 0 30px;
      .content-title{
        font-size: 18px;
        font-weight: 500;
        line-height: 31px;
        color: #000000;
        text-align: center;
      }
      .pay-wrapper{
        width: 100%;
        overflow: hidden;
        .pay-tips{
          width: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          font-weight: 500;
          line-height: 24px;
          color: #000000;
          .tips-rith{
            font-size: 20px;
          }
        }
      }
      .tip-wrapper{
        width: 100%;
        overflow: hidden;
        .tips-title{
          font-size: 14px;
          font-weight: 500;
          line-height: 24px;
          color: #333333;
        }
        .info-detials{
          font-size: 12px;
          font-weight: 400;
          line-height: 20px;
          color: #666666;
        }
      }
      .btn-wrapper{
        width: 100%;
        overflow: hidden;
        margin-top: 40px;
        .agree-wrapper{
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .explain-tips{
            font-size: 12px;
            font-weight: 400;
            color: #999999;
          }
          .explainBtn{
            margin-left: 6px;
            color: #5089FF;
            font-weight: 400;
            font-size: 12px;
          }
        }
        .confirm-pay{
          width: 100%;
          margin: 30px 0px;
          background: #5089FF;
          border-color: #5089FF;
          font-size: 18px;
        }
      }
    }
  }
  .explain-content{
    width: 315px;
    height: auto;
    background: #FFFFFF;
    border-radius: 6px;
    overflow: hidden;
    .explain-wrapper{
      padding-top: 30px;
      margin: 0 20px;
      overflow: hidden;
      p{
        margin: 0;
        padding: 0;
      }
      .explain-title{
        font-size: 20px;
        font-weight: 400;
        line-height: 34px;
        color: #333333;
        text-align: center;
        margin-bottom: 30px;
      }
      .explain-info{
        width: 100%;
        max-height: 300px;
        overflow: hidden;
        overflow-y: scroll;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        color: #333333;
        img{
          display: inline-block;
          width: 80% !important;
        }
      }
      .explain-btns{
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: 400;
        button{
          width: 50%;
        }
        .rejectBtn{
          margin-right: 5px;
          color: #5089FF;
          border-color: #5089FF;
        }
        .agreeBtn{
          margin-left: 5px;
          background: #5089FF;
          border-color: #5089FF;
        }
      }
    }
  }
}
</style>
