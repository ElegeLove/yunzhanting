// pages/page/home/searchInfo/searchInfo.js
var {
  getJSON,
  postJSON
} = require("../../../util/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList: [],
    inputShowed: true
  },
  // onLoad(){
  //   var _this = this
  //   getSearchInfo('', _this)
  // },
  // 搜索
  searchInfo(e) {
    var _this = this
    var data = e.detail.value
    if (e.detail.value == '') {
      _this.setData({
        searchList: []
      })
    } else {
      getSearchInfo(data, _this)
    }
  },
  // 跳转详情页
  bindInfo(e) {
    wx.navigateTo({
      url: '/home/home/productInfo/productInfo?sourceid=' + e.currentTarget.dataset.sourceid
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '云展厅',
      path: 'home/home/searchInfo/searchInfo',
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

function getSearchInfo(name, _this) {
  getJSON('goods/queryByName', {
    'Source-Type': 'free-goods-application'
  }, {
    name: name
  }, res => {
    if (res.data.code == 200) {
      _this.setData({
        searchList: res.data.data
      })
    } else {
      console.log(res.data.message)
    }
  })
}