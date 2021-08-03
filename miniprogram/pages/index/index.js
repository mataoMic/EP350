// pages/lanyatest/lanyatest.js
// var base = require('../../utils/base');  //路径可能做相应调整
const app = getApp();
import bluetoothService, { BLUETOOTH_EVENT } from '../../services/bluetoothService';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    connected:false,
    language:'',
    show: false,
    info: "未初始化蓝牙适配器",
    connectedDeviceId: "",
    deviceId: "",
    services: "",
    servicesUUID: "0000ff00-0000-1000-8000-00805f9b34fb",
    serviceId: "",
    notifyCharacteristicsId: "",
    writeCharacteristicsId: "",
    sendmsg: "",
    systemInfo:'',
    activeKey:'1',
    steps: [
      {
        text: '步骤一',
        desc: '描述信息'
      },
      {
        text: '步骤二',
        desc: '描述信息'
      },
      {
        text: '步骤三',
        desc: '描述信息'
      },
      {
        text: '步骤四',
        desc: '描述信息'
      }
    ],
    a:[{b:1}]
  },
  chooseFile(){
    wx.downloadFile({
      url: '../../utils/files/hetong.pdf',
      filePath: wx.env.USER_DATA_PATH + '/temp.pdf',
      success: function(res) {
        wx.openDocument({
          filePath: res.filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      },fail: function(res){
        console.log(res)
      }
    })
  },
  onShareAppMessage(){
    let that =this;
    return {
      title: '简直走别拐弯', // 转发后 所显示的title
      path: '/pages/index/index', // 相对的路径
      success: (res)=>{    // 成功后要做的事情
        // console.log
       
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res)=> { 
            that.setData({
              isShow:true
            }) 
           },
          fail: function (res) { console.log(res) },
          complete: function (res) { console.log(res) }
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  toRoute(e){
    app.toRoute(e)
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  getSystemInfo(){
    try {
      const res = wx.getSystemInfoSync()
      this.setData({
        systemInfo:res.platform
      })
      console.log(res.model)
      console.log(res.pixelRatio)
      console.log(res.windowWidth)
      console.log(res.windowHeight)
      console.log(res.language)
      console.log(res.version)
      console.log(res.platform)
      console.log(res.environment)
    } catch (e) {
      // Do something when catch error
    }
  },
  onShow(){
    this.setData({
      connected : app.globalData.connected
    })
    console.log(app.globalData.connected)
  },
  onLoad: function () {
    // 登录页面切换中英文需要
    console.log(app.globalData.connected)
    bluetoothService.on(BLUETOOTH_EVENT.CONNECT_STATE_CHANGE, this.bluetoothConnectStateChange);
    this.language = app.globalData.language
    if (app.globalData.base.getLanguage() == 'zh_CN') {
      this.setData({
        language: 'English',
      })
    } else {
      this.setData({
        language: '中文',
      })
    };
    this.setData({
      _t: app.globalData.base._t(), //翻译
    });
  },
  onUnload() {
    bluetoothService.off(BLUETOOTH_EVENT.CONNECT_STATE_CHANGE, this.bluetoothConnectStateChange);
  },
  bluetoothConnectStateChange(res){
    this.setData({connected : res.connected})
  },
  switchLanguage: function() {
    if (app.globalData.base.getLanguage() == 'zh_CN'){
      console.log('切换至英文');
      wx.setStorageSync('Language', 'en'); // 利用本地缓存存放用户中英文选项
    }else{
      console.log('切换至中文');
      wx.setStorageSync('Language', 'zh_CN');
    };
    wx.navigateTo({
      url: 'index',
    });
  }
})
