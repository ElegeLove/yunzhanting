//引入代码
var {
  getJSON,
  postJSON
} = require("../../../util/request.js")
var WxParse = require('../../../wxParse/wxParse.js')
Page({
  data: {
    favactive: false,
    productInfo: {},
    activeCur: '',
    msgInfo: "",
    remark: '',
    sourceid:''
  },
  onLoad(option) {
    var _this = this;
    _this.setData({
      sourceid: option.sourceid
    })
    wx.getStorage({
      key: 'user',
      success(res) {
        getJSON('goods/get/' + option.sourceid, {
          'Source-Type': 'free-goods-application'
        }, {
          'userId': res.data.userId
        }, res => {
          if (res.data.code == 200) {
            let data = res.data.data
            WxParse.wxParse('article', 'html', data.materials, _this, 0)
            _this.setData({
              productInfo: data,
              favactive: data.favorites
            })
          } else {
            console.log(res.data.message)
          }
        })
      }
    })
  },
  NavChange(e) {
    var _this = this;
    if (_this.data.favactive) {
      wx.getStorage({
        key: 'user',
        success(res) {
          getJSON('favorites/remove', {
            'userId': res.data.userId,
            'Source-Type': 'free-goods-application'
          }, {
            goodsId: _this.data.productInfo.id
          }, res => {
            if (res.data.code == 200) {
              _this.setData({
                favactive: false
              })
              wx.showToast({
                title: "取消收藏",
                icon: 'none',
                duration: 2000 //持续的时间
              })
            } else {
              wx.showToast({
                title: "取消失败",
                icon: 'none',
                duration: 2000 //持续的时间
              })
            }
          })
        }
      })
    } else {
      wx.getStorage({
        key: 'user',
        success(res) {
          getJSON('favorites/save?goodsId=' + _this.data.productInfo.id, {
            'userId': res.data.userId,
            'Source-Type': 'free-goods-application'
          }, '', res => {
            if (res.data.code == 200) {
              _this.setData({
                favactive: true
              })
              wx.showToast({
                title: "收藏成功",
                icon: 'none',
                duration: 2000 //持续的时间
              })
            } else {
              wx.showToast({
                title: "收藏失败",
                icon: 'none',
                duration: 2000 //持续的时间
              })
            }
          })
        }
      })
    }
  },
  modelChange(e) {
    var _this = this
    if (e.currentTarget.dataset.cur == "infoData") {
      _this.setData({
        remark: "希望获取更详细的了解"
      })
    }
    if (e.currentTarget.dataset.cur == "message") {
      _this.setData({
        remark: _this.data.msgInfo
      })
    }
    _this.setData({
      activeCur: e.currentTarget.dataset.cur
    })
  },
  bindinput(e) {
    this.setData({
      remark: e.detail.value
    });
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: ""
    })
  },
  // 跳转智能商城
  goGoods() {
    wx.navigateToMiniProgram({
      appId: 'wx45533ccb907e277f',
      path: '/pages/index/index',
      success(res) {
      },
      fail(res){
      }
    })
  },
  subSure() {
    var _this = this;
    _this.setData({
      modalName: null
    })
    wx.getStorage({
      key: 'user',
      success(res) {
        _this.setData({
          userId: res.data.userId
        })
        getJSON('customer/detail', {
          'userId': res.data.userId,
          'Source-Type': 'free-goods-application'
        }, '', res => {
          res.data.data.sex = res.data.data.sex.toString()
          if (res.data.code == 200) {
            _this.setData({
              userName: res.data.data.name,
              index: res.data.data.sex,
              userPhone: res.data.data.phone,
            })
          } else {
            console.log(res.data.message)
          }
        })
      }
    })
    wx.getStorage({
      key: 'user',
      success(res) {

        if (res.data.perfectInfo == 1) {
          var userId = res.data.userId;
          getJSON('customer/detail', {
            'userId': res.data.userId,
            'Source-Type': 'free-goods-application'
          }, '', res => {
            // res.data.data.sex = res.data.data.sex.toString()
            if (res.data.code == 200) {
              if (res.data.data.sex == 0) {
                _this.setData({
                  sex: '先生',
                })
              } else {
                _this.setData({
                  sex: '女士',
                })
              }
              _this.setData({
                userName: res.data.data.name,
                userPhone: res.data.data.phone,
              })
              wx.showModal({
                title: '提示',
                content: _this.data.userName + _this.data.sex + '，我们将通过' + _this.data.userPhone + '联系到您，若是，请点击确认，若不是，请点击取消,再进行修改',
                // content: '联系到您，若是，请点击确认，若不是，请点击取消,再进行修改',
                success: function(res) {
                  if (res.confirm) {
                    postJSON('business/commit', {
                      'userId': userId,
                      'Source-Type': 'free-goods-application'
                    }, [{
                      'goodsId': _this.data.productInfo.id,
                      'remark': _this.data.remark
                    }], res => {
                      if (res.data.code == 200) {
                        wx.showToast({
                          title: "提交成功",
                          icon: 'none',
                          duration: 2000 //持续的时间
                        })
                        _this.setData({
                          modalName: null
                        })
                      } else {
                        wx.showToast({
                          title: "提交失败",
                          icon: 'none',
                          duration: 2000 //持续的时间
                        })
                      }
                    })
                  } else if (res.cancel) {
                    wx.redirectTo({
                      url: '/personal/personal/personalInfo/personalInfo?sourceid=' + _this.data.sourceid
                    })
                  }
                }
              })
            } else {
              console.log(res.data.message)
            }
          })
        } else {
          wx.navigateTo({
            url: '/personal/personal/personalInfo/personalInfo?sourceid=' + _this.data.sourceid
          })
        }
      }
    })
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 200) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // 返回首页
  backIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  // 返回我的收藏页
  backFav() {
    wx.switchTab({
      url: '/pages/favorites/favorites'
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '云展厅',
      path: 'home/home/productInfo/productInfo?sourceid=' + this.data.sourceid,
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