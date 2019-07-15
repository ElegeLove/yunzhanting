//引入代码
var {
  getJSON,
  postJSON
} = require("../../util/request.js")

function wxLogin(that, param, phone) {
  getJSON('customer/login?code=' + param + '&wxPhone=' + phone, {
    'Source-Type': 'free-goods-application'
  }, '', res => {
    if (res.data.code == 200) {
      wx.setStorage({
        key: "user",
        data: res.data.data,
        success: function() {
          //授权成功后，跳转进入小程序首页
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: res.data.msg,
        showCancel: false,
        confirmText: '返回授权'
      })
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var isShow = wx.canIUse('button.open-type.getUserInfo');
    var that = this;
    that.setData({
      canIUse: isShow
    })
    // wx.login({
    //   success(res) {
    //     var code = res.code;
    //     wx.getSetting({
    //       success: function(res) {
    //         if (res.authSetting['scope.userInfo']) {
    //           wx.getUserInfo({
    //             success: function(res) {
    //               var param = code;
    //               wxLogin(that, param);
    //             }
    //           });
    //         }
    //       }
    //     })

    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  bindGetUserInfo: function(e) {
    var that = this;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                wx.setStorageSync('logs', res.userInfo)
                // 可以将 res 发送给后台解码出 unionId
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        },
      })
      wx.login({
        success(res) {
          console.log(res)
          var param = res.code;
          var phone = '';
          wxLogin(that, param, phone);
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {}
      })
    }
  }
})