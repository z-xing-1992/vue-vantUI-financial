/**
 * Created by Sunnie on 19/06/04.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function isEmpty(value){
  //  console.log('source',value);
      const type = typeof value;
      if(type === 'undefined') {
  //         console.log('检查到undefined')
          return true;
      }
      if(type === 'string' && value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g,'').length === 0) {
  //         console.log('检查到空字符串')
          return true;
      }
      if(type === 'string' && (value ==='null' || value === null)) {
  //         console.log('检查到空字符串')
          return true;
      }
      if(type === 'number' && isNaN(value)) {
  //         console.log('检查到未知NaN数字对象')
          return true;
      }
      if(type === 'object' && (null === value|| value.length === 0)) {
  //         console.log('检查到空对象')
          return true;
      }
      
      return false;
  }
  
  export function isNotEmpty(value){
      if(isEmpty(value)){
          return false;
      }
      return true;
  }
  export function formatObject(data){
      let params = [];
   
          if (data) {
              for (let item in data) {
                  let vals = data[item];
                  if (vals !== undefined) {
                      params.push(item + '=' + data[item])
                  }
              }
          }
      return params.length ? '?' + params.join('&') : '';
  }

// 获取url的参数 key
export function getQueryString(name)
{
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
    var r = window.location.search.substr(1).match(reg)
    if (r != null) {
        return unescape(r[2])
    }
    return null
}


//判断是否是微信浏览器的函数
export function isWeiXin(){
  //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
  var ua = window.navigator.userAgent.toLowerCase()
  //通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){
    return true
  }else{
    return false
  }
}
export function isPhone (val) {
    // const re = /^1[3456789]\d{9}$/
    // return re.test(val.trim())
    const re = /^1\d{10}$/
    return re.test(val.trim())
}