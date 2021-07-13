// pages/testConfigureDetail/index.js
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
        title: this.data._t['服务配置']
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    up:{min:-2.00,max:3.00},
    down:{min:-2.00,max:5.00},
    loss:{min:-5.00,max:1.00}
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
