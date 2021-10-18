// miniprogram/pages/autoMeasure/index1.js
import bluetoothService, { BLUETOOTH_EVENT } from '../../services/bluetoothService';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnDisabled:false,
    res:'',
    services:[],
    starting:false,
    gpon:{up:2.62,down:2.94},
    xgs:{up:-5.92,down:-8.63},
    num:99999
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      _t: app.globalData.base._t(), //翻译
    });
    wx.setNavigationBarTitle({
      title: this.data._t['实时测量']
    })
    bluetoothService.on(BLUETOOTH_EVENT.DATA_RECEIVED, this.onReceive);
  },
  onUnload: function () {
    this.stopMeasure().then(res=>{
    }); 
    bluetoothService.off(BLUETOOTH_EVENT.DATA_RECEIVED, this.onReceive);
    bluetoothService.off(BLUETOOTH_EVENT.DATA_RECEIVED, this.onReceiveData);
  },
  startMeasure(){
    this.setData({
      btnDisabled:true
    })
    bluetoothService.writeValue('COMMon:DCDEVice:StartRealTimeMeasure')
    .then(res => {
    })
    .catch((e)=>{
      console.error(e)
      this.setData({
        btnDisabled:false
      })
    })
  },
  stopMeasure(){
    this.setData({
      btnDisabled:true
    })
    let that = this
    bluetoothService.off(BLUETOOTH_EVENT.DATA_RECEIVED, this.onReceive);
    bluetoothService.off(BLUETOOTH_EVENT.DATA_RECEIVED, this.onReceiveData);
    bluetoothService.on(BLUETOOTH_EVENT.DATA_RECEIVED, function (res) {
      if (res.indexOf('COMMon:DCDEVice:SET:1' > 0)) {
        that.setData({
          starting:false,
          btnDisabled:false
        })
      }
    });
    return bluetoothService.writeValue('COMMon:DCDEVice:StopRealTimeMeasure')
  },
  onReceive(res){
    if (res.indexOf('StartRealTimeMeasure:1') > 0) {
      this.setData({ 
        starting:true,
        btnDisabled:false
      })
      bluetoothService.off(BLUETOOTH_EVENT.DATA_RECEIVED, this.onReceive);
      bluetoothService.on(BLUETOOTH_EVENT.DATA_RECEIVED, this.onReceiveData);
    }
  },
  update(data,that) {
    that.setData({
      services:[]
    })
    let str = data.slice(data.indexOf(':{') + 1,data.length-2)
    let json = JSON.parse(str);
    for (let i = 0; i < json.service_num; i++) {
      let obj = {up:{data:'',type:'',max:'',min:''},down:{data:'',type:'',max:'',min:''}}
      obj.name = json.service_name[i]
      obj.up.data = json.dBm[i][0]
      obj.down.data = json.dBm[i][1]
      obj.up.type = json.high_low[i][0]
      obj.down.type = json.high_low[i][1]
      let arr = that.data.services
      arr.push(obj)
      that.setData({
        services:arr
      })
    }
    that.setData({res:''})
  },
  onReceiveData(res){
    let that = this
    this.setData({
      res:that.data.res + res
    })
    if (res[res.length-1] ==  '\n') {
      this.update(this.data.res,that)
    }
  },
  randomNum(max,min){
    var range = max - min;
    var rand = Math.random();
    var num = min + Math.round(rand * range);
    return num;
  }
})