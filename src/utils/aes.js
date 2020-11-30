export default {
    getKey(){
        // 生成随机key
        const cryptoJS = require("crypto-js");
        var randomKeyString = "";
        var dict = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        while(randomKeyString.length<32){
            randomKeyString += dict[Math.floor(Math.random()*dict.length)];
        }
        var key = cryptoJS.enc.Utf8.parse(randomKeyString);
        return key;
    },
    encrypt(key,content){
        // 根据key设置内容
        const cryptoJS = require("crypto-js");
        return cryptoJS.AES.encrypt(content,key,{
            mode:cryptoJS.mode.ECB,
            padding: cryptoJS.pad.Pkcs7
        }).ciphertext.toString();
    }

}
