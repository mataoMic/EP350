// app.js
// var base = require('./utils/base');  //路径可能做相应调整
// const _ = base._; //翻译函数
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    if (this.globalData.base.getLanguage() == 'zh_CN') {
      this.globalData.language = 'English'
    } else {
      this.globalData.language = '中文'
    };
    this.globalData._t = this.globalData.base._t()
  },
  globalData: {
    userInfo: null,
    language:'中文',
    base:require('./utils/base'),
    _t:'',
    deviceId:'',
    serviceId:'',
    characteristicId:'',
    notifyCharacteristicsId:''
  },
  openNotify(){

  },
    sendMsg(msg){
    let that = this
    wx.writeBLECharacteristicValue({
      deviceId: that.globalData.deviceId,
      serviceId: that.globalData.serviceId,
      characteristicId: that.globalData.characteristicId,
      // 这里的value是ArrayBuffer类型
      value: that.str2ab(msg+'\n'),
      success: function (res) {
        console.log('写入成功', res.errMsg)
        // that.readDevice()
      },
      fail(res) {
        console.log('写入失败', res.errMsg)
      }
    })
  },
  characteristicValue(msg){
    let that = this;
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId: that.globalData.deviceId,
      serviceId: that.globalData.serviceId,
      characteristicId: that.globalData.notifyCharacteristicsId,
      success: function (res) {
        console.log('notifyBLECharacteristicValueChange success', res.errMsg)
        that.sendMsg(msg)
      },
      fail: function (res) {
        console.log('启动notify:' + res.errMsg);
      },
    })
  },
  str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  },
  ab2str(buf) {
    console.log(buf)
    let unit8Arr = new Uint8Array(buf);
    let encodedString = String.fromCharCode.apply(null, unit8Arr),
      decodedString = decodeURIComponent(escape((encodedString))); //没有这一步中文会乱码
      console.log(encodedString,decodedString)
  },
  ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join(',');
  },
  toRoute(e){
    let toUrl = e.currentTarget.dataset.url
    wx.navigateTo({
      //目的页面地址
      url: `../${toUrl}/index`,
      success: function(res){
        console.log(res)
      },fail(e){
        console.log(e)
      }
  })
  },
})
