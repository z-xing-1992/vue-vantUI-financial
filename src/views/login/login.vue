<!-- login -->
<template>
  <div class="index-container login-wrapper">
    <van-nav-bar title="财务咨询管理系统" class="title"/>
    <img :src="logoUrl" class="logo" >
    <div class="content">
      <van-form @submit="onSubmit">
        <van-field
          v-model="info.phoneNumber"
          class="field"
          clearable
          name="phoneNumber"
          :left-icon="phoneNumberUrl"
          placeholder="请输入手机号"
          :rules="[{ validator:isPhone, required: true,message: '请输入正确格式的手机号码' }]"
        />
        <van-field
          v-model="info.password"
          class="field1"
          clearable
          type="password"
          name="password"
          placeholder="请输入密码"
          :left-icon="passwordUrl"
          :rules="[{ validator:isPassword, required: true, message: '请输入正确格式的密码' }]"
        />
        <div class="btns">
          <van-checkbox v-model="info.checked" class="rememberBtn">记住账号密码</van-checkbox>
          <span class="forgetPassBtn" @click="forgetPassBtn">忘记密码</span>
        </div>
        <div style="margin: 16px;">
          <van-button  block type="info" native-type="submit" class="loginBtn">登录</van-button>
          <span class="registerBtn" @click="registerBtn"><span class="register-tips">没有账号？</span>立即注册<van-icon name="arrow" /></span>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import JSEncrypt from 'jsencrypt'
import {signIn,getSelfInfo} from "@/api/user"
import { isEmpty } from '@/utils/validate'
import {getToken,setToken} from '@/utils/auth'
export default {
  data () {
    return {
      info: {
        phoneNumber: '',
        password: '',
        checked:false,
      },
      logoUrl: require('../../../static/logo.png'),
      phoneNumberUrl: require('../../../static/phoneNumber.png'),
      passwordUrl: require('../../../static/password.png')
    }
  },

  created () {
    let that = this
    // 有token未过期的情况
    if(!isEmpty(getToken('access_token'))){
      getSelfInfo().then((res) => {
        if(res && res.code == 200) {
          that.$router.push("/home")
        }
      }).catch((error)=>{
        that.$dialog.alert({
          title:'温馨提示',
          message: error
        }).then(() => {})
      })
    }

    // 记住密码的情况
    if(!isEmpty(localStorage.getItem('accountObj'))){
      let accountObj = JSON.parse(localStorage.getItem('accountObj'))
      if(accountObj.checked){
        that.info.phoneNumber = accountObj.phoneNumber
        that.info.password = accountObj.password
        that.info.checked = accountObj.checked
        // 解密
        let priveKey = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAObMypmVMh53EOEO7N9JCHHIcrgjzPyujlWmG8Q16vw1czpUGVBewVMleuJA9v1R+b+ZIjZty2zMuZGLqKZ9fTFskpzu60QOxi2G7j6YJQhYQpDfpIayv+xau/rYW3QMxhz/bfDovL1LpI79Q3h22oj4s4lqDuhFBJm2qaqbu041AgMBAAECgYBDZO+QM1nEPZ5nKZWPieL2XsLo9ENKUapsZinbfKcWaIEyOhZ+On0XS217nd7Bj+tuwEeWPy9UoN9bGb3wh9pDQ2hWD768RglDxFa7ONQqqckeEGPNRHI5uG49Q35lBA7k4+0HO+bfpkpucPcvCrkskk2UV4XAzufOsvvuz+TSrQJBAPbPO6mYIXqluKwJjYGMeis4CVXgeyXXlY4ltDjTcgLo30qJ/YGq2kHM3s/sA8CfWMzjs5gmjPE0PW9chGRo1E8CQQDvZPGflWfV6KY46koQEAjAipd2sRFCWYWEXSjBYVdJGX4lqVs80rnBDlMKH9i/fEBFXD9TJM3T4RZYXLyJz6A7AkBR/CDrgzeL0ET6EOpKoGlstd6UAk+mEGkDoQ6u2b5DrSuPTStCyYha1z0kgFf2wnfzB6h+4D9tWFcYCPmJiTENAkBmKl1X7so2pygxSAO9oSorCbqkQ+MKvuvVVnCrPuCiaMfGSOWQKpptwrA7tOWqqts+/qRj1mQlFX2UzlcENWC7AkEA7SRlSn4oYobmRjhrRcUP/cZbT4VZJedgKxPhbgD/APJLHHMXIuENS1lbiBujiYR+xb+40PyOQZ15/A9zRvuBiQ=='
        let jsEncrypt = new JSEncrypt()
        jsEncrypt.setPrivateKey(priveKey)
        let res = jsEncrypt.decrypt(that.info.password)
        that.info.password = res
        console.log(that.info)
      }
    }
  },

  mounted () {},

  methods: {
    registerBtn () {
      this.$router.push('/register')
    },
    isPhone (val) {
      const re = /^1[3456789]\d{9}$/
      return re.test(val.trim())
    },

    isPassword (val) {
      const re = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,24}$/
      return re.test(val.trim())
    },
    
    forgetPassBtn () {
      console.log("忘记密码")
      this.$router.push('/updatePassword')
    },

    onSubmit () {
      console.log('点击提交')
      let that = this
      console.log(that.info)
      console.log(that.info.checked)
      let userInfo = {
        account: that.info.phoneNumber,
        password: that.info.password
      }
      signIn(userInfo).then((res) => {
        if(res && res.code == 200){
          // 缓存当前的token
          setToken('access_token',res.accessToken)
          let currentUser = res.data
          localStorage.setItem('currentUser',JSON.stringify(currentUser))
          // 首页
          this.$store.commit('SET_TOKEN',res.accessToken)
          that.$router.push("/home")
        }
      }).catch((error=>{
        that.$dialog.alert({
          title:'温馨提示',
          message: error
        }).then(() => {})
      }))
      // 处理记住密码逻辑
      if(that.info.checked){
        let currentObj = that.info
        // 加密密码
        let publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDmzMqZlTIedxDhDuzfSQhxyHK4I8z8ro5VphvENer8NXM6VBlQXsFTJXriQPb9Ufm/mSI2bctszLmRi6imfX0xbJKc7utEDsYthu4+mCUIWEKQ36SGsr/sWrv62Ft0DMYc/23w6Ly9S6SO/UN4dtqI+LOJag7oRQSZtqmqm7tONQIDAQAB'          
        let encrypt = new JSEncrypt()
        encrypt.setPublicKey(publicKey)
        let res1 = encrypt.encrypt(currentObj.password)
        currentObj.password = res1
        // 缓存到本地
        localStorage.setItem('accountObj',JSON.stringify(currentObj))
      } else {
        localStorage.removeItem('accountObj')
      }
    }
  }
}
</script>
<style>
.login-wrapper .van-field__body input{margin-left: 10px;}
.login-wrapper .rememberBtn .van-checkbox__label{
  color: #999999;
  font-size: 14px;
  font-weight: 400;
}
.login-wrapper .van-hairline--bottom::after{
  border: none;
}
.login-wrapper .van-nav-bar__title{
  font-size: 18px;
  font-weight: 500;
  line-height: 31px;
  color: #000000;
}
.rememberBtn .van-icon-success{
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
}
.rememberBtn .van-checkbox__icon--checked .van-icon{
  background-color: #5089FF;
  border-color: #5089FF;
}
.field .van-icon{
  font-size: 20px;
}
.field1 .van-icon{
  font-size: 18px;
}
.field1 .van-icon__image{
  height: inherit;
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
    margin-top: 74px;
    overflow: hidden;
    font-size: 14px;
    font-weight: 400;
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
      .register-tips{
        color: #999999;
      }
    }
  }
}
</style>
