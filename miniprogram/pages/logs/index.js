// logs.js
const util = require('../../utils/util.js')
const wxPromise = require('../../utils/wxpromise')
const app = getApp();
Page({
  data: {
    logs: []
  },
  checkDetails(){
    wx.navigateTo({
      //目的页面地址
      url: `../logDetails/index`,
      success: function(res){
        console.log(res)
      },fail(e){
        console.log(e)
      }
  })
  },
  // onShow(){
  //   console.log('show')
  //   let a = this.getInfo()
  // },
onLoad() {
    // wx.onBLECharacteristicValueChange(function (characteristic) {
    //   console.log('characteristic value comed:', characteristic)
    // })
    app.sendMsg('123')
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return {
          date: util.formatTime(new Date(log)),
          timeStamp: log
        }
      })
    })
    this.setData({
      _t: app.globalData.base._t(), //翻译
    });
    wx.setNavigationBarTitle({
      title: this.data._t['历史数据']
    })
  },
  async getInfo(){
    let a = await wxPromise.app.characteristicValue('123')
    console.log(a);
  }
})
