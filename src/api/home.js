import md5 from 'js-md5';
import AES from '@/utils/aes'
import RSA from '@/utils/rsa'
import qs from 'qs'

import request from '@/utils/request'

// 获取财务咨询系统设置-关于公司介绍
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

// 获取系统消息
export function getUserNotifyList(obj) {
    return request(
        {
            url:'/debtFilingSystem/userNotify/list?'+qs.stringify(obj),
            headers: {"content-type": "application/json;charset=UTF-8"},
            method:'GET',
            data:'',
            hideloading: false
        }
    )
}

/**
 * 根据id获取未读通知详情
 * @param {消息id} id 
 */
export function getUserNotifyDetails(id) {
    return request(
        {
            url:'/debtFilingSystem/userNotify/'+id,
            headers: {"content-type": "application/json;charset=UTF-8"},
            method:'GET',
            data:'',
            hideloading: false
        }
    )
}


// 我的钱包
export function getWallet() {
    return request(
        {
            url:'/debtFilingSystem/user/wallet',
            headers: {"content-type": "application/json;charset=UTF-8"},
            method:'GET',
            data:'',
            hideloading: false
        }
    )
}

//  资金变动记录
export function getWalletLog(obj) {
    return request(
        {
            url:'/debtFilingSystem/user/wallet/log/list?'+qs.stringify(obj),
            headers: {"content-type": "application/json;charset=UTF-8"},
            method:'GET',
            data:'',
            hideloading: false
        }
    )
}
//  资金变动记录
export function getWalletLogDetails(id) {
    return request(
        {
            url:'/debtFilingSystem/user/wallet/log/'+id,
            headers: {"content-type": "application/json;charset=UTF-8"},
            method:'GET',
            data:'',
            hideloading: false
        }
    )
}