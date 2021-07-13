// pages/testConfigure/index.js
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
        title: this.data._t['测试配置']
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
    checkDetails(){
      wx.navigateTo({
        //目的页面地址
        url: `../testConfigureDetail/index`,
        success: function(res){
          console.log(res)
        },fail(e){
          console.log(e)
        }
    })
    },
  }
})
