import md5 from 'js-md5';
import AES from '@/utils/aes'
import RSA from '@/utils/rsa'
import qs from 'qs'

import request from '@/utils/request'

// 获取我的债务/债权列表
export function getDebtList(obj) {
    return request(
        {
            url:'/debtFilingSystem/debtAdvisory/list?'+qs.stringify(obj),
            headers: {"content-type": "application/json;charset=UTF-8"},
            method:'GET',
            data:'',
            hideloading: false
        }
    )
}

//获取我的债务或债权详情
export function getDebtDetails(id) {
    return request(
        {
            url:'/debtFilingSystem/debtAdvisory/'+id,
            headers: {"content-type": "application/json;charset=UTF-8"},
            method:'GET',
            data:'',
            hideloading: false
        }
    )
}


// 获取全国地址列表
export function getAreasList(id) {
    return request(
        {
            url:'/areas/tree',
            headers: {"content-type": "application/json;charset=UTF-8"},
            method:'GET',
            data:'',
            hideloading: false
        }
    )
}

/**
 *  新增债事咨询备案表
 * @param {*} obj 
 * {
  "partiesName": "债权或债务人姓名",
  "partiesPhone": "债权或债务人电话",
  "partiesOccupation": "债权或债务人行业",
  "amount": 100000,
  "otherSideName": "对方姓名",
  "otherSideContact": "对方联系方式",
  "otherSideOccupation": "对方行业",
  "detail": "债事详情",
  "haveIou": 1,
  "prosecute":0,
  "occurrenceTime":"2010-05-06",
  "resolveWish": "解决意愿",
  "type": 1
}
 */
export function creditAndDebtRecordForm(obj) {
  return request(
    {
      url:'/debtFilingSystem/debtAdvisory',
      headers: {"content-type": "application/json;charset=UTF-8"},
      method:'POST',
      data:obj,
      hideloading: false
    }
  )
}

// 更新修改债事咨询备案表
export function updateDebtForm(id,obj) {
    return request(
      {
        url:'/debtFilingSystem/debtAdvisory/'+id,
        headers: {"content-type": "application/json;charset=UTF-8"},
        method:'PUT',
        data:obj,
        hideloading: false
      }
    )
}

/**
 * 审核处理方案 
 * @param {*} obj 
 * {
  "debtClearProgramId":1265131116885442560, id
  "confirm":true 同意=>true 拒绝=>false
  }
 */
export function auditDebtClearProgram(obj) {
    return request(
      {
        url:'/debtFilingSystem/user/handelDebtClearProgram',
        headers: {"content-type": "application/json;charset=UTF-8"},
        method:'PUT',
        data:obj,
        hideloading: false
      }
    )
}

/**
 *审核处理合约
 * @param {*} obj 
 * {
  "debtClearContractId":1265236942845378560,
  "confirm":true
}
 */
export function auditDebtClearContract(obj) {
    return request(
      {
        url:'/debtFilingSystem/user/handelDebtClearContract',
        headers: {"content-type": "application/json;charset=UTF-8"},
        method:'PUT',
        data:obj,
        hideloading: false
      }
    )
}

// 新增支付解债佣金凭证
export function debtClearRebateCertificate(obj) {
  return request(
    {
      url:'/debtClearRebateCertificate',
      headers: {"content-type": "application/json;charset=UTF-8"},
      method:'POST',
      data:obj,
      hideloading: false
    }
  )
}


/**
 * 修改支付解债佣金凭证
 * http://www.xyxztec.com/api/debtClearRebateCertificate/1266272417165082624
 * {
  "imageUrlAddresses":"http://192.168.0.215/images/1262223263329681409.jpg,http://192.168.0.215/images/1265954414808530944.jpg"
}
 */
export function updateDebtClearRebateCertificate(id,obj) {
  return request(
    {
      url:'/debtClearRebateCertificate/'+id,
      headers: {"content-type": "application/json;charset=UTF-8"},
      method:'PUT',
      data:obj,
      hideloading: false
    }
  )
}

// 获取备案系统设置
export function getDebtSetting() {
  return request(
      {
          url:'/debtFilingSystem/setting',
          headers: {"content-type": "application/json;charset=UTF-8"},
          method:'GET',
          data:'',
          hideloading: false
      }
  )
}

// 支付
export function createOrderForm(obj) {
  return request(
    {
      url:'/order_form',
      headers: {"content-type": "application/json;charset=UTF-8"},
      method:'POST',
      data:obj,
      hideloading: false
    }
  )
}

/**
 * 获取订单支付状态
 * id 订单id
 */
export function getOrderState(id) {
  return request({
    url:'/order_form/state/'+id,
    headers: {"content-type": "application/json;charset=UTF-8"},
    method: 'GET',
    data:'',
    hideloading: false
  })
}