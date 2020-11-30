<!-- login -->
<template>
  <div class="index-container about-wrapper">
    <van-nav-bar left-arrow @click-left="onClickLeft" fixed placeholder class="title">
      <template #title>
        {{currentType | currentTitleName}}
      </template>
    </van-nav-bar>
    <div class="content">
      <div class="content-header"></div>
      <div class="article" v-if="currentWrapper">
        <!-- 运营中心 -->
        <ul class="item" v-if="currentInfo.operationCenter && currentType==1">
          <li>
            <label class="label-title">运营中心名称</label>
            <p class="label-name">{{currentInfo.operationCenter.name}}</p>
          </li>
          <li>
            <label class="label-title">手机号码</label>
            <p class="label-name">{{currentInfo.operationCenter.phoneNumber}}</p>
          </li>
          <li>
            <label class="label-title">联系地址</label>
            <p class="label-name">{{currentInfo.operationCenter.address}}</p>
          </li>
          <li>
            <label class="label-title">
              <van-icon name="friends" />
              总推荐人数</label>
            <p class="label-name">{{currentInfo.operationCenter.totalReferrerQuantity}}</p>
          </li>
        </ul>
        <!-- 资产管理师 -->
        <ul class="item" v-if="currentInfo.debtHousekeeper && currentType==2">
          <li>
            <label class="label-title">资产管理师姓名</label>
            <p class="label-name">{{currentInfo.debtHousekeeper.realName}}</p>
          </li>
          <li>
            <label class="label-title">手机号码</label>
            <p class="label-name">{{currentInfo.debtHousekeeper.phoneNumber}}</p>
          </li>
          <li>
            <label class="label-title">专业</label>
            <p class="label-name">{{currentInfo.debtHousekeeper.professional}}</p>
          </li>
          <li>
            <label class="label-title">等级</label>
            <p class="label-name">{{currentInfo.debtHousekeeper.level}}</p>
          </li>
          <li>
            <label class="label-title">解债总数</label>
            <p class="label-name">{{currentInfo.debtHousekeeper.debtClearSuccessQuantity}}</p>
          </li>
          <li>
            <label class="label-title">星级</label>
            <p class="label-name start-name">
              <van-icon :name="startUrl" v-for="(ite,index) in currentInfo.debtHousekeeper.starLevel" :key="index"/>
            </p>
          </li>
          <li>
            <label class="label-title">描述</label>
            <p class="label-name">{{currentInfo.debtHousekeeper.introduction}}</p>
          </li>
        </ul>
        <!-- 审核方案 -->
        <ul class="item" v-if="currentInfo.debtClearProgram && currentType==3">
          <li>
            <label class="label-title">资产管理师姓名</label>
            <p class="label-name">{{currentInfo.debtClearProgram.debtHousekeeperName}}</p>
          </li>
          <li>
            <label class="label-title">方案名称</label>
            <p class="label-name">{{currentInfo.debtClearProgram.name}}</p>
          </li>
          <li>
            <label class="label-title">状态</label>
            <p class="label-name">{{currentInfo.debtClearProgram.status | debtClearProgramStatusfilters}}</p>
          </li>
          <li>
            <label class="label-title">内容</label>
            <p class="label-name">{{currentInfo.debtClearProgram.detail}}</p>
          </li>
          <li class="item-debtClearProgram">
            <p class="item-title">方案材料</p>
            <div class="img-container">
              <template v-for="(item,index) in currentFiles" >
                <van-image width="100" height="100" class="img-item" fit="cover" :key="index" :src="item" @click="getImg(currentFiles,index)">
									<template v-slot:loading>
										<van-loading type="spinner" size="20" />
									</template>
									<template v-slot:error>加载失败</template>
								</van-image>
              </template>
            </div>
          </li>
          <li class="item-debtClearProgram-btns" v-if="currentInfo.debtClearProgram.status == 0">
            <van-button plain type="info" class="rejectBtn" @click="rejectBtn">不同意</van-button>
            <van-button type="info" class="agreeBtn" @click="agreeBtn">同意</van-button>
          </li>
        </ul>
        <!-- 审核合约 -->
        <ul class="item" v-if="currentInfo.debtClearContract && currentType==4">
          <li>
            <label class="label-title">资产管理师姓名</label>
            <p class="label-name">{{currentInfo.debtClearContract.debtHousekeeperName}}</p>
          </li>
          <li>
            <label class="label-title">合约名称</label>
            <p class="label-name">{{currentInfo.debtClearContract.name}}</p>
          </li>
          <li>
            <label class="label-title">状态</label>
            <p class="label-name">{{currentInfo.debtClearContract.status | debtClearContractStatusfilters}}</p>
          </li>
          <li>
            <label class="label-title">内容</label>
            <p class="label-name">{{currentInfo.debtClearContract.detail}}</p>
          </li>
          <li class="item-debtClearProgram">
            <p class="item-title">合约材料</p>
            <div class="img-container">
              <template v-for="(item,index) in currentFiles" >
                <van-image width="100" height="100" class="img-item" fit="cover" :key="index" :src="item" @click="getImg(currentFiles,index)">
									<template v-slot:loading>
										<van-loading type="spinner" size="20" />
									</template>
									<template v-slot:error>加载失败</template>
								</van-image>
              </template>
            </div>
          </li>
          <li class="item-debtClearProgram-btns" v-if="currentInfo.debtClearContract.status == 0">
            <van-button plain type="info" class="rejectBtn" @click="rejectBtn">不同意</van-button>
            <van-button type="info" class="agreeBtn" @click="agreeBtn">同意</van-button>
          </li>
        </ul>
      </div>
      <!-- 上传佣金支付凭证 -->
      <div class="upload-container" v-if="!currentWrapper">
        <div class="upload-container-top">
          <van-uploader v-model="fileList" :after-read="uploadPhotoBtn" preview-size="100px" ref="uploadImg" multiple :accept="'image/*'" upload-icon="plus"/>
        </div>
        <div class="upload-container-bottom">
          <van-button type="info" class="uploadBtn" :disabled="fileList.length == 0" @click="uploadBtn">提交</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { ImagePreview  } from 'vant'
Vue.use(ImagePreview)
import {getDebtDetails,auditDebtClearProgram,auditDebtClearContract,debtClearRebateCertificate,updateDebtClearRebateCertificate} from "@/api/myDebt"
import { uploadKeepSource } from "@/api/user"
import { isEmpty,getQueryString } from '@/utils/validate'
export default {
  filters:{
    currentTitleName(status) {
      const statusMap = {
        1: '运营中心信息',
        2: '资产管理师信息',
        3: '方案详情',
        4: '合约详情',
        11: '上传支付佣金凭证',
        13: '修改支付佣金凭证'
      }
      return statusMap[status]
    },
    debtClearProgramStatusfilters(status) {
      const statusMap = {
        0: '待确认解债方案',
        1: '已同意解债方案'
      }
      return statusMap[status]
    },
    debtClearContractStatusfilters(status) {
      const statusMap = {
        0: '待确认合约',
        1: '已同意合约',
      }
      return statusMap[status]
    }
  },

  data () {
    return {
      currentType:1,
      currentFiles:[],
      currentInfo:{},
      fileList:[],
      currentWrapper:true,
      startUrl:require('../../../static/start.png')
    }
  },

  created () {
    let id = getQueryString('id') || this.$route.query.id
    let type = getQueryString('type') || this.$route.query.type
    if(!isEmpty(id) && !isEmpty(type)){
      this.currentType = type
      if(type == 11){
        this.currentWrapper = false
      }
      else if(type == 13){
        this.currentWrapper = false
      } else {
        this.currentWrapper = true
      }
      this.getDebtDetailsBtn(id)
    }
  },

  mounted () {},

  methods: {
    onClickLeft(){
      this.$router.go(-1)
    },
    getDebtDetailsBtn(id){
      let that = this
      getDebtDetails(id).then((res)=>{
        if(res && res.code == 200){
          that.currentInfo = res.data
          if(that.currentType == 3 && that.currentInfo.debtClearProgram){
            that.currentFiles = that.currentInfo.debtClearProgram.photoAlbumUrlAddresses.split(',')
          }
          if(that.currentType == 4 && that.currentInfo.debtClearContract){
            that.currentFiles = that.currentInfo.debtClearContract.photoAlbumUrlAddresses.split(',')
          }
          if(that.currentType == 13){
            // 修改支付凭证
            let alerdList = that.currentInfo.debtClearRebateCertificate.imageUrlAddresses.split(',')
            alerdList.forEach(item=>{
              that.fileList.push({
                url:item
              })
            })
          }
        }
      }).catch((error)=>{
        that.$dialog.alert({
          title:'温馨提示',
          message: error
        }).then(() => {})
      })
    },
    getImg(images,index){
      ImagePreview({
        images:images,
        showIndex:true,
        loop:false,
        startPosition:index
      })
    },
    rejectBtn(){
      if(this.currentType == 3){
        // 不同意方案
        this.auditDebtClearProgramBtn(false)
      }
      if(this.currentType == 4){
        // 不同意合约
        this.auditDebtClearContractBtn(false)
      }
    },
    agreeBtn(){
      if(this.currentType == 3){
        // 同意方案
        this.auditDebtClearProgramBtn(true)
      }
      if(this.currentType == 4){
        // 同意合约
        this.auditDebtClearContractBtn(true)
      }
    },
    auditDebtClearProgramBtn(val){
      //审核方案
      let that = this
      let obj = {
        debtClearProgramId: that.currentInfo.debtClearProgram.id,
        confirm: val
      }
      auditDebtClearProgram(obj).then(res=>{
        if(res && res.code == 200){
          that.$dialog.alert({
            title:'温馨提示',
            message: '处理成功'
          }).then(() => {
            that.onClickLeft()
          })
        }
      }).catch(error=>{
        that.$dialog.alert({
          title:'温馨提示',
          message: error
        }).then(() => {})
      })
    },
    auditDebtClearContractBtn(val){
      // 审核合约
      let that = this
      let obj = {
        debtClearContractId: that.currentInfo.debtClearContract.id,
        confirm: val
      }
      auditDebtClearContract(obj).then(res=>{
        if(res && res.code == 200){
          that.$dialog.alert({
            title:'温馨提示',
            message: '处理成功'
          }).then(() => {
            that.onClickLeft()
          })
        }
      }).catch(error=>{
        that.$dialog.alert({
          title:'温馨提示',
          message: error
        }).then(() => {})
      })
    },
    uploadPhotoBtn(file) {
      console.log(file)
      console.log(this.fileList)
    },
    uploadBtn(){
      console.log('点击提交')
      let that = this
      let formData = undefined
      let uploadedList = []
      for(let i=0;i<that.fileList.length;i++){
        if(that.fileList[i].file != undefined){
          if(formData == undefined){
            formData = new FormData()
          }
          formData.append('file', that.fileList[i].file)
        }
      }
      if(formData == undefined){
        console.log('无需新增')
        let newImgList = []
        that.fileList.forEach(item => {
          if(item.file == undefined){
            newImgList.push(item.url)
          }
        })
        let endImgList = newImgList.join(',')
        let obj = {
          debtAdvisoryFormId: that.currentInfo.id,
          imageUrlAddresses: endImgList
        }
        if(that.currentType == 11) {
          // 新上传支付凭证
          that.debtClearRebateCertificateBtn(obj)
        }
        if(that.currentType == 13){
          // 修改支付凭证
          that.updateDebtClearRebateCertificateBtn(endImgList)
        }
      } else{
        console.log('新增')
        // 上传文件
        uploadKeepSource(formData).then(res => {
          if ( res && res.code == 200) {
            uploadedList = res.data.split(',')
            // 和原数据匹配，比较
            console.log(that.fileList)
            let newImgList = []
            that.fileList.forEach(item => {
              if(item.file == undefined){
                newImgList.push(item.url)
              }
            })
            let endImgList = newImgList.concat(uploadedList).join(',')
            console.log(endImgList)
      
            let obj = {
              debtAdvisoryFormId: that.currentInfo.id,
              imageUrlAddresses: endImgList
            }
            if(that.currentType == 11) {
              // 新上传支付凭证
              that.debtClearRebateCertificateBtn(obj)
            }
            if(that.currentType == 13){
              // 修改支付凭证
              that.updateDebtClearRebateCertificateBtn(endImgList)
            }
          }
        }).catch(error => {
          that.$dialog.alert({
            title: '温馨提示',
            message: error
          })
        })
      }
    },
    debtClearRebateCertificateBtn(obj){
      let that = this
      // 上传支付凭证
      console.log('上传支付凭证')
      debtClearRebateCertificate(obj).then(res=>{
        if(res && res.code == 200){
          that.$dialog.alert({
            title:'温馨提示',
            message: '提交成功'
          }).then(() => {
            that.onClickLeft()
          })
        }
      }).catch(error=>{
        that.$dialog.alert({
          title:'温馨提示',
          message: error
        }).then(() => {})
      })
    },
    updateDebtClearRebateCertificateBtn(imgList){
      let that = this
      console.log('修改支付凭证')
      let obj = {
        "imageUrlAddresses":imgList
      }
      updateDebtClearRebateCertificate(that.currentInfo.debtClearRebateCertificate.id,obj).then(res=>{
        if(res && res.code == 200){
          that.$dialog.alert({
            title:'温馨提示',
            message: '修改成功'
          }).then(() => {
            that.onClickLeft()
          })
        }
      }).catch(error=>{
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
.upload-container-top .van-uploader__preview-delete{
  width: 18px;
  height: 18px;
  background: rgba(00, 00, 00, 0.4);
  border-radius: 0px 0px 0px 6px;
}
.upload-container-top .van-uploader__preview-delete-icon{
  font-size: 22px;
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
    .content-header{
      width: 100%;
      height: 150px;
      overflow: hidden;
      background: url('../../../static/tips_bg.png') no-repeat;
      background-size: cover;
    }
    .article{
      margin: 15px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      background: #ffffff;
      .item{
        width: 100%;
        overflow: hidden;
        // margin-left: 14px;
        // margin-right: 14px;
        padding: 18px 14px;
        p{
          margin: 0;
          padding: 0;
        }
        li:last-child{margin-bottom: 0px;}
        li{
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          text-align: left;
          margin-bottom: 10px;
          justify-content: flex-start;
          align-items: flex-start;
          .label-title{
            min-width: 60px;
            margin-right: 18px;
            overflow: hidden;
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
            display: flex;
            color: #666666;
            .van-icon-friends{
              font-size: 16px;
              margin-right: 4px;
              line-height: 24px;
            }
          }
          .label-name{
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
            color: #000000;
          }
          .start-name{
            font-size: 18px;
            color: #FFA024;
          }
        }
        .item-debtClearProgram{
          width: 100%;
          border-top: 1px solid #E4E4E4;
          padding-top: 10px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          .item-title{
            display: inline-block;
            width: 100%;
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
            color: #666666;
          }
          .img-container{
            width: 100%;
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            .img-item{
              margin-right: 4px;
              margin-bottom: 4px;
              overflow: hidden;
            }
          }
        }
        .item-debtClearProgram-btns{
          width: 100%;
          display: flex;
          justify-content: space-between;
          .van-button{
            width: 50%;
          }
          .rejectBtn{
            margin-right:5px;
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

    .upload-container{
      width: 100%;
      background: #ffffff;
      overflow: hidden;
      margin-top: 10px;
      .upload-container-top{
        padding: 15px 25px;
      }
      .upload-container-bottom{
        width: 100%;
        overflow: hidden;
        margin: 40px auto;
        text-align: center;
        display: flex;
        .uploadBtn{
          margin: 0 15px;
          flex: 1;
          background: #5089FF;
          border-color: #5089FF;
          font-size: 18px;
          font-weight: 400;
          color: #FFFFFF;
          letter-spacing: 2px;
        }
      }
    }
  }
}
</style>
