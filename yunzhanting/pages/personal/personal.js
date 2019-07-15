// pages/personal/personal.js
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
    userUrl: '',
    userName: '',
    isVip: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    var _this = this;
    wx.getStorage({
      key: 'logs',
      success(res) {
        _this.setData({
          userName: res.data.nickName,
          userUrl: res.data.avatarUrl,
        })
      }
    })
    wx.getStorage({
      key: 'user',
      success(res) {
        _this.setData({
          isVip: res.data.isVip
        })
      }
    })
  },
  // 跳转到个人信息页
  bindUserInfo() {
    wx.navigateTo({
      url: '/personal/personal/personalInfo/personalInfo'
    })
  },
  // 跳转到新品了解页
  bindUnderstand() {
    if (this.data.isVip == 1) {
      wx.navigateTo({
        url: '/personal/personal/understand/understand'
      })
    }else{
      wx.showToast({
        title: "非邀请人员无法进入该页面",
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  // 跳转到信息展示页
  bindInfoDisplay() {
    wx.navigateTo({
      url: '/personal/personal/infoDisplay/infoDisplay'
    })
  },
  // 跳转到关于我们页
  bindAbout() {
    wx.navigateTo({
      url: '/personal/personal/about/about'
    })
  },
  // 跳转到我的提交页
  bindMySub() {
    wx.navigateTo({
      url: '/personal/personal/mySub/mySub'
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '云展厅',
      path: 'pages/personal/personal',
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