// pages/page/home/explosives/explosives.js
//引入代码
var { getJSON, postJSON } = require("../../../util/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exList:[]
  },
  onLoad(option) {
    this.setData({
      sourceid: option.sourceid
    })
    getJSON('goods/getByFeature', { 'Source-Type': 'free-goods-application' }, { featureId: this.data.sourceid }, res => {
      if (res.data.code == 200) {
        let data = res.data.data
        var _this = this;
        _this.setData({
          exList: data
        })
      } else {
        console.log(res.data.message)
      }
    })
  },
  // 跳转详情页
  bindInfo(e) {
    wx.navigateTo({
      url: '/home/home/productInfo/productInfo?sourceid=' + e.currentTarget.dataset.id
    })
  },
  // 跳转到搜索页
  bindSearch() {
    wx.navigateTo({
      url: '/home/home/searchInfo/searchInfo'
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '云展厅',
      path: 'home/home/explosives/explosives?sourceid=' + this.data.sourceid,
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