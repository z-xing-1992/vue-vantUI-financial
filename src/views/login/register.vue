<!-- login -->
<template>
  <div class="index-container register-wrapper">
    <van-nav-bar left-arrow @click-left="onClickLeft" title="注册" class="title"/>
    <img :src="logoUrl" class="logo" >
    <div class="content">
      <van-form @submit="onSubmit">
        <van-field
            v-model="info.phoneNumber"
            class="field"
            clearable
            name="phoneNumber"
            type="text"
            :left-icon="phoneNumberUrl"
            placeholder="请输入手机号"
            :rules="[{ validator:isPhone, required: true,message: '请输入正确格式的手机号码' }]">
            <template #right-icon>
                <div class="right-content" @click="clickRight">
                  <span>{{currentAreaNum}}</span>
                  <van-icon name="arrow" />
                </div>
              </template>
          </van-field>
        <van-field
          v-model="info.password"
          class="field1"
          clearable
          type="password"
          name="password"
          placeholder="请输入密码"
          :left-icon="passwordUrl"
          :rules="[{ validator:isPassword, required: true, message: '密码必须包含数字和英文6-24位' }]"
        />
        <van-field v-model="info.yzm" class="field2" type="digit" name="YZM" 
          placeholder="请输入验证码"  clearable
          :left-icon="YZMUrl"
          :rules="[{ validator:isYZMM,  required: true,message: '请输入6位数字的验证码' }]"
          >
          <template #button>
              <van-button size="small" class="vanBtn" @click="sendYZM" :disabled="isYZM">{{content}}</van-button>
          </template>
        </van-field>
        <van-field
          v-model="info.invitationCode"
          class="field3"
          clearable
          name="invitationCode"
          placeholder="请输入邀请码"
          :left-icon="invitationCodeUrl"
          :rules="[{ validator:isSuperId, required: true, message: '邀请码必须包含数字和英文8位' }]"
        />
        <div style="margin: 16px;">
          <van-button  block type="info" native-type="submit" class="loginBtn">注册</van-button>
        </div>
      </van-form>
    </div>
    <!-- 选择电话前缀 -->
    <van-popup v-model="showAreaNum"  position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
  </div>
</template>

<script>
import JSEncrypt from 'jsencrypt'
import {sendSignUpSms, signUp, getOperationCenterName} from "@/api/user"
import { isEmpty,getQueryString } from '@/utils/validate'
import {getToken,setToken} from '@/utils/auth'
import {cityListData} from '@/utils/city'
export default {
  data () {
    return {
      content:'获取验证码',
      isYZM: true,
      showAreaNum:false,
      currentAreaNum:'+86',
      columns: cityListData,
      info: {
        phoneNumber: '',
        password: '',
        yzm:'',
        invitationCode:''
      },
      superId:'',
      logoUrl: require('../../../static/logo.png'),
      phoneNumberUrl: require('../../../static/phoneNumber.png'),
      passwordUrl: require('../../../static/password.png'),
      YZMUrl: require('../../../static/yzm.png'),
      invitationCodeUrl: require('../../../static/invitationCode.png'),
    }
  },

  created () {
    this.cityList = cityListData
    let referreCode = getQueryString('id') || this.$route.query.id
    this.superId = referreCode
    if(!isEmpty(referreCode)){
      this.info.invitationCode = referreCode
      this.checkName(referreCode)
    }
  },

  mounted () {},

  methods: {
    checkName(superId){
      let that = this
      getOperationCenterName(superId).then((res) => {
        if(res && res.code == '200'){
          that.$dialog.alert({
            title:'温馨提示',
            message: res.data
          }).then(() => {})
        }
      }).catch((error) => {
        that.$dialog.alert({
          title: '温馨提示',
          message: '请输入正确的邀请码！'
        }).then(() => {})
      })
    },
    onClickLeft(){
      this.$router.push('/login')
    },
      clickRight(){
        this.showAreaNum = true
      },
      onConfirm(obj, index) {
        this.showAreaNum = false
        this.currentAreaNum = obj.value
      },
      onCancel() {
        this.showAreaNum = false
      },
      sendYZM(){
        let that = this
        that.isYZM = true
        let signUpRequestForm = {
          type: 1,
          phoneNumber: this.currentAreaNum + " " + this.info.phoneNumber
        }
        sendSignUpSms(signUpRequestForm).then((res) => {
          if(res && res.code == 200) {
            that.$dialog.alert({
              title:'温馨提示',
              message: "验证码发送成功"
            }).then(() => {})
          }
        }).catch((error) => {
          that.$dialog.alert({
            title:'温馨提示',
            message: '验证码发送失败，请重试'
          }).then(() => {})
        })
        let timer = 60
        that.content = timer + 's后重新发送验证码'
        let cleatimer = setInterval(()=>{
          timer--
          that.content = timer + 's后重新发送验证码'
          if(timer == 0){
            clearInterval(cleatimer)
            that.isYZM = false
            that.content = '发送验证码'
          }
        },1000)
      },
      isYZMM (val) {
        const re = /^[0-9]{6}$/
        return re.test(val.trim())
      },
      isSuperId(val){
        let that = this
        const re = /^[a-zA-Z0-9]{8}$/
        return re.test(val.trim())
    },
    registerBtn () {
      this.$router.push('/register')
    },

    isPhone (val) {
      const re = /^1[3456789]\d{9}$/
      if(re.test(val.trim())){
        this.isYZM = false
      }else{
        this.isYZM = true
      }
      return re.test(val.trim())
    },

    isPassword (val) {
      const re = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,24}$/
      return re.test(val.trim())
    },
    
    onSubmit () {
      console.log('点击提交')
      let that = this
      console.log(that.info)
      let userInfo = {
        account: that.info.phoneNumber,
        password: that.info.password,
        captcha:that.info.yzm,
        invitationCode : that.info.invitationCode
      }
      console.log(userInfo)
      signUp(userInfo).then((res) => {
        if(res && res.code == 200){
          setToken('access_token',res.accessToken)
          let currentUser = res.data
          localStorage.setItem('currentUser',JSON.stringify(currentUser))
          that.$store.commit('SET_TOKEN',res.accessToken)
          that.$router.push("/home")
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
.register-wrapper .van-field__body input{margin-left: 10px;}
.register-wrapper .rememberBtn .van-checkbox__label{
  color: #999999;
  font-size: 14px;
  font-weight: 400;
}
.register-wrapper .van-hairline--bottom::after{
  border: none;
}
.register-wrapper .van-nav-bar__title{
  font-size: 18px;
  font-weight: 500;
  line-height: 31px;
  color: #000000;
}
.register-wrapper .van-icon-arrow-left{
  color: #000000;
  font-weight: 500;
  font-size: 24px;
}
.field .van-icon{
  font-size: 20px;
  color: #B8C2CC;
}
.field1 .van-icon{
  font-size: 18px;
}
.field1 .van-icon__image{
  height: inherit;
}
.field2 .van-field__left-icon{
  padding-top: 6px;
}
.field2 .van-icon{
  font-size: 18px;
}
.field2 .van-icon__image{
  height: inherit;
}
.field3 .van-icon{
  font-size: 19px;
}
</style>
<style lang="scss" scoped>
.index-container {
  width: 100%;
  height: auto;
  overflow: hidden;
  margin: 0 auto;
  background: #ffffff;
  min-height: 100vh;
  .title{
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    line-height: 31px;
    color: #000000;
    margin-bottom: 30px;
  }
  .logo{
    display: block;
    margin: 0 auto;
    width: 130px;
  }
  .content {
    margin: 0 20px;
    margin-top: 60px;
    overflow: hidden;
    font-size: 14px;
    font-weight: 400;
    .vanBtn{
      color: #5089FF;
      font-size: 14px;
      font-weight: 400;
      border: 1px solid #5089FF;
    }
    .right-content{
      width: 64px;
      text-align: right;
    }
    .right-content span{
      display: inline-block;
      float: left;
    }
    .btns{
      margin: 0 16px;
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      margin-bottom: 30px;
      color: #999999;
      font-size: 14px;
      font-weight: 400;
      .rememberBtn .van-checkbox__label{
        color: #999999;
      }
    }
    .loginBtn{
      background: #5089FF;
      border-color: #5089FF;
      font-size: 18px;
    }
    .registerBtn{
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      color: #5089FF;
      margin-top: 22px;
      letter-spacing: 2px;
    }
  }
}
</style>
