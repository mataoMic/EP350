// pages/logDetails/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes:{
    attached(){
      this.setData({
        _t: app.globalData.base._t(), //翻译
      });
      wx.setNavigationBarTitle({
        title: this.data._t['实时测量']
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    starting:false,
    gpon:{up:2.62,down:2.94},
    xgs:{up:-5.92,down:-8.63},
    num:99999
  },

  /**
   * 组件的方法列表
   */
  methods: {
    startMeasure(){
      this.setData({ 
        starting:true,
      //   time:setInterval(() => {
      //   this.setData({
      //     ['gpon.up']:this.randomNum(100,0),
      //     ['gpon.down']:this.randomNum(20,-20),
      //     ['xgs.up']:this.randomNum(150,70),
      //     ['xgs.down']:this.randomNum(-10,-50)
      //   })
      // }, 1000)
      })
    },
    stopMeasure(){
      this.setData({
        starting:false
      })
      clearInterval(this.data.time)
    },
    randomNum(max,min){
      var range = max - min;
      var rand = Math.random();
      var num = min + Math.round(rand * range);
      return num;
    }
  }
})
