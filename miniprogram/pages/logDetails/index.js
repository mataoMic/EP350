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
        title: this.data._t['记录详情']
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    openImg(){
      console.log('123')
      wx.navigateTo({
        url: '../createImg/index?id=1',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function(data) {
            console.log(data)
          },
          someEvent: function(data) {
            console.log(data)
          }
        },
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
        },
        fail:function (err){
          console.log(err)
        }
      })
    }
  }
})
