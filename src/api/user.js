import md5 from 'js-md5';
import AES from '@/utils/aes'
import RSA from '@/utils/rsa'
import qs from 'qs'

import request from '@/utils/request'


// 登录
export function signIn(obj) {
  // 加密
  let key = AES.getKey()
  let rsaEncryptKey = RSA.encrypt(key.toString())
  localStorage.setItem('encryptKey', rsaEncryptKey)
  obj.password = AES.encrypt(key,md5(obj.password))
  return request(
    {
      url:'/debtFilingSystem/user/signIn',
      headers: {"content-type": "application/json;charset=UTF-8"},
      method:'POST',
      data:obj,
      hideloading: false
    }
  )
}

/**
 * 获取自身信息
 */
export function getSelfInfo() {
  return request(
    {
      url:'/debtFilingSystem/user/selfInfo',
      headers: {"content-type": "application/json;charset=UTF-8"},
      method:'GET',
      data:'',
      hideloading: false
    }
  )
}

/**
 * 发送注册验证码
 * @param {*} type 1=注册时获取验证码,2=登陆时获取验证码,（前面两个请求sendSignUpSms） 3=绑定手机验证码,4=修改密码验证码,5=修改邮箱验证码 （后面三个请求sendSignInSms）
 * @param {*} phoneNumber  地区+手机号
 */
export function sendSignUpSms(signUpRequsetForm) {
  return request(
    {
      url:'/sms/tencent/sendSignUpSms',
      headers: {"content-type": "application/json;charset=UTF-8"},
      method:'POST',
      data:signUpRequsetForm,
      hideloading: false
    }
  )
}
// 注册
export function signUp(obj) {
    // 加密
    let key = AES.getKey()
    let rsaEncryptKey = RSA.encrypt(key.toString())
    localStorage.setItem('encryptKey', rsaEncryptKey)
    obj.password = AES.encrypt(key,md5(obj.password))
  return request(
    {
      url:'/debtFilingSystem/user/signUp',
      headers: {"content-type": "application/json;charset=UTF-8"},
      method:'POST',
      data:obj,
      hideloading: false
    }
  )
}

// 根据邀请码获取运营中心名称
export function getOperationCenterName(referrerCode) {
  return request(
    {
      url:'/operationCenter/getNameByReferrerCode/'+referrerCode,
      headers: {"content-type": "application/json;charset=UTF-8"},
      method:'GET',
      data:'',
      hideloading: false
    }
  )
}


/**
 * 发送认证验证码
 * @param {*} type 1=注册时获取验证码,2=登陆时获取验证码,（前面两个请求sendSignUpSms） 3=绑定手机验证码,4=修改密码验证码,5=修改邮箱验证码 （后面三个请求sendSignInSms）
 * @param {*} phoneNumber  地区+手机号
 */
export function sendSms(signUpRequsetForm) {
  return request(
    {
      url:'/sms/tencent/sendSms',
      headers: {"content-type": "application/json;charset=UTF-8"},
      method:'POST',
      data:signUpRequsetForm,
      hideloading: false
    }
  )
}

/**
 * 发送忘记密码验证码
 * @param {*} type 1=注册时获取验证码,2=登陆时获取验证码,（前面两个请求sendSignUpSms） 3=绑定手机验证码,4=修改密码验证码,5=修改邮箱验证码 （后面三个请求sendSignInSms）
 * @param {*} phoneNumber  地区+手机号
 */
export function sendUpdateSms(UpdateRequsetForm) {
  return request(
    {
      url:'/sms/tencent/sendModifyPasswordSms',
      headers: {"content-type": "application/json;charset=UTF-8"},
      method:'POST',
      data:UpdateRequsetForm,
      hideloading: false
    }
  )
}

// 忘记密码
export function UpdatePwd(obj) {
    // 加密
    let key = AES.getKey()
    let rsaEncryptKey = RSA.encrypt(key.toString())
    localStorage.setItem('encryptKey', rsaEncryptKey)
    obj.newPassword = AES.encrypt(key,md5(obj.newPassword))
    if(obj.password){
      obj.password = AES.encrypt(key,md5(obj.password))
    }
  return request(
    {
      url:'/user/changePassword',
      headers: {"content-type": "application/json;charset=UTF-8"},
      method:'PUT',
      data:obj,
      hideloading: false
    }
  )
}



//退出登陆
 export function loggedOut() {
   return request(
     {
       url:'/user/loginOut',
       headers: {"content-type": "application/json;charset=UTF-8"},
       method:'DELETE',
       data:'',
       hideloading: false
     }
   )
 }
// 文件上传
export function uploadKeepSource(formData) {
  return request(
    {
      url: "/file",
      method: 'POST',
      // headers: {"content-type": "multipart/form-data;charset=UTF-8"},
      ContentType: "multipart/form-data",
      data: formData,
      hideloading: false
    }
  )
}

/**
 * 更新用户头像
 * @param {*} obj 
 */
export function updateAvatar(obj) {
  return request(
    {
      url:'/debtFilingSystem/user/uploadAvatar',
      headers: {"content-type": "application/json;charset=UTF-8"},
      method:'PUT',
      data:obj,
      hideloading: false
    }
  )
}

/**
 * 更新用户昵称
 * @param {*} obj 
 */
export function updateRealName(obj) {
  return request(
    {
      url:'/debtFilingSystem/user/updateRealName',
      headers: {"content-type": "application/json;charset=UTF-8"},
      method:'PUT',
      data:obj,
      hideloading: false
    }
  )
}

/**
 * 获取未读通知总数
 */
export function getReadNotifyCount() {
  return request(
    {
      url:'/debtFilingSystem/userNotify/noReadNotifyCount',
      headers: {"content-type": "application/json;charset=UTF-8"},
      method:'GET',
      data:'',
      hideloading: true
    }
  )
}