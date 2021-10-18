// logs.js
const util = require('../../utils/util.js')
const wxPromise = require('../../utils/wxpromise')
import bluetoothService, { BLUETOOTH_EVENT } from '../../services/bluetoothService';
const app = getApp();
Page({
  data: {
    res:'',
    logs: [],
    passNum:0,
    noState:0
  },
  checkDetails(e){
    wx.navigateTo({
      //目的页面地址
      url: `../logDetails/index?index=${e.currentTarget.dataset.index}`,
      success: function(res){
      },fail(e){
      }
  })
  },
onLoad() {
    this.setData({
      _t: app.globalData.base._t(), //翻译
    });
    wx.setNavigationBarTitle({
      title: this.data._t['历史数据']
    });

    bluetoothService.on(BLUETOOTH_EVENT.DATA_RECEIVED, this.onReceive);

    bluetoothService.writeValue('COMMon:DCDEVice:GetFiles?')
    .then(res => {
      console.log(res)
      // 这是成功
    })
    .catch((e)=>{
      // 这是失败
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
  },
  showDate(data){
    let str = data.slice(data.indexOf(':[{') + 1,data.length-2)
    let json = JSON.parse(str);
    console.log(json)
    json.map((item)=>{
      item.service_flag == 0?this.setData({passNum:this.data.passNum++}):false
    })
    this.setData({logs:json})
    app.globalData.logs = json
  },
  async getInfo(){
    let a = await wxPromise.app.characteristicValue('123')
  }
})
