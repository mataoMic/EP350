// miniprogram/pages/testConfigureDetail/jindex1.js
import bluetoothService, { BLUETOOTH_EVENT } from '../../services/bluetoothService';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    res:'',
    up:{min:-2.00,max:3.00},
    down:{min:-2.00,max:5.00},
    servicesCompose:[[0],[0,1],[0,2],[3,4,5],[0,6],[0,7]],
    serviceName:['GPON','XGS-PON','NG-PON2','1G-EPON','10G-1G-EPON','10G-EPON','ALT-PON','RF-PON'],
    serviceChoiceList:[],
    servicesData:[],
    canSet:true
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
    })
    .catch((e)=>{
      // 这是失败
    })
  },
  onUnload() {
    bluetoothService.off(BLUETOOTH_EVENT.DATA_RECEIVED, this.onReceive);
  },
  bindInput(e){
    // 表单双向数据绑定
    var that = this;
    var dataset = e.currentTarget.dataset;
    // data-开头的是自定义属性，可以通过dataset获取到，dataset是一个json对象
    var name = dataset.name;
    var type = dataset.type;
    
    var value = e.detail.value;

    // 拼接对象属性名，用于为对象属性赋值
    var attributeName = 'servicesData.' + 'Service' + type + '[' + name  + ']'
    this.setData({canSet:true})
    if (!this.IsNumber(parseInt(value))) {
      this.setData({canSet:false})
      return false
    }
    that.setData({
      [attributeName]: parseInt(value)
    });
  },
  onReceive(res) {
    let that = this
    this.setData({
      res:that.data.res + res
    })
    if (res[res.length-1] ==  '\n') {
      this.showDate(this.data.res)
    }
  },
  showDate(data){
    let str = data.slice(data.indexOf(':{') + 1,data.length-2)
    let json = JSON.parse(str);
    this.setData({servicesData:json})
  },
  IsNumber(value){
    return (typeof value === 'number' && !isNaN(value))
  },
  async setVal(){
    if (!this.data.canSet) {
      Notify({ type: 'danger', message:'must number!' });
      return false
    }
    let res = await this.JudgeNumber(this.data.servicesData,this)
   if (!res) {
     return false
   }
    let str = 'COMMon:DCDEVice:SetThreshold:' + JSON.stringify(this.data.servicesData)
    bluetoothService.off(BLUETOOTH_EVENT.DATA_RECEIVED, this.onReceive);
    bluetoothService.on(BLUETOOTH_EVENT.DATA_RECEIVED, function (res) {
    });
    for (let i = 0; i < str.length; i = i+60) {
      bluetoothService.writeValue(str.slice(i,i+60>i.length?str.length:i+60),i+60>str.length?false:true)
      .then(res => {
        console.log(res)
        Notify({ type: 'success', message:'√' });
        // 这是成功
      })
      .catch((e)=>{
        Notify({ type: 'danger', message:'X' });
        // 这是失败
      })
    }
  },
  JudgeNumber(data,that){
    let result = true
    Object.keys(data).forEach(function(key){
      if (data[key][0] < data[key][1] || data[key][2] < data[key] [3]) {
        Notify({ type: 'danger', message:that.data._t['最小值不得大于最大值'] });
        result = false
      }
      for (let i = 0; i < data[key].length; i++) {
        if (data[key][i] > 26 || data[key][i] < -50) {
          Notify({ type: 'danger', message:that.data._t['阈值需在-50到26之间'] });
          result = false
        }
      }
    });
    return result
  }
})