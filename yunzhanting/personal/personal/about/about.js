// pages/page/personal/about/about.js
//引入代码
var {
  getJSON,
  postJSON
} = require("../../../util/request.js")

var WxParse = require('../../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aboutInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    const that = this;
    getJSON('aboutUs/detail', {
      'Source-Type': 'free-goods-application'
    }, '', res => {
      if (res.data.code == 200) {
        let data = res.data.data
        WxParse.wxParse('article', 'html', data, that, 0)
      } else {
        console.log(res.data.message)
      }
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '云展厅',
      path: 'personal/personal/about/about',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "转发成功",
          icon: 'none',
          duration: 2000 //持续的时间
        })
        // console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: "转发失败",
          icon: 'none',
          duration: 2000 //持续的时间
        })
        // console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})