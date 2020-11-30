<!-- login -->
<template>
  <div class="index-container register-wrapper">
    <van-nav-bar left-arrow @click-left="onClickLeft" title="重置密码" class="title"/>
    <div class="content">
      <van-form @submit="onSubmit">
        <van-field
            v-model="info.phoneNumber"
            class="pfield"
            clearable
            name="phoneNumber"
            type="text"
            ref="phoneNumber"
            placeholder="请输入手机号"
            :rules="[{ validator:isPhone, required: true,message: '请输入正确格式的手机号码' }]">
            <template #right-icon>
                <div class="right-content" @click="clickRight">
                  <span>{{currentAreaNum}}</span>
                  <van-icon name="arrow" />
                </div>
              </template>
          </van-field>
        <van-field v-model="info.yzm" type="digit" name="YZM" 
          placeholder="请输入验证码"  clearable
          :rules="[{ validator:isYZMM,  required: true,message: '请输入6位数字的验证码' }]"
          >
          <template #button>
              <van-button size="small" class="vanBtn" @click="sendYZM" :disabled="isYZM">{{content}}</van-button>
          </template>
        </van-field>
        <van-field
          v-model="info.password"
          class="field"
          clearable
          type="password"
          name="password"
          placeholder="请输入密码"
          :rules="[{ validator:isPassword, required: true, message: '密码必须包含数字和英文6-24位' }]"
        />
        <van-field
          v-model="info.confirmPassword"
          class="field"
          clearable
          type="password"
          name="confirmPassword"
          placeholder="请再次确认密码"
          :rules="[{ validator:isCheckPassword, required: true, message: '前后两次密码不一致' }]"
        />
        <div style="margin: 16px;">
          <van-button  block type="info" native-type="submit" class="loginBtn">确定</van-button>
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
import {sendUpdateSms, signUp, UpdatePwd} from "@/api/user"
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
        confirmPassword:''
      },
      logoUrl: require('../../../static/logo.png'),
      phoneNumberUrl: require('../../../static/phoneNumber.png'),
      passwordUrl: require('../../../static/password.png'),
      YZMUrl: require('../../../static/yzm.png'),
    }
  },

  created () {
    this.cityList = cityListData
    let phoneNumber = getQueryString('phoneNumber') || this.$route.query.phoneNumber
    if(!isEmpty(phoneNumber)){
      this.info.phoneNumber = phoneNumber
      this.isYZM = false
    }
  },

  mounted () {},

  methods: {
      isCheckPassword(val){
        if(this.info.password == val){
          return true
        } else {
          return false
        }
      },
    onClickLeft(){
      this.$router.go(-1)
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
          type: 4,
          phoneNumber: this.currentAreaNum + " " + this.info.phoneNumber
        }
        sendUpdateSms(signUpRequestForm).then((res) => {
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
      let obj = {}
      obj.phoneNumber = that.info.phoneNumber
      obj.newPassword = that.info.password
      obj.captcha = that.info.yzm
      obj.type = "0"  //类型 0->通过短信验证码更换密码 1->通过id和旧密码更换密码 2->通过邮箱验证码更换密码
      console.log(obj)
      UpdatePwd(obj).then((res) => {
        if(res && res.code == 200){
          that.$dialog.alert({
            title:'温馨提示',
            message: '修改成功，请重新登录'
          }).then(() => {
            this.$router.push('/login')
          })
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
.pfield .van-icon{
  color: #B8C2CC;
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
    // margin-top: 74px;
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
