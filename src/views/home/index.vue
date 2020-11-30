<!-- login -->
<template>
  <div class="index-container register-wrapper">
    <van-nav-bar title="财务咨询管理系统" class="title"/>
    <div class="content">
      <div class="content-top">
        <van-icon
        :name="messageUrl"
        :badge="messageNum"
        class="message"
        @click="messageBtn"
        v-if="messageNum > 0"
        />
        <van-icon :name="messageUrl" class="message" @click="messageBtn" v-else />
        <div class="userInfo">
          <div class="userInfo-left">
            <img :src="userLogo" @click="chooseImg" >
            <div class="camery">
              <!-- 上传头像组件 -->
              <van-uploader :after-read="uploadHeaderPhoto" ref="uploadImg" :accept="'image/*'" />
            </div>
          </div>
          <div class="userInfo-right">
            <p class="editUserName" @click="editUserNameBtn">{{currentUser.realName}}</p>
            <p>熙阳小镇欢迎您!</p>
          </div>
        </div>
      </div>
      <div class="content-bottom">
        <div class="content-info">
          <div class="content-bottom-top">
            <van-row type="flex" class="menu">
              <van-col span="6" v-for="(item,index) in menuList" :key="index" @click="itemClickBtn(item.eventBtn)">
                <van-image width="48" height="48" :src="item.icon" />
                <p class="menuName">{{item.name}}</p>
              </van-col>
            </van-row>
          </div>
          <div class="content-bottom-bottom">
            <van-cell :title="item.name" :icon="item.icon" is-link v-for="(item,index) in itemList" :key="index" @click="itemClickBtn(item.eventBtn)"/>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑用户昵称 -->
    <van-dialog v-model="showEditUserName" title="编辑登记用户名" show-cancel-button @confirm='editCurrentUserNameBtn'>
      <van-field v-model="currentUserName" placeholder="请设置登记人姓名或单位" class="editUserName" clearable ref="editUserName"/>
    </van-dialog>
    <!-- 选择我要备案 -->
    <van-popup v-model="showRecord" class="record-content">
      <div class="record-wrapper">
        <p class="record-title">请选择咨询类型</p>
        <ul>
          <li v-for="(item,index) in recordList" :key="index" @click="gotoRecordBtn(index)">
            <p>{{item.title}}</p>
            <img :src="item.imgUrl">
          </li>
        </ul>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {uploadKeepSource,updateAvatar,getSelfInfo,getReadNotifyCount,loggedOut,updateRealName} from "@/api/user"
import { isEmpty } from '@/utils/validate'

export default {
  data () {
    return {
      recordList:[
        {
          title: '企业咨询',
          imgUrl: require('../../../static/enterprise.png')
        },
        {
          title: '个人咨询',
          imgUrl: require('../../../static/personal.png')
        }
      ],
      showRecord:false,
      currentUserName:'',
      showEditUserName:false,
      messageUrl:require('../../../static/message.png'),
      userLogo:require('../../../static/default.png'),
      messageNum: 0,
      menuList:[
        {
          icon:require('../../../static/menu1.png'),
          name:'我的债务',
          eventBtn:'myDebt'
        },
        {
          icon:require('../../../static/menu2.png'),
          name:'我要备案',
          eventBtn:'myRecord'
        },
        {
          icon:require('../../../static/menu3.png'),
          name:'我的钱包',
          eventBtn:'myWallet'
        },
        {
          icon:require('../../../static/menu4.png'),
          name:'邀请好友',
          eventBtn:'inviteFriends'
        }
      ],
      itemList:[
        {
          icon:require('../../../static/about.png'),
          name:'关于我们',
          eventBtn:'about',
        },
        {
          icon:require('../../../static/resetPass.png'),
          name:'重置密码',
          eventBtn:'resetPassword'
        },
        {
          icon:require('../../../static/exit.png'),
          name:'退出登录',
          eventBtn:'exit'
        }
      ],
      currentUser:{},
      clearTime: undefined
    }
  },

  created () {
    this.getuserInfoBtn()
  },

  mounted () {},

  methods: {
    editCurrentUserNameBtn(){
      console.log('更新用户昵称')
      let that = this
      if(isEmpty(that.currentUserName)){
        that.$toast('昵称不能为空')
        return
      }
      let obj = {
        realName: that.currentUserName
      }
      updateRealName(obj).then(res => {
        if(res && res.code == 200){
          that.currentUser.realName = res.data.realName
        }
      }).catch((error) => {
        that.$dialog.alert({
          title: '温馨提示',
          message: error
        })
      })
    },
    itemClickBtn(index){
      let that = this
      switch (index) {
        case 'myDebt':
          // 我的债务
          console.log('点击我的债务')
          localStorage.removeItem('tabIndex')
          localStorage.removeItem('navIndex')
          that.$router.push('/myDebt')
          break;
        case 'myRecord':
          // 我要备案
          console.log('点击我要备案')
          console.log(that.currentUser.debtFilingUser.type)
          if(that.currentUser.debtFilingUser.type == 0){
            that.showRecord = true
          }
          else{
            that.$router.push('/myRecordForm')
          }
          break;
        case 'myWallet':
          // 我的钱包
          console.log('点击我的钱包')
          that.$router.push('/myWallet')
          break;
        case 'inviteFriends':
          // 邀请好友
          that.$router.push('/inviteFriends')
          break;
        case 'about':
          // 关于我们
          that.$router.push('/about')
          break;
        case 'resetPassword':
          // 重置密码
          that.$router.push({
            path:'/updatePassword',
            query:{
              phoneNumber: that.currentUser.phoneNumber
            }
          })
          break;
        case 'exit':
          // 退出
          that.$dialog.confirm({
            cancelButtonColor:'#5089FF',
            confirmButtonColor:'#666666',
            confirmButtonText:'取消',
            cancelButtonText:'确定',
            message: '退出登录后的操作将不再同步，确认要登出吗？',
          }).then(() => {
            // console.log('点击了取消')
          }).catch(() => {
            // console.log('点击了确认')
            loggedOut().then(res => {
              localStorage.clear()
              this.$router.push("/login")
            })
          })
          break;
      }
    },
    getuserInfoBtn(){
      let that = this
      getSelfInfo().then(res => {
        if(res && res.code == 200){
          that.currentUser = res.data
          localStorage.setItem('currentUser',JSON.stringify(that.currentUser))
          if (!isEmpty(res.data.debtFilingUser.avatarUrl)) {
            // 更新头像
            that.userLogo = res.data.debtFilingUser.avatarUrl
          }
          if(isEmpty(res.data.realName)){
            // 更新昵称
            that.currentUser.realName = '请设置昵称'
          }
          // 简称当前未读消息总数
          getReadNotifyCount().then((res)=> {
            if(res && res.code == 200){
              that.messageNum = res.data
              // 定时伦询检查未知消息
              that.getReadNotifyCountBtn()
            }
          }).catch(error => {
            that.$dialog.alert({
              title: '温馨提示',
              message: error
            })
          })
        }
      }).catch((error)=>{
        that.$dialog.alert({
          title: '温馨提示',
          message: error
        })
      })
    },
    getReadNotifyCountBtn(){
      let that = this
      that.clearTime = setInterval(() => {
        getReadNotifyCount().then(res => {
          if(res && res.code == 200){
            that.messageNum = res.data
          }
        }).catch(error => {
          that.$dialog.alert({
            title: '温馨提示',
            message: error
          })
        })
      }, 6000)
    },
    messageBtn(){
      console.log('点击消息')
      this.$router.push('/message')
    },
    editUserNameBtn(){
      console.log('点击编辑用户昵称')
      this.showEditUserName = true
      this.currentUserName = this.currentUser.realName
      this.$nextTick(()=>{
        this.$refs.editUserName.focus()
      })
    },
    chooseImg() {
      this.$refs.uploadImg.chooseFile()
    },
    uploadHeaderPhoto(file) {
      //修改头像
      let that = this
      let params = new FormData()
      params.append('file', file.file)
      // 上传文件
      uploadKeepSource(params).then(res => {
        if ( res && res.code == 200) {
          that.userLogo = res.data
          let obj = {
            avatarUrl: res.data
          }
          // 更新头像
          updateAvatar(obj).then(res => {
            if (res && res.code == 200) {
              console.log(res)
            }
          }).catch(error => {
            that.$dialog.alert({
              title: '温馨提示',
              message: error
            })
          })
        }
      }).catch(error => {
        that.$dialog.alert({
          title: '温馨提示',
          message: error
        })
      })
    },
    gotoRecordBtn(index){
      let currentIndex = index+1
      this.showRecord = false
      this.$router.push({
        path:'/myRecord',
        query:{
          type:currentIndex
        }
      })
    }
  },
  destroyed() {
    clearInterval(this.clearTime)
  },
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
}
.editUserName .van-field__control{
  text-align: center;
  margin-left: 0;
  font-weight: bold;
}
.record-content{
  border-radius: 6px;
}
.message .van-info{
  border:none;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
} 
.content-bottom-bottom .van-cell__right-icon{
  color: #B8C2CC;
}
</style>
<style lang="scss" scoped>
.index-container {
  width: 100%;
  height: auto;
  overflow: hidden;
  margin: 0 auto;
  background: #F5F5F5;
  min-height: 100vh;
  .title{
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    line-height: 31px;
    color: #000000;
  }
  .content {
    width: 100%;
    // overflow: hidden;
    font-size: 14px;
    font-weight: 400;
    position: relative;
    .content-top{
      width: 100%;
      height: 204px;
      background: url('../../../static/home_bg.png') no-repeat;
      background-size: cover;
      position: relative;
      z-index: 100;
      .message{
        margin-top: 22px;
        margin-right: 22px;
        float: right;
        img{
          width: 28px;
          height: 28px;
        }
      }
      .userInfo{
        width: 100%;
        height: auto;
        display: flex;
        align-items: center;
        .userInfo-left{
          margin-left: 15px;
          width: 60px;
          height: 60px;
          overflow: hidden;
          border-radius: 50%;
          position: relative;
          img{
            width: 100%;
          }
          .camery {
            position: absolute;
            right: -0.5rem;
            width: 1.5rem;
            height: 1.5rem;
            bottom: 0rem;
            box-sizing: border-box;
            visibility: hidden;
          }
        }
        .userInfo-right{
          p{
            margin: 0;
            padding: 0;
          }
          .editUserName{
            font-weight: bold;
            margin-bottom: 10px;
          }
          margin-block-start: 0;
          margin-block-end: 0;
          font-size: 16px;
          font-weight: 500;
          color: #FFFFFF;
          margin-left: 16px;
        }
      }
    }
    .content-bottom{
      width: 100%;
      position: relative;
      background: #fc1;
      z-index: 999;
      .content-info{
        width: 100%;
        position: absolute;
        top: -60px;
        .content-bottom-top{
          margin: 0 10px;
          background: #ffffff;
          border-radius: 6px;
          height: 116px;
          box-shadow: 0px 3px 6px rgba(137, 137, 137, 0.06);
          .menu{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            p{
              margin: 0;
              padding: 0;
              font-size: 14px;
              color: #333333;
              font-weight: 400;
              letter-spacing: 2px;
              margin-top: 10px;
            }
          }
        }
        .content-bottom-bottom{
          margin: 0 10px;
          background: #ffffff;
          border-radius: 6px;
          overflow: hidden;
          margin-top: 10px;
          box-shadow: 0px 3px 6px rgba(137, 137, 137, 0.06);
          .van-icon img{
            width: 24px;
            height: 24px;
            margin-right: 15px;
          }
          .van-cell{
            padding-top: 18px;
            padding-bottom: 18px;
          }
          .van-cell::after{
            left: 60px;
          }
        }
      }
    }
  }
  .record-wrapper{
    min-width: 270px;
    // height: 326px;
    background: #FFFFFF;
    padding-bottom: 30px;
    overflow: hidden;
    .record-title{
      font-size: 20px;
      font-weight: bold;
      line-height: 34px;
      color: #333333;
      text-align: center;
      margin-top: 30px;
      margin-bottom: 34px;
      letter-spacing: 2px;
    }
    ul{
      margin: 0px 15px;
      overflow: hidden;
      li{
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #F6F9FF;
        box-shadow: 0px 3px 6px rgba(80, 137, 255, 0.16);
        border-radius: 6px;
        margin-bottom: 15px;
        padding: 10px 20px;
        p{
          font-size: 16px;
          font-weight: 600;
          line-height: 27px;
          color: #000000;
        }
        img{
          width: 60px;
          height: 60px;
        }
      }
    }
  }
}
</style>
