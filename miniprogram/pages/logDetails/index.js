// miniprogram/pages/logDetails/index1.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    log:{
      dBm: [-15, -17.01, -15, -62.48, "", ""],
      file_index: 0,
      file_name: "A-EP00095",
      high_low: [4, 4, 4, 4, "", ""],
      service_flag: 2,
      service_name: ["GPON", "XGS", ""],
      service_num: 2,
      wave: [1310, 1490, 1270, 1578, "", ""]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      _t: app.globalData.base._t(), //翻译
    });
    wx.setNavigationBarTitle({
      title: this.data._t['记录详情']
    })
    this.reloadLog(app.globalData.logs[options.index])
  },
reloadLog(log){
  let serviceData = []
  for (let i = 0; i < log.service_name.length; i++) {
    this.setData({file_name:log.file_name})
    if (log.service_name[i] !== '') {
      let _log = {
        dBm:{up:log.dBm[i*2],down:log.dBm[i*2+1]},
        type:{up:log.high_low[i*2],down:log.high_low[i*2+1]},
        service_name:log.service_name[i],
        threshold:{up:{max:log.threshold[i][0],min:log.threshold[i][1]},down:{max:log.threshold[i][2],min:log.threshold[i][3]}},
        time:log.save_time
      }
      serviceData.push(_log)
    }
  }
  this.setData({serviceData})
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})