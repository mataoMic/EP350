// miniprogram/pages/setting/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    blue: true,
    ont:true,
    vfl:true,
    minHour: 10,
    maxHour: 20,
    minDate: new Date(2000, 12, 12).getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
    currentDate: new Date().getTime(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      _t: app.globalData.base._t(), //翻译
    });
    wx.setNavigationBarTitle({
      title: this.data._t['设置']
    })
  },
  onChange(e) {
    this.setData({ [e.currentTarget.dataset.id]: e.detail });
  },
  onTime(event) {
    this.setData({
      radio: event.detail,
    });
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  confirm(e){
    console.log(e)
    this.setData({ 
      show: false, 
      currentDate:e.detail
    })
  },
})