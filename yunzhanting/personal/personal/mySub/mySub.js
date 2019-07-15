// pages/page/personal/mySub/mySub.js
//引入代码
var {
  getJSON,
  postJSON
} = require("../../../util/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedback: 2,
    mySubList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    var _this = this;
    wx.getStorage({
      key: 'user',
      success(res) {
        getJSON('goods/getByBusiness', {
          'Source-Type': 'free-goods-application'
        }, { 'userId': res.data.userId}, res => {
          if (res.data.code == 200) {
            _this.setData({
              mySubList: res.data.data
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000 //持续的时间
            })
          }
        })
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
      path: 'personal/personal/mySub/mySub',
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