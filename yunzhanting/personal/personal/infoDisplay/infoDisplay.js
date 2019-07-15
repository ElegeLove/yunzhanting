// pages/page/personal/infoDisplay/infoDisplay.js
//引入代码
var { getJSON, postJSON } = require("../../../util/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picList: [],
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    getJSON('show/info', { 'Source-Type': 'free-goods-application' }, '', res => {
      if (res.data.code == 200) {
        // var _this = this;
        this.setData({
          picList: res.data.data
        })
      } else {
        console.log(res.data.message)
      }
    })
    if(this.data.picList.length > 0){
      this.setData({
        show: false
      })
    }else{
      this.setData({
        show: true
      })
    }
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '云展厅',
      path: 'personal/personal/infoDisplay/infoDisplay',
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