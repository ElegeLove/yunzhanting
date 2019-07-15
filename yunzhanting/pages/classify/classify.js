// pages/classify/classify.js
//引入代码
var {
  getJSON,
  postJSON
} = require("../../util/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: '0',
    indexId: "",
    contentLeft: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    // 获取屏幕的高度
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          winHeight: res.screenHeight - 128
        })
      },
    })
    
    _this.setData({
      TabCur: 0
    })
    //要延时执行的代码
    getData(_this, 1, 0, true)
    setTimeout(function() {
      //要延时执行的代码
      getData(_this, 2, _this.data.contentLeft[0].id, true)
    }, 500)

    //隐藏缓冲效果
    wx.hideLoading();
  },
  tabSelect(e) {
    var _this = this;
    _this.setData({
      TabCur: e.currentTarget.dataset.index
    })
    getData(_this, 2, e.currentTarget.dataset.id, true)
  },
  // 跳转到搜索页
  bindSearch() {
    wx.navigateTo({
      url: '/home/home/searchInfo/searchInfo'
    })
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
      path: 'pages/classify/classify',
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

function getData(_this, level, parentId, fullGoods) {
  getJSON('catalogue/getAvailableList', {
    'Source-Type': 'free-goods-application'
  }, {
    level: level,
    parentId: parentId,
    fullGoods: fullGoods
  }, res => {
    if (res.data.code == 200) {
      if (level == 1) {
        _this.setData({
          contentLeft: res.data.data,
        })
      } else {
        _this.setData({
          contentList: res.data.data
        })
      }
    } else {
      console.log(res.data.message)
    }
  })
}