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
    servicesData:[]
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
  bindInput(e){
    // 表单双向数据绑定
    var that = this;
    var dataset = e.currentTarget.dataset;
    console.log(dataset)
    // data-开头的是自定义属性，可以通过dataset获取到，dataset是一个json对象
    var name = dataset.name;
    var type = dataset.type;
    
    var value = e.detail.value;

    // 拼接对象属性名，用于为对象属性赋值
    var attributeName = 'servicesData.' + 'Service' + type + '[' + name  + ']'
    console.log(attributeName + ':' + value)
    that.setData({
      [attributeName]: parseInt(value)
    });
    console.log(that.data.servicesData)
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
    let str = data.slice(data.indexOf(':{') + 1,data.length-2)
    console.log(str)
    let json = JSON.parse(str);
    this.setData({servicesData:json})
    console.log(json)
  },
  setVal(){
    console.log(this.data.servicesData)
    let str1 = JSON.stringify(this.data.servicesData)
    console.log(str1)
    let str = 'COMMon:DCDEVice:SetThreshold:' + JSON.stringify(this.data.servicesData)
    console.log(str)
    bluetoothService.off(BLUETOOTH_EVENT.DATA_RECEIVED, this.onReceive);
    bluetoothService.on(BLUETOOTH_EVENT.DATA_RECEIVED, function (res) {
      console.log(res)
    });
    for (let i = 0; i < str.length; i = i+60) {
      console.log(str.slice(i,i+60>i.length?str.length:i+60))
      bluetoothService.writeValue(str.slice(i,i+60>i.length?str.length:i+60),i+60>str.length?false:true)
      .then(res => {
        // 这是成功
        console.log(res);
      })
      .catch((e)=>{
        // 这是失败
        console.error(e)
      })
    }
  }
})