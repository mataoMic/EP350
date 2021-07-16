// miniprogram/pages/testConfigureDetail/jindex1.js
import bluetoothService, { BLUETOOTH_EVENT } from '../../services/bluetoothService';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res:'',
    up:{min:-2.00,max:3.00},
    down:{min:-2.00,max:5.00},
    loss:{min:-5.00,max:1.00},
    servicesCompose:[[0],[0,1],[0,2],[3,4,5],[0,6],[0,7]],
    serviceName:['GPON','XGS-PON','NG-PON2','1G-EPON','10G-1G-EPON','10G-EPON','ALT-PON','RF-PON'],
    serviceChoiceList:[],
    services:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      serviceChoiceList:this.data.servicesCompose[options.index],
      _t: app.globalData.base._t(), //翻译
    });
    wx.setNavigationBarTitle({
      title: this.data._t['服务配置']
    })
    bluetoothService.on(BLUETOOTH_EVENT.DATA_RECEIVED, this.onReceive);

    bluetoothService.writeValue('COMMon:DCDEVice:GetThreshold')
    .then(res => {
      // 这是成功
      console.log(res);
    })
    .catch((e)=>{
      // 这是失败
      console.error(e)
    })
  },
  onUnload() {
    bluetoothService.off(BLUETOOTH_EVENT.DATA_RECEIVED, this.onReceive);
  },
  onReceive(res) {
    let that = this
    this.setData({
      res:that.data.res + res
    })
    if (res[res.length-1] ==  '\n') {
      this.showDate(this.data.res)
    }
    console.log('new message', res);
  },
  showDate(data){
    console.log(data)
  },
})