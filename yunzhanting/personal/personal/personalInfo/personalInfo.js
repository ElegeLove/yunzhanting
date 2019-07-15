// pages/page/personal/personalInfo/personalInfo.js
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
    sex: ['男', '女'],
    region: ['重庆市', '重庆市'],
    userId: '',
    avatarUrl: '',
    userName: "",
    nickName: '',
    isModel: false,
    multiArray: [],
    multiIndex: [0, 0, 0],
    firstAreaCode: '',
    secondAreaCode: '',
    sourceid: '',
    wxPhone: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    if (options.sourceid == undefined) {
      _this.setData({
        sourceid: ''
      })
    } else {
      _this.setData({
        sourceid: options.sourceid
      })
    }
    wx.getStorage({
      key: 'logs',
      success(res) {
        _this.setData({
          avatarUrl: res.data.avatarUrl,
          nickName: res.data.nickName
        })
      }
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
              company: res.data.data.company,
              section: res.data.data.dept,
              position: res.data.data.position,
              firstAreaCode: res.data.data.firstAreaCode,
              secondAreaCode: res.data.data.secondAreaCode,
            })
            if (res.data.data.wxPhone == '') {
              _this.setData({
                wxPhone: '获取绑定手机号码',
                isClick: false
              })
            } else {
              _this.setData({
                wxPhone: res.data.data.wxPhone,
                isClick: true
              })
            }
            if (res.data.data.firstAreaName == '' || res.data.data.secondAreaName == '') {
              _this.setData({
                region: ['重庆市', '重庆市']
              })
            } else {
              _this.setData({
                region: [res.data.data.firstAreaName, res.data.data.secondAreaName]
              })
            }
          } else {
            console.log(res.data.message)
          }
        })
      }
    })
    getJSON('area/allList', {
      'Source-Type': 'free-goods-application'
    }, '', res => {
      if (res.data.code == 200) {
        var temp = res.data.data;
        _this.setData({
          provinces: temp,
          multiArray: [temp, temp[0].children],
          multiIndex: [0, 0]
        })
      } else {
        console.log(res.data.message)
      }
    })
  },

  SexChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  conserve(e) {
    var _this = this;
    var m = _this.data.multiIndex[0]
    var n = _this.data.multiIndex[1]
    var temp = _this.data.multiArray[0]
    var city = _this.data.multiArray[1]
    if (_this.data.isModel == false) {
      if (_this.data.firstAreaCode == '' && _this.data.secondAreaCode == '') {
        temp[m].code = '';
        city[n].code = '';
      } else {
        temp[m].code = _this.data.firstAreaCode;
        city[n].code = _this.data.secondAreaCode;
      }
    }
    if (e.detail.value.userName != '' && _this.data.index != '' && e.detail.value.userPhone != '' && temp[m].code != '' && city[n].code != '') {
      wx.getStorage({
        key: 'logs',
        success(res) {
          _this.setData({
            avatarUrl: res.data.avatarUrl,
            nickName: res.data.nickName
          })

          postJSON('customer/save', {
            'userId': _this.data.userId,
            'Source-Type': 'free-goods-application'
          }, {
            userId: _this.data.userId,
            name: e.detail.value.userName,
            nick: _this.data.nickName,
            sex: _this.data.index,
            wxPhone: _this.data.wxPhone,
            phone: e.detail.value.userPhone,
            company: e.detail.value.company,
            dept: e.detail.value.section,
            position: e.detail.value.position,
            head: _this.data.avatarUrl,
            firstAreaCode: temp[m].code,
            secondAreaCode: city[n].code
          }, res => {
            if (res.data.code == 200) {
              wx.login({
                success(res) {
                  var code = res.code;
                  wx.getSetting({
                    success: function(res) {
                      if (res.authSetting['scope.userInfo']) {
                        wx.getUserInfo({
                          success: function(res) {
                            getJSON('customer/login?code=' + code, {
                              'Source-Type': 'free-goods-application'
                            }, '', res => {
                              if (res.data.code == 200) {
                                wx.setStorage({
                                  key: "user",
                                  data: res.data.data,
                                  success: function() {
                                    var pages = getCurrentPages() //获取加载的页面
                                    var currentPage = pages[pages.length - 2]
                                    var url = currentPage.route //当前页面url
                                    console.log(url)
                                    if (url == 'pages/index/index') {
                                      wx.reLaunch({
                                        url: '/home/home/productInfo/productInfo?sourceid=' + _this.data.sourceid
                                      })
                                    } else {
                                      url = "/" + url
                                      wx.reLaunch({
                                        url: url
                                      })
                                    }
                                  }
                                });
                                wx.getUserInfo({
                                  success: res => {
                                    wx.setStorageSync('logs', res.userInfo)
                                  }
                                })
                              }
                            })
                          }
                        });
                      }
                    }
                  })

                }
              })
              wx.showToast({
                title: "保存成功",
                icon: 'none',
                duration: 2000 //持续的时间
              })
            } else {
              console.log(res.data.message)
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: "请完善个人信息",
        icon: 'none',
        duration: 2000 //持续的时间
      })

    }
  },
  //点击确定
  bindMultiPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value,
      isModel: true
    })
  },
  //滑动
  bindMultiPickerColumnChange: function(e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    //更新滑动的第几列e.detail.column的数组下标值e.detail.value
    data.multiIndex[e.detail.column] = e.detail.value;
    //如果更新的是第一列“省”，第二列“市”和第三列“区”的数组下标置为0
    if (e.detail.column == 0) {
      data.multiIndex = [e.detail.value, 0];
    } else if (e.detail.column == 1) {
      //如果更新的是第二列“市”，第一列“省”的下标不变，第三列“区”的数组下标置为0
      data.multiIndex = [data.multiIndex[0], e.detail.value];
    }
    var temp = this.data.provinces;
    data.multiArray[0] = temp;
    if ((temp[data.multiIndex[0]].children).length > 0) {
      //如果第二列“市”的个数大于0,通过multiIndex变更multiArray[1]的值
      data.multiArray[1] = temp[data.multiIndex[0]].children;
    } else {
      //如果第二列“市”的个数不大于0，那么第二列“市”和第三列“区”都赋值为空数组
      data.multiArray[1] = [];
    }
    //data.multiArray = [temp, temp[data.multiIndex[0]].children, temp[data.multiIndex[0]].children[data.multiIndex[1]].areas];
    //setData更新数据
    this.setData(data);
  },
  getPhoneNumber(e) {
    var _this = this;
    wx.getStorage({
      key: "user",
      success(res) {
        postJSON('customer/decryptPhone', {
          'Source-Type': 'free-goods-application'
        }, {
          sessionKey: res.data.sessionKey,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        }, res => {
          if (res.data.code == 200) {
            _this.setData({
              wxPhone: res.data.data.phoneNumber,
              isClick: true
            })
          } else {
            console.log(res.data.message)
          }
        })
      }
    });
  },
  onShareAppMessage: function(ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '云展厅',
      path: 'personal/personal/personalInfo/personalInfo',
      success: function(res) {
        // 转发成功
        wx.showToast({
          title: "转发成功",
          icon: 'none',
          duration: 2000 //持续的时间
        })
        // console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
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