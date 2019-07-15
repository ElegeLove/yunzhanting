//app.js
//引入代码
var {
  getJSON,
  postJSON
} = require("util/request.js")
App({
  data: {
    url: ''
  },
  
  // onShareAppMessage: function (ops) {
  //   if (ops.from === 'button') {
  //     // 来自页面内转发按钮
  //     console.log(ops.target)
  //   }
  //   return {
  //     title: 'xx小程序',
  //     path: 'pages/index/index',
  //     success: function (res) {
  //       // 转发成功
  //       console.log("转发成功:" + JSON.stringify(res));
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //       console.log("转发失败:" + JSON.stringify(res));
  //     }
  //   }
  // },
  onLaunch: function() {
    wx.updateShareMenu({
      withShareTicket: true,
      success() { }
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    //判断是否断网
    var url;
    var currentPage;
    wx.onNetworkStatusChange(function(res) {
      if (res.isConnected == false) {
        var pages = getCurrentPages() //获取加载的页面
        if (pages.length < 2) {
          currentPage = pages[pages.length - 1]
        } else {
          currentPage = pages[pages.length - 2] //获取当前页面的对象
        }
        url = currentPage.route //当前页面url
        wx.reLaunch({
          url: '/home/home/nullNetwork/nullNetwork'
        })
      } else {
        url = "/" + url
        wx.reLaunch({
          url: url
        })
      }
    })

    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.login() //重新登录
      }
    })
    wx.getStorage({
      key: 'user',
      success(res) {},
      fail: function() {
        //若无登录信息则跳转到授权页面授权登录
        wx.reLaunch({
          url: '/pages/login/login'
        })
      }
    })
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  globalData: {
    userInfo: null
  }
})