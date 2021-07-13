// pages/components/createImg/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes:{
    attached: function() {
      var that = this

      // 获取设备宽高，以备海报全屏显示
  
      wx.getSystemInfo({
  
        success: function (res) {
          console.log(res)
          that.setData({
  
            windowW: res.windowWidth,
  
            windowH: res.windowHeight,
  
            std:(res.windowWidth-20)/5
          })
  
        },
  
      })
      this.setData({
        _t: app.globalData.base._t(), //翻译
      });
      wx.setNavigationBarTitle({
        title: this.data._t['输出报告']
      })
      let a = [{
        name:'GPON',
        servicestate:'活动',
        wavelength:['1310','1490'],
        power:['-15.38','-10.06'],
        threshold:['-20.00','4.00','-20.00','4.00'],
        state:[this.data._t['通过'],this.data._t['通过']]
      },
      {
        name:'XGS-PON',
        servicestate:'活动',
        wavelength:['1270','1578'],
        power:['LOW','LOW'],
        threshold:['-20.00','4.00','-20.00','4.00'],
        state:[this.data._t['未通过'],this.data._t['未通过']]
      }]
      this.setData({
        resList:a
      })
      that.clickMe()
      // 在组件实例进入页面节点树时执行
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    couts: 2,
    std:'',
    resList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMe() {

      var that = this
  
      that.setData({
  
        show: true
  
      })
  
      that.drawCanvas()
  
    },
    
    // 绘制canvas
  
    drawCanvas() {
  
      var that = this
  
      var windowW = that.data.windowW
  
      var windowH = that.data.windowH
  
      // 使用 wx.createContext 获取绘图上下文 context
  
      var context = wx.createCanvasContext('firstCanvas')
      console.log(context)
  
      // 海报背景图
  
      // context.drawImage(that.data.bgpic, (windowW - 280) / 2, (windowH - 450) / 2, 280, 450)
  
      // // 商品图片
  
      // context.drawImage(that.data.propic, (windowW - 170) / 2, (windowH - 390) / 2, 170, 170)
  
      // 标题
      console.log(this.data)
      context.setFontSize(18)
      context.fillText('PON' + this.data._t['功率计报告'], 10, 20)
      // 是否通过
      context.setFillStyle("red")
      context.fillText('X ' + this.data._t['未通过'], windowW-100, 20)
      //子一标题
      context.setFillStyle("#000")
      context.setFontSize(14)
      context.fillText(this.data._t['一般信息'], 10, 40)
      //横线
      context.moveTo(10, 50);
      context.lineTo(windowW-10 , 50);
  
      // 第一行标记
      context.setFontSize(10)
      context.fillText(this.data._t['测量名称'], 10, 70)
      context.fillText(this.data._t['任务指标'], 10, 90)
      context.fillText(this.data._t['测量时间'], 10, 110)
      context.fillText(this.data._t['操作员'], 10, 130)
      context.fillText(this.data._t['连接器标识'], 10, 150)
      context.fillText(this.data._t['位置'], 10, 170)
      context.fillText(this.data._t['校准日期'], 10, 190)
      context.fillText(this.data._t['注释'], 10, 210)
     // 第二行数据
     context.fillText('EP350', 90, 70)
     context.fillText('test', 90, 90)
     context.fillText('2021/4/28 下午 1：52', 90, 110)
     context.fillText('me', 90, 130)
     context.fillText('', 90, 150)
     context.fillText('import', 90, 170)
     context.fillText('2019/11/1', 90, 190)
     context.fillText('', 90, 210)
    
     // 第三行数据
     context.fillText(this.data._t['客户'], 200, 70)
     context.fillText(this.data._t['公司'], 200, 90)
     context.fillText(this.data._t['光纤标识'], 200, 110)
  
     // 第四行数据
     context.fillText(this.data._t['客户'], 250, 70)
     context.fillText(this.data._t['公司'], 250, 90)
     context.fillText(this.data._t['光纤标识'], 250, 110)
  
     // 子二标题
     context.setFillStyle("#000")
     context.setFontSize(14)
     context.fillText(this.data._t['仪器'], 10, 230)
     context.moveTo(10, 240);
     context.lineTo(windowW-10 , 240);
     context.setFontSize(10)
     context.fillText(this.data._t['型号'], 10, 260)
     context.fillText('EP350', 90, 260)
     context.fillText(this.data._t['序列号'], 200, 260)
     context.fillText('1304209', 270, 260)
  
      // 子三标题
      context.setFillStyle("#000")
      context.setFontSize(14)
      context.fillText(this.data._t['结果'], 10, 280)
      context.moveTo(10, 290);
      context.lineTo(windowW-10 , 290);
      context.setFontSize(10)
      context.fillText(this.data._t['测试配置'], 10, 310)
      context.fillText('GPON+XGS-PON', 90, 310)
      let couts = this.data.couts
      let std = this.data.std
      let resList = this.data.resList
     // 表格
    //  // 6个竖线
    //   context.moveTo(10, 320);
    //   context.lineTo(10, 360+couts*60);
    //   this.drawTitle(context,0,10, 330)
      for (let i = 0; i <= 6; i++) {
        if (i === 3) {
          context.moveTo(i*std, 320);
          context.lineTo(i*std, 360+couts*60);
          this.drawTitle(context,i,i*std + 30, 325,this.data._t['阈值'])
          //短竖线
          context.moveTo(i*std + (std+20)/2, 340);
          context.lineTo(i*std + (std+20)/2, 360+couts*60);
          this.drawTitle(context,i,i*std + (std+20)/2, 345,this.data._t['最大值'])
          this.drawTitle(context,i,i*std, 345,this.data._t['最小值'])
          //短横线
          context.moveTo(i*std, 340);
          context.lineTo(i*std + std + 20, 340);
        }else if (i === 4) {
          context.moveTo(i*std + 20, 320);
          context.lineTo(i*std + 20, 360+couts*60);
          this.drawTitle(context,i,i*std + 20, 330)
        }else {
          context.moveTo(i*std + 10, 320);
          context.lineTo(i*std + 10, 360+couts*60);
          this.drawTitle(context,i,i*std + 10, 330)
        }
      }
      
      // 5个长横线
      context.moveTo(10, 320);
      context.lineTo(windowW-10 , 320);
      context.moveTo(10, 360);
      context.lineTo(windowW-10 , 360);
      // 根据services数量划线
      for (let i = 0; i < couts; i++) {
        //横线
        context.moveTo(10, 360+(i+1)*60);
        context.lineTo(windowW-10 , 360+(i+1)*60);
        //小横线
        context.moveTo(10 + std, 360+(i+1)*60 - 30);
        context.lineTo(windowW-10 , 360+(i+1)*60 - 30);
        console.log(resList,resList[i])
        this.drawItem(context,resList[i],10,360+(i+1)*60,10 + std,360+(i+1)*60 - 30)
      }
      // context.moveTo((windowW-10)/5 + 10, 320);
      // context.lineTo((windowW-10)/5 + 10, 360+couts*60);
      // context.moveTo((windowW-10)/5 + 10, 320);
      // context.lineTo((windowW-10)/5 + 10, 360+couts*60);
  
  
  
      // context.setFontSize(30)
  
      // context.setFillStyle("red")
  
      // context.fillText('￥99.99', (windowW - 200) / 2, (windowH + 55) / 2)
  
      // context.setFontSize(18)
  
      // context.setFillStyle("#999999")
  
      // context.fillText('￥99.99', (windowW + 50) / 2, (windowH + 55) / 2)
  
      // context.moveTo((windowW + 45) / 2, (windowH + 44) / 2); //设置线条的起始路径坐标
  
      // context.lineTo((windowW + 200) / 2, (windowH + 44) / 2); //设置线条的终点路径坐标
  
      context.stroke(); //对当前路径进行描边
  
      // 商品名字，名字很长调用方法将文字折行，传参 文字内容text，画布context
  
      // var row = that.newLine(text, context)
  
      // var a = 24 //定义行高25
  
      // for (var i = 0; i < row.length; i++) {
  
      //   context.setFontSize(16)
  
      //   context.setFillStyle("#000000")
  
      //   context.fillText(row[i], (windowW - 195) / 2, (windowH + 130) / 2 + a * i, 320)
  
      // }
  
      // 识别小程序二维码
  
      // context.drawImage(that.data.qCord, (windowW - 180) / 2, (windowH + 289) / 2, 75, 75)
  
      // context.setFillStyle("#000000")
  
      // context.setFontSize(12)
  
      // context.fillText('长按识别小程序', (windowW - 0) / 2, (windowH + 350) / 2)
  
      // context.setFillStyle("#000000")
  
      // context.setFontSize(18)
  
      // context.fillText('享更多好货', (windowW - 0) / 2, (windowH + 390) / 2)
  
      context.draw()
  
    },
  
    drawTitle(context,i,x,y,content) { 
      let info = [this.data._t['服务器'],this.data._t['方向波长'],this.data._t['功率'],this.data._t['阈值'],this.data._t['状态'],this.data._t['状态']]
      if (i<info.length) {
        context.fillText(content?content:info[i], i===0?x+5:x+6, y+10)
      }
    },
    drawItem(context,item,_x,_y,x,y) {
      let std = this.data.std
      context.fillText(item.name,_x+5, _y-25)
      context.fillText(item.servicestate,_x+5, _y-15)
      //波长
      context.fillText(item.wavelength[0],x+5, y-5)
      context.fillText(item.wavelength[1],x+5, y+20)
      //功率
      context.fillText(item.power[0],x + std + 5, y-5)
      context.fillText(item.power[1],x + std + 5, y+20)
      //阈值
      context.fillText(item.threshold[0],x + std*2, y-5)
      context.fillText(item.threshold[1],x + std*2+(std+20)/2 + 5 , y-5)
      context.fillText(item.threshold[2],x + std*2, y+20)
      context.fillText(item.threshold[3],x + std*2+(std+20)/2 + 5, y+20)
      //状态
      context.fillText(item.state[0],x + std*3 + 15, y-5)
      context.fillText(item.state[1],x + std*3 + 15, y+20)
    },
    // 点击保存按钮，同时将画布转化为图片
  
    daochu: function () {
  
      var that = this;
  
      wx.canvasToTempFilePath({
  
        x: 0,
  
        y: 0,
  
        canvasId: 'firstCanvas',
  
        fileType: 'jpg',
  
        quality: 1,
  
        success: function (res) {
  
          that.setData({
  
            shareImage: res.tempFilePath
  
          })
  
          setTimeout(function () {
  
            wx.showModal({
  
              title: '提示',
  
              content: '将生成的海报保存到手机相册，可以发送给微信好友或分享到朋友圈',
  
              success(res) {
  
                if (res.confirm) {
  
                  that.eventSave()
  
                } else if (res.cancel) {
  
                  console.log('用户点击取消')
  
                }
  
              }
  
            })
  
          }, 1000)
  
        }
  
      })
  
    },
  
    // 将商品分享图片保存到本地
  
    eventSave() {
  
      wx.saveImageToPhotosAlbum({
  
        filePath: this.data.shareImage,
  
        success(res) {
  
          wx.showToast({
  
            title: '保存图片成功',
  
            icon: 'success',
  
            duration: 2000
  
          })
  
        }
  
      })
  
    },
  
    //将线上图片地址下载到本地，此函数进行了封装，只有在需要转换url的时候调用即可
  
    getBG(url) {
  
      // Promise函数给我很大的帮助，让我能return出回调函数中的值
  
      return new Promise(function (resolve) {
  
        wx.downloadFile({
  
          url: url,
  
          success: function (res) {
  
            url = res.tempFilePath
  
            resolve(url);
  
          }
  
        })
  
      })
  
    },
  
    // canvas多文字换行
  
    newLine(txt, context) {
  
      var txtArr = txt.split('')
  
      var temp = ''
  
      var row = []
  
      for (var i = 0; i < txtArr.length; i++) {
  
        if (context.measureText(temp).width < 210) {
  
          temp += txtArr[i]
  
        } else {
  
          i--
  
          row.push(temp)
  
          temp = ''
  
        }
  
      }
  
      row.push(temp)
  
      //如果数组长度大于3 则截取前三个
  
      if (row.length > 3) {
  
        var rowCut = row.slice(0, 3);
  
        var rowPart = rowCut[2];
  
        var test = "";
  
        var empty = [];
  
        for (var a = 0; a < rowPart.length; a++) {
  
          if (context.measureText(test).width < 180) {
  
            test += rowPart[a];
  
          } else {
  
            break;
  
          }
  
        }
  
        empty.push(test);
  
        var group = empty[0] + "..." //这里只显示三行，超出的用...表示
  
        rowCut.splice(2, 1, group);
  
        row = rowCut;
  
      }
  
      return row
  
    }
  }
})
