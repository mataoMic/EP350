// miniprogram/pages/bels/index.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import bluetoothService, { BLUETOOTH_EVENT } from '../../services/bluetoothService';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 这里是一些组件内部数据
    // devices:[{name:'name1',deviceId:'111'},{name:'name2',deviceId:'222'},{name:'name3',deviceId:'333'}],
    noticeMsg:'',
    show:false,
    devices:[],
    someData: {},
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
  //搜索蓝牙按钮
  searchBEL() {
    var that = this
    this.getSystemInfo();
    this.initializeBEL().then(function () {
      return that.getBELstatue()
    }).then(function () {
      return that.searchBELs()
    }).then(function () {
      return that.getDeviceInfo()
    })
  },
  initializeBEL(event) {
    var that = this;
    return new Promise((s, e) => {
      wx.openBluetoothAdapter({
        success: function (res) {
          that.setData({ noticeMsg:'搜索蓝牙设备...',show: true });
          console.log('初始化蓝牙适配器成功')
          //页面日志显示
          that.setData({
            info: '初始化蓝牙适配器成功'
          })
          that.setData({ noticeMsg:'蓝牙准备中...',show: true });
          s()
        },
        fail: function (res) {
          console.log('请打开蓝牙和定位功能')
          Notify({ type: 'warning', message: '请打开蓝牙和定位功能' });
          e()
        }
      })
    })
  },
  getBELstatue(event) {
    var that = this;
    return new Promise((s, e) => {
      wx.getBluetoothAdapterState({
        success: function (res) {
          //打印相关信息
          console.log(JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available);
          that.setData({
            info: JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available
          })
          s()
        },
        fail: function (res) {
          //打印相关信息
          console.log(JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available);
          that.setData({
            info: JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available
          })
          e()
        }
      })
    })
  },
  searchBELs(event) {
    var that = this;
    return new Promise((s, e) => {
      wx.startBluetoothDevicesDiscovery({
        //services: ['6E400001-B5A3-F393-E0A9-E50E24DCCA9E'], //如果填写了此UUID，那么只会搜索出含有这个UUID的设备，建议一开始先不填写或者注释掉这一句 11161D35-8704-8299-20C6-A422DB852EFC
        allowDuplicatesKey: false,
        success: function (res) {
          that.setData({
            info: "搜索设备" + JSON.stringify(res),
          })
          console.log('搜索设备返回' + JSON.stringify(res))
          s()
        }
      })
      // wx.onBluetoothDeviceFound(function(res){
      //   console.log('搜索设备返回' + JSON.stringify(res))
      // })
    })
  },
  getDeviceInfo(event) {
    var that = this;
    that.setData({
      devices: []
    })
    return new Promise((s, e) => {
      wx.getBluetoothDevices({
        success: function (res) {
          console.log(res)
          // let filterStr = that.data.systemInfo == 'android'?'E3:C0:D2:4F:63:D5':'11161D35'
          let filterStr = 'EP350'
          let newArr = res.devices.filter((item, index, arr) => {
            item.isConnect = false
            return item.name.indexOf(filterStr) >= 0
          });
          that.setData({
            info: "设备列表\n" + JSON.stringify(newArr),
            devices: newArr
          })
          that.setData({ show: false });
          Toast.success({message: '搜索完毕' });
          console.log('搜设备数目：' + res.devices.length)
          console.log('设备信息：\n' + JSON.stringify(res.devices) + "\n")
          s();
        }
      })
    })
  },
  //连接蓝牙按钮
  connect(event) {
    var that = this;
    Toast.loading({
      message: '连接中...',
      forbidClick: true,
    });
    that.BELConnect(event).then(()=>{
      return that.stopSearch()
    }).then(()=>{
      return that.getServices()
    }).then(()=>{
      return that.getCharacteristics()
    }).then(()=>{
      return that.listenNotify()
    }).then(()=>{
      return that.acceptMessage()
    })
  },
  disconnect(e) {
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    console.log(deviceId + '断开连接')
    wx.closeBLEConnection({
      deviceId,
      success (res) {
        console.log(res)
      }
    })
  },
  async connectDevice(e) {
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId

    const device = await bluetoothService.connect(deviceId).then(res => {
      app.globalData.connected = true
      this.setData({
        ['devices['+ds.index+'].isConnect']: true
      })
    })
      .catch(err => console.error(err));
  },
  /**
   * 生命周期函数--监听页面加载
   */
async onLoad() {
  bluetoothService.getConnectedDevice().then(res => {
    if (res.devices) {
      res.devices[0].isConnect = true
      this.setData({
        devices:res.devices
      })
    }
  })
    this.setData({
      _t: app.globalData.base._t(), //翻译
    });
    wx.setNavigationBarTitle({
      title: this.data._t['蓝牙搜索']
    })
    // bluetoothService.on(BLUETOOTH_EVENT.DEVICE_FOUND, this.bluetoothDeviceFound);
    bluetoothService.on(BLUETOOTH_EVENT.CONNECT_STATE_CHANGE, this.bluetoothConnectStateChange);
    bluetoothService.on(BLUETOOTH_EVENT.DATA_RECEIVED, this.bluetoothNewData);
    await bluetoothService.startDiscovery().catch(err => {
      console.error(err);
    });
  },
  onUnload() {
    bluetoothService.stopDiscovery().catch((e)=>{
      console.error(e)
    });
    bluetoothService.off(BLUETOOTH_EVENT.CONNECT_STATE_CHANGE, this.bluetoothConnectStateChange);
    bluetoothService.off(BLUETOOTH_EVENT.DATA_RECEIVED, this.bluetoothNewData);
  },
  bluetoothDeviceFound(res) {
    let filterStr = 'EP350'
    let newArr = res.filter((item, index, arr) => {
      item.isConnect = bluetoothService.connectedDevice.deviceId == item.deviceId?true:false
      return item.name.indexOf(filterStr) >= 0
    });
    console.log(res);
    this.setData({ devices: newArr });
  },
  bluetoothConnectStateChange(res) {
    console.log(res);
    app.globalData.connected = res.connected
    if(res.connected){
      Notify({ type: 'primary', message: 'conneed' });
    }else {
      let _devices = this.data.devices.filter((item,index,arr)=>{
        return item.isConnect = false
      })
      this.setData({
        devices:_devices
      })
      Notify({ type: 'danger', message:'break' });
    }
    
  },
  bluetoothNewData(res) {
    console.log(res);
  }
})