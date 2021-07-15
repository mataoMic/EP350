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
  connect(event){
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
  BELConnect(event) {
    var that = this;
    var deviceIndex = event.currentTarget.dataset.index
    return new Promise((s,e)=>{
      wx.createBLEConnection({
        deviceId: event.currentTarget.id,
        success: function (res) {
          console.log('调试信息：' + res.errMsg);
          console.log(event.currentTarget.dataset.index)
          that.setData({
            connectedDeviceId: event.currentTarget.id,
            info: "MAC地址：" + event.currentTarget.id + '  调试信息：' + res.errMsg,
            ['devices['+deviceIndex+'].isConnect']: true
          })
          Toast.success({message: '连接成功' });
          s();
        },
        fail: function () {
          Toast.fail({message: '连接失败' });
          e()
        },
      })
    })
  },
  stopSearch(event) {
    var that = this;
    return new Promise((s,e)=>{
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          console.log("停止搜索" + JSON.stringify(res.errMsg));
          that.setData({
            info: "停止搜索" + JSON.stringify(res.errMsg),
          })
          s()
        },
        fail(){
          e()
        }
      })
    })
  },
  getServices(event) {
    var that = this;
    return new Promise((s,e)=>{
      wx.getBLEDeviceServices({
        // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
        deviceId: that.data.connectedDeviceId,
        success: function (res) {
          console.log('services UUID:\n', JSON.stringify(res.services));
          for (var i = 0; i < res.services.length; i++) {
            console.log("第" + (i + 1) + "个UUID:" + res.services[i].uuid + "\n")
          }
          that.setData({
            services: res.services,
            info: JSON.stringify(res.services),
          })
          s()
        },fail(){
          e()
        }
      })
    })
  },
  getCharacteristics(event) {
    var that = this;
    // var myUUID = that.data.servicesUUID;//具有写、通知属性的服务uuid
    var myUUID = that.data.services[0].uuid
    console.log('UUID' + myUUID)
    console.log('id' + that.data.connectedDeviceId)
    return new Promise((s,e)=>{
      wx.getBLEDeviceCharacteristics({
        // 这里的 deviceId 需要在上面的接口中获取
        deviceId: that.data.connectedDeviceId,
        // 这里的 serviceId 需要在上面的 接口中获取
        serviceId: myUUID,
        success: function (res) {
          console.log(res)
          console.log("%c getBLEDeviceCharacteristics", "color:red;");
          for (var i = 0; i < res.characteristics.length; i++) {
            console.log('特征值：' + res.characteristics[i].uuid)
  
            if (res.characteristics[i].properties.notify) {
              console.log("notifyServicweId：", myUUID);
              console.log("notifyCharacteristicsId：", res.characteristics[i].uuid);
              that.setData({
                notifyServicweId: myUUID,
                // notifyCharacteristicsId: "0000ff01-0000-1000-8000-00805f9b34fb",//手动设置notifyCharacteristicsId为这个UUID，为了方便写死在这里
                notifyCharacteristicsId: res.characteristics[i].uuid
              })
              app.globalData.notifyCharacteristicsId = res.characteristics[i].uuid
            }
            if (res.characteristics[i].properties.write) {
              console.log("writeServicweId：", myUUID);
              console.log("writeCharacteristicsId：", res.characteristics[i].uuid);
              that.setData({
                writeServicweId: myUUID,
                writeCharacteristicsId:res.characteristics[i].uuid,
              })
            }
          }
          console.log('device getBLEDeviceCharacteristics:', res.characteristics);
  
          that.setData({
            msg: JSON.stringify(res.characteristics),
          })
          s()
        },
        fail: function (res) {
          console.log(res);
          e()
        },
      })
    })
  },
  listenNotify(event) {
    var that = this;
    // var notifyServicweId = that.data.servicesUUID;  //具有写、通知属性的服务uuid
    var notifyServicweId = that.data.services[0].uuid; //具有写、通知属性的服务uuid
    var notifyCharacteristicsId = that.data.notifyCharacteristicsId;
    console.log("启用notify的serviceId", notifyServicweId);
    console.log("启用notify的notifyCharacteristicsId", notifyCharacteristicsId);
    return new Promise((s,e)=>{
      wx.notifyBLECharacteristicValueChange({
        state: true, // 启用 notify 功能
        deviceId: that.data.connectedDeviceId,
        // 这里的 serviceId 就是that.data.servicesUUID
        serviceId: notifyServicweId,
  
        characteristicId: that.data.notifyCharacteristicsId,
        success: function (res) {
          console.log('notifyBLECharacteristicValueChange success', res.errMsg)
          var msg = '启动notify:' + res.errMsg
          that.setData({
            info: msg
          })
          s()
        },
        fail: function (res) {
          console.log('启动notify:' + res.errMsg);
          e()
        },
      })
    })
  },
  acceptMessage(event) {
    var that = this;
    app.globalData.deviceId = that.data.connectedDeviceId
    app.globalData.serviceId = that.data.services[0].uuid
    app.globalData.characteristicId = that.data.writeCharacteristicsId
    console.log("开始接收数据");
    wx.onBLECharacteristicValueChange(function (res) {
      // console.log("characteristicId：" + res.characteristicId)
      // console.log("serviceId:" + res.serviceId)
      // console.log("deviceId" + res.deviceId)
      // console.log("Length:" + res.value.byteLength)
      console.log("hexvalue:" + app.ab2hex(res.value))
      app.ab2str(res.value)
      // that.setData({
      //   info: that.data.info + ab2hex(res.value)
      // })
    })
  },
  sendMessage(event) {
    var that = this
    var hex = that.data.sendmsg //要发送的信息
    console.log('要发送的信息是：' + hex)
    console.log( 'deviceId: '+ that.data.connectedDeviceId)
    console.log('serviceId:'+ that.data.services[0].uuid)
    console.log('characteristicId:'+ that.data.writeCharacteristicsId)
    // var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
    //   return parseInt(h, 16)
    // }))
    // console.log(typedArray)
    var ab = app.str2ab(hex+'\r\n');
    console.log(ab)
    // var ab = app.str2ab("COMMon:DCDEVice:GetThreshold"+'\n')
    wx.writeBLECharacteristicValue({
      deviceId: that.data.connectedDeviceId,
      serviceId: that.data.services[0].uuid,
      characteristicId: that.data.writeCharacteristicsId,
      // 这里的value是ArrayBuffer类型
      value: ab,
      success: function (res) {
        console.log('写入成功', res.errMsg)
      },
      fail(res) {
        console.log('写入失败', res.errMsg)
      }
    })
  },
  //获取输入框的数据
  getmsg(event) {
    this.setData({
      sendmsg: event.detail.value
    })
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  // 微信官方给的ArrayBuffer转16进度字符串示例
 ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join(',');
},
// ArrayBuffer转为字符串，参数为ArrayBuffer对象
ab2str(buf) {
  console.log(buf)
  let unit8Arr = new Uint8Array(buf);
  let encodedString = String.fromCharCode.apply(null, unit8Arr),
    decodedString = decodeURIComponent(escape((encodedString))); //没有这一步中文会乱码
    console.log(encodedString,decodedString)
},
// 字符串转为ArrayBuffer，参数为字符串对象
str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
},
  /**
   * 生命周期函数--监听页面加载
   */
async onLoad() {
    this.setData({
      _t: app.globalData.base._t(), //翻译
    });
    wx.setNavigationBarTitle({
      title: this.data._t['蓝牙搜索']
    })
    bluetoothService.on(BLUETOOTH_EVENT.DEVICE_FOUND, this.bluetoothDeviceFound);
    bluetoothService.on(BLUETOOTH_EVENT.DATA_RECEIVED, this.bluetoothNewData);
    await bluetoothService.startDiscovery().catch(err => {
      console.error(err);
    });
  },
  bluetoothDeviceFound(res) {
    console.log(res);
    this.setData({ devices: res });
  },
  bluetoothNewData(res) {
    console.log(res);
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