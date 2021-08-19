// logs.js
const util = require('../../utils/util.js')
const wxPromise = require('../../utils/wxpromise')
import bluetoothService, { BLUETOOTH_EVENT } from '../../services/bluetoothService';
const app = getApp();
Page({
  data: {
    res:'',
    logs: [],
    passNum:5,
    noState:0
  },
  checkDetails(e){
    wx.navigateTo({
      //目的页面地址
      url: `../logDetails/index?index=${e.currentTarget.dataset.index}`,
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
    // app.sendMsg('123')
    this.setData({
      _t: app.globalData.base._t(), //翻译
    });
    wx.setNavigationBarTitle({
      title: this.data._t['历史数据']
    });

    bluetoothService.on(BLUETOOTH_EVENT.DATA_RECEIVED, this.onReceive);

    bluetoothService.writeValue('COMMon:DCDEVice:GetFiles?')
    .then(res => {
      // 这是成功
      console.log('写入成功',res);
    })
    .catch((e)=>{
      // 这是失败
      console.error(e)
    })
  },
  onUnload() {
    bluetoothService.off(BLUETOOTH_EVENT.DATA_RECEIVED, this.onReceive);
    bluetoothService.stopDiscovery().catch((e)=>{
      console.error(e)
    })
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
    let str = data.slice(data.indexOf(':[{') + 1,data.length-2)
    console.log(str)
    let json = JSON.parse(str);
    this.setData({logs:json})
    app.globalData.logs = json
    console.log(json)
  },
  async getInfo(){
    let a = await wxPromise.app.characteristicValue('123')
    console.log(a);
  }
})
