<!-- login -->
<template>
  <div class="index-container about-wrapper">
    <van-nav-bar left-arrow @click-left="onClickLeft" :title="currentTitle" fixed placeholder class="title"/>
    <div class="content">
      <div class="content-top">
        <ul>
          <li class="registrant">
            <label class="label-title">登记人</label>
            <p class="label-name">{{registrant}}</p>
          </li>
          <li>
            <label class="label-title">所属运营中心</label>
            <p class="label-name">{{operationCenterName}}</p>
          </li>
        </ul>
      </div>
      <div class="content-bottom">
        <van-form @submit="onSubmit" class="content-bottom-form">
          <div class="item-form">
            <van-cell :title="typeVal+'人姓名/单位'" />
            <van-field
              name="partiesName"
              v-model="debtForm.partiesName"
              :placeholder="'请输入'+typeVal+'人姓名/单位'"
              :rules="[{ required: true, message: `请输入${typeVal}人姓名/单位` }]"
              clearable
            />
          </div>
          <div class="item-form">
            <van-cell :title="typeVal+'电话'"/>
            <van-field
              name='partiesPhone'
              v-model="debtForm.partiesPhone"
              placeholder="请输入联系方式"
              :rules="[{ validator, message: '请输入正确的手机号格式' }]"
              clearable
            />
          </div>
          <div class="item-form">
            <van-cell :title="typeVal+'人地址'" is-link value="请选择省市区" @click="showAreaBtn"/>
            <van-field
              readonly
              name="partiesAddress1"
              v-model="debtForm.partiesAddress1"
              placeholder="例如：广东省广州市天河区"
              :rules="[{ required: true, message: '请选择省市区' }]"
              clearable
              class="address-tips"
            />
            <van-field
              class="address-tips1"
              name="partiesAddress"
              v-model="debtForm.partiesAddress"
              placeholder="请补充详细地址、门牌号"
              clearable
            />
          </div>
          <div class="item-form">
            <van-cell :title="typeVal+'金额'"/>
            <van-field
              name="amount"
              readonly
              v-model="debtForm.amount"
              :placeholder="'请输入'+typeVal+'金额'"
              :rules="[{ required: true, message: `请输入${typeVal}金额` }]"
              clearable
              @click-input="showAmountBtn"
            />
          </div>
          <div class="item-form">
            <van-cell title="从事行业" is-link value="请选择行业" @click="openIndustryBtn(1,debtForm.partiesOccupation)"/>
            <van-field
              name="partiesOccupation"
              v-model="debtForm.partiesOccupation"
              placeholder="请输入从事行业"
              :rules="[{ required: true, message: '请输入从事行业' }]"
              clearable
            />
          </div>
          <div class="item-form">
            <van-cell title="社会资源"/>
            <van-field
              name="partiesCommunityResources"
              v-model="debtForm.partiesCommunityResources"
              placeholder="请输入您的社会资源"
              :rules="[{ required: true, message: '请输入您的社会资源' }]"
              clearable
            />
          </div>
          <div class="item-form">
            <van-cell title="对方姓名"/>
            <van-field
              name="otherSideName"
              v-model="debtForm.otherSideName"
              placeholder="请输入对方姓名"
              :rules="[{ required: true, message: '请输入对方姓名' }]"
              clearable
            />
          </div>
          <div class="item-form">
            <van-cell title="对方联系方式"/>
            <van-field
              name="otherSideContact"
              v-model="debtForm.otherSideContact"
              placeholder="请输入对方联系方式"
              :rules="[{ validator, message: '请输入正确的手机号格式' }]"
              clearable
            />
          </div>
          <div class="item-form">
            <van-cell title="对方行业" is-link value="请选择行业" @click="openIndustryBtn(2,debtForm.otherSideOccupation)"/>
            <van-field
              name="otherSideOccupation"
              v-model="debtForm.otherSideOccupation"
              placeholder="请输入对方从事行业"
              :rules="[{ required: true, message: '请输入对方从事行业' }]"
              clearable
            />
          </div>
          <div class="item-form">
            <van-cell title="起始时间" is-link value="请选择日期" @click="showDateBtn"/>
            <van-field
              name="occurrenceTime"
              v-model="debtForm.occurrenceTime"
              placeholder="请选择日期"
              :rules="[{ required: true, message: '请输入日期' }]"
              clearable
            />
          </div>
          <div class="item-form">
            <van-cell title="化债意愿"/>
            <van-field
              name="resolveWish"
              v-model="debtForm.resolveWish"
              placeholder="请输入您的化债意愿"
              :rules="[{ required: true, message: '请输入您的化债意愿' }]"
              clearable
            />
          </div>
          <div class="item-form">
            <van-cell :title="typeVal+'介绍'"/>
            <van-field
              name="detail"
              v-model="debtForm.detail"
              :placeholder="'请输入'+typeVal+'介绍'"
              :rules="[{ required: true, message: `请输入${typeVal}介绍` }]"
              clearable
            />
          </div>
          <div class="item-form">
            <div class="item-form1">
              <van-field label="有无欠条" name="haveIou">
                <template #input>
                  <van-radio-group v-model="debtForm.haveIou" direction="horizontal">
                    <van-radio :name="true">有</van-radio>
                    <van-radio :name="false" style="margin-left:10px;">无</van-radio>
                  </van-radio-group>
                </template>
              </van-field>
            </div>
          </div>
          <div class="item-form">
            <div class="item-form1">
              <van-field label="是否起诉" name="prosecute">
                <template #input>
                  <van-radio-group v-model="debtForm.prosecute" direction="horizontal">
                    <van-radio :name="true">是</van-radio>
                    <van-radio :name="false" style="margin-left:10px;">否</van-radio>
                  </van-radio-group>
                </template>
              </van-field>
            </div>
          </div>
          <div class="editBtn">
            <span class="resetBtn" @click="resetBtn">重置</span>
            <van-button block type="info" native-type="submit" class="subBtn">
              提交
            </van-button>
          </div>
        </van-form>
        <!-- <div class="read-only" v-if="!debtForm.canUpdate"></div> -->
      </div>
    </div>
    <!-- 选择地区 -->
    <van-popup v-model="showArea" position="bottom">
      <van-area :area-list="areaList" :columns-placeholder="['请选择', '请选择', '请选择']" @cancel="showArea=false" @confirm="confirmAreaBtn" />
    </van-popup>
    <!-- 起始时间选择 -->
    <van-popup v-model="showDate"  position="bottom" :style="{ height: '30%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :formatter="formatter"
        @cancel="cancelBtn"
        @confirm="confirmBtn"
      />
    </van-popup>
    <!-- 金额数字键盘 -->
    <van-number-keyboard
      :show="showAmount"
      theme="custom"
      v-model="debtForm.amount"
      extra-key="."
      close-button-text="完成"
      @blur="showAmount = false"
    />
    <!-- 行业 -->
    <van-popup v-model="showIndustryPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="industrycolumns"
        @cancel="showIndustryPicker = false"
        @confirm="onIndustryConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import {getAreasList,creditAndDebtRecordForm} from "@/api/myDebt"
import { isEmpty,getQueryString,isPhone} from '@/utils/validate'
import moment from 'moment'
export default {
  debtName(status) {
    const statusMap = {
      1: '债权',
      2: '债务'
    }
    return statusMap[status]
  },
  data () {
    return {
      currentId:'',
      industryIndex:1,
      showIndustryPicker:false,
      industrycolumns:['保险','金融','房地产','餐饮','服装','化妆品','农业','教育','计算机','服务','建筑'],
      areaList:[],
      showArea:false,
      showAmount:false,
      showDate:false,
      minDate: new Date(2010, 0, 1),
      currentDate: new Date(),
      registrant:'',
      operationCenterName:'',
      currentTitle:'债权信息详情',
      type:1,//当前类型 1=债权 2=债务
      typeVal:'债权',
      debtForm:{
        partiesName:'',//债权或债务人姓名
        partiesPhone: '',//债权或债务人电话
        partiesAddress:'',//债权地址
        partiesAddress1:'',//省市区
        amount:'',//债权金额
        partiesOccupation: '',//债权或债务人从事行业
        partiesCommunityResources: '',//社会资源
        otherSideName: "",//对方姓名
        otherSideContact: "",//对方联系方式
        otherSideOccupation: "",//对方行业
        occurrenceTime: '',//起始时间
        detail: '',//债事详情介绍
        haveIou: false,//是否有欠条 1是有 0是无
        prosecute: false,//是否起诉 1是 0是否
        resolveWish: '',//解决意愿
        type: '1'//类型 1是债券 2是债务
      }
    }
  },

  created () {
    let type = getQueryString('type') || this.$route.query.type
    let currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if(!isEmpty(type)){
      this.type = type
      this.debtForm.type = type
      if(type == 1){
        this.currentTitle = '债权信息详情'
        this.typeVal = '债权'
      } else {
        this.currentTitle = '债务信息详情'
        this.typeVal = '债务'
      }
    }
    if(!isEmpty(currentUser)){
      this.registrant = currentUser.realName
      console.log(currentUser)
      if(currentUser.debtFilingUser){
        this.operationCenterName = currentUser.debtFilingUser.operationCenterName
      }
    }
    // 全国地区
    this.getAreasListBtn()
  },

  mounted () {},

  methods: {
    openIndustryBtn(index,name){
      this.showIndustryPicker = true
      this.industryIndex = index
    },
    onIndustryConfirm(value){
      if(this.industryIndex == 1){
        // 当前行业
        console.log('当前行业')
        this.debtForm.partiesOccupation = value
      }
      if(this.industryIndex == 2){
        // 对方行业
        console.log('对方行业')
        this.debtForm.otherSideOccupation = value
      }
      this.showIndustryPicker = false
    },
    showDateBtn(){
      this.showDate = true
    },
    showAreaBtn(){
      this.showArea = true
    },
    confirmAreaBtn(data){
      let that = this
      let areastr = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].code == '' || data[i].code == undefined) {
          that.$dialog.alert({
            message: '请选择地区',
          }).then(() => {})
          return
        }
        areastr.push(data[i].name)
      }
      let str = areastr.join('')
      that.debtForm.partiesAddress1 = str
      that.showArea = false
    },
    getAreasListBtn(){
      let that = this
      let province_list = {},city_list = {}, county_list = {}
      getAreasList().then((res)=>{
        if(res && res.code == 200){
          let list = res.data
          list.map((item)=>{
            let id = item.administrativeCode.substring(0,6)
            province_list[id] = item.name
            if(item.sonAreasList){
              item.sonAreasList.map((item1)=>{
                  let id1 = item1.administrativeCode.substring(0,6)
                  city_list[id1] = item1.name
                  if(item1.sonAreasList){
                    item1.sonAreasList.map(item2 => {
                      let id2 = item2.administrativeCode.substring(0,6)
                      county_list[id2] = item2.name
                    })
                  }
              })
            }
          })
          that.areaList= {
            province_list,
            city_list,
            county_list
          }
        }
      }).catch((error)=>{
        that.$dialog.alert({
          title: '温馨提示',
          message: error
        })
      })
    },
    showAmountBtn(){
      this.showAmount = true
    },
    formatter(type, val) {
			if (type === 'year') {
				return `${val}年`;
			} else if (type === 'month') {
				return `${val}月`;
			} else if(type === 'day'){
				return `${val}日`
			}
      return val
    },
    cancelBtn(){
      this.showDate = false
    },
    confirmBtn(value){
      this.showDate = false
      console.log(value)
      var d = new Date(value)
      let month = (d.getMonth() + 1)
      let date = d.getDate()
      if(month<10){
        month = '0'+month
      }
      if(date<10){
        date = '0' +date
      }
      var resDate = d.getFullYear() + '-' + month + '-' + date
      this.debtForm.occurrenceTime = resDate
    },
    onClickLeft(){
      this.$router.go(-1)
    },
    validator(val){
      if(isPhone(val))
      {
        return true
      } else {
        return false
      }
    },
    onSubmit(values){
      console.log('点击提交')
      console.log(values)
      let that = this
      console.log(that.debtForm)
      // 处理省市区+详细地址
      that.debtForm.partiesAddress = that.debtForm.partiesAddress1+' '+that.debtForm.partiesAddress
      creditAndDebtRecordForm(that.debtForm).then((res)=>{
        if(res && res.code ==200){
          that.$dialog.alert({
            title:'温馨提示',
            message: '提交成功'
          }).then(() => {
            that.$router.replace('/home')
          })
        }
      }).catch((error)=>{
        that.$dialog.alert({
          title:'温馨提示',
          message: error
        }).then(() => {})
      })
    },
    resetBtn(){
      // 重置
      console.log('点击了重置')
      this.debtForm.partiesName ='',//债权或债务人姓名
      this.debtForm.partiesPhone = '',//债权或债务人电话
      this.debtForm.partiesAddress ='',//债权地址
      this.debtForm.partiesAddress1 ='',//省市区
      this.debtForm.amount = '',//债权金额
      this.debtForm.partiesOccupation = '',//债权或债务人从事行业
      this.debtForm.partiesCommunityResources = '',//社会资源
      this.debtForm.otherSideName = "",//对方姓名
      this.debtForm.otherSideContact = "",//对方联系方式
      this.debtForm.otherSideOccupation = "",//对方行业
      this.debtForm.occurrenceTime = '',//起始时间
      this.debtForm.detail = '',//债事详情介绍
      this.debtForm.haveIou = false,//是否有欠条 1是有 0是无
      this.debtForm.prosecute = false,//是否起诉 1是 0是否
      this.debtForm.resolveWish = '',//解决意愿
      this.debtForm.type = '1'//类型 1是债券 2是债务
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
.item-form .van-cell::after{
  border: none;
}
.item-form .van-field__value{
  padding-bottom: 10px;
  border-bottom: 1px solid #E4E4E4;
}
.item-form  .van-cell__title span{
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  color: #666666;
}
.item-form1{
  margin: 0 16px;
}
.item-form1 .van-cell{
  padding: 10px 0px !important;
  border-bottom: 1px solid #E4E4E4;
}
.item-form1 .van-field__value{
  padding-bottom: 10px;
  border-bottom: none;
}
.item-form .address-tips{
  padding-top: 0px;
  padding-bottom: 0px;
}
.item-form .address-tips .van-field__value{
  border-bottom: none;
  padding-bottom: 0px;
}
.item-form .address-tips1{
  padding-top: 0px;
  padding-bottom: 0px;
}
.item-form1 .van-radio__icon--checked .van-icon-success{
  background-color: #5089FF;
  border-color: #5089FF;
}
/* .item-form .address-tips1 .van-field__value{
  border-bottom: none;
} */
.actions-item{
  font-size: 18px;
  font-weight: 500;
  color: #5089FF;
  /* border-bottom: 1px solid #E4E4E4; */
  overflow: hidden;
}
.van-action-sheet__cancel{
  font-size: 18px;
  font-weight: 500;
  color: #5089FF;
}
.title .van-nav-bar--fixed{
  z-index: 9999;
}
.item-form .van-cell__right-icon{
  color:#B8C2CC;
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
  position: relative;
  .moreBtn{
    position: fixed;
    z-index: 100;
    top: 196px;
    right: 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    color: #FFFFFF;
    text-align: center;
    width: 56px;
    height: 26px;
    background: linear-gradient(90deg, #F69670 0%, #EE6A5C 100%);
    opacity: 1;
    border-radius: 50px 0px 0px 50px;
  }
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
      background: url('../../../static/debt_bg.png') no-repeat;
      background-size: cover;
      display: flex;
      align-items: center;
      ul{
        padding-left: 15px;
        overflow: hidden;
        li{
          width: 100%;
          display: flex;
          font-size: 16px;
          justify-content:flex-start;
          align-items:center;
          font-weight: 500;
          line-height: 24px;
          p{
            margin: 0;
            padding: 0;
          }
          color: #FFFFFF;
          .label-title{
            margin-right: 18px;
          }
        }
        .registrant{
          margin-bottom: 10px;
        }
      }
    }
    .content-bottom{
      width: 100%;
      margin-top: 12px;
      background: #ffffff;
      padding-bottom: 20px;
      position: relative;
      z-index: 99;
      overflow: hidden;
      .content-bottom-form{
        width: 100%;
        height: auto;
        overflow: hidden;
        position: relative;
        z-index: 99;
        .item-form{
          padding-top: 10px;
          .van-cell{
            padding-top: 0px;
            padding-bottom: 0px;
          }
        }
      }
      // .read-only{
      //   position: absolute;
      //   top: 0;
      //   bottom: 0;
      //   width: 100%;
      //   height: 100%;
      //   overflow: hidden;
      //   z-index: 100;
      // }
      .editBtn{
        margin: 16px;
        text-align: center;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        .resetBtn{
          display: inline-block;
          width: 60px;
          height: 16px;
          font-size: 16px;
          font-weight: 400;
          line-height: 27px;
          color: #5089FF;
          letter-spacing: 2px;
        }
        .subBtn{
          text-align: center;
          flex: 1;
          height: 44px;
          background: #5089FF;
          opacity: 1;
          border-radius: 4px;
          font-size: 18px;
          font-weight: 400;
          line-height: 44px;
          color: #FFFFFF;
          letter-spacing: 2px;
          text-align: center;
        }
      }
    }
  }
}
</style>
