<!-- login -->
<template>
  <div class="index-container about-wrapper">
    <van-nav-bar left-arrow @click-left="onClickLeft" title="财务咨询登记表" fixed placeholder class="title"/>
    <div class="content">
      <div class="content-top"></div>
      <div class="content-bottom">
        <van-field v-model="currentUserName" label="登记人" placeholder="请输入登记人姓名" class="currentUserName" clearable :readonly="readonlyBoolean" @blur="updateUserNameBtn"/>
        <div class="btns">
          <div class="btn-left" @click="choiceBtn(1)">
            <span>债权信息登记</span>
            <van-icon name="arrow" />
          </div>
          <div class="btn-right" @click="choiceBtn(2)">
            <span>债务信息登记</span>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {updateRealName} from "@/api/user"
import {getDebtDetails,getAreasList,updateDebtForm} from "@/api/myDebt"
import { isEmpty,getQueryString} from '@/utils/validate'
export default {
  data () {
    return {
      currentUserName:'',
      readonlyBoolean:true
    }
  },

  created () {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if(!isEmpty(currentUser)){
      if(currentUser.realName){
        this.currentUserName = currentUser.realName
      }else{
        this.readonlyBoolean = false
      }
    }
  },

  mounted () {},

  methods: {
    onClickLeft(){
      this.$router.go(-1)
    },
    choiceBtn(index){
      let that = this
      if(isEmpty(that.currentUserName)){
        // 登记人姓名为空提示
        that.$dialog.alert({
          title: '温馨提示',
          message: '登记人姓名为空，请设置后重试'
        })
      } else {
        // 1是债权 2是债务
        this.$router.push({
          path: "/myRecordDetails",
          query: {
            type: index
          }
        })
      }
    },
    updateUserNameBtn(){
      let that = this
      let obj = {
        realName: that.currentUserName
      }
      updateRealName(obj).then(res => {
        if(res && res.code == 200){
          that.currentUserName = res.data.realName
          that.readonlyBoolean = true
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

.title .van-nav-bar--fixed{
  z-index: 9999;
}
.currentUserName{
  border-bottom: 1px solid #E4E4E4;
  padding-left: 0px;
  padding-right: 0px;
}
.currentUserName .van-field__label span{
  font-size: 16px;
  font-weight: 500;
  line-height: 27px;
  color: #000000;
}
.currentUserName .van-cell__value{
    font-size: 16px;
  font-weight: 500;
  line-height: 27px;
  color: #000000;
}
.currentUserName::after{
  border-bottom: none;
}
</style>
<style lang="scss" scoped>
.index-container {
  width: 100%;
  height: auto;
  overflow: hidden;
  margin: 0 auto;
  min-height: 100vh;
  background: #ffffff;
  position: relative;
  .title{
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    line-height: 31px;
    color: #000000;
    background: #ffffff;
    z-index: 9999;
    overflow: hidden;
  }
  .content{
    width: 100%;
    height: auto;
    overflow: hidden;
    .content-top{
      width: 100%;
      height: 150px;
      overflow: hidden;
      background: url('../../../static/form_bg.png') no-repeat;
      background-size: cover;
    }
    .content-bottom{
      padding: 30px;
      overflow: hidden;
      .btns{
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 30px;
        .btn-left{
          width: 50%;
          height: 38px;
          text-align: center;
          background: rgba($color: #5089FF, $alpha: 0.1);
          border-radius: 19px;
          margin-right: 6px;
          font-size: 16px;
          line-height: 38px;
          font-weight: 500;
          color: #5089FF;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .btn-right{
          width: 50%;
          height: 38px;
          line-height: 38px;
          text-align: center;
          background: rgba($color: #5089FF, $alpha: 0.1);
          border-radius: 19px;
          margin-left: 6px;
          font-size: 16px;
          font-weight: 500;
          color: #5089FF;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
