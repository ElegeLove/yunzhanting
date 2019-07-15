//引入代码
var {
  getJSON,
  postJSON
} = require("../../util/request.js")
Page({
  data: {
    cardCur: 0,
    showLeft: '/assets/images/showLeft.png',
    showRight: '/assets/images/showRight.png',
    library: '/assets/images/ic_library.png',
    inventory: '/assets/images/ic_inventory.png',
    tabListLenght: '',
    swiperList: [],
    scrollList: [],
    mainbar: 0,
    TabCur: 0,
    banner: {},
    homeList: [],
    special: {},
    residence: {},
    recommend: {},
    reHome: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    // 初始化towerSwiper 传已有的数组名即可
    this.setData({
      tabListLenght: this.data.homeList.length
    })
    this.towerSwiper('swiperList');

    getJSON('home/getHome', {
      'Source-Type': 'free-goods-application'
    }, '', res => {
      if (res.data.code == 200) {
        let data = res.data.data
        var _this = this;
        let arr = [];
        for (var i in data) {
          //1:banner
          if (data[i].type == 1) {
            _this.setData({
              banner: data[i]
            })
          }
          //2:展区
          if (data[i].type == 2) {
            arr.push(data[i])
            _this.setData({
              homeList: arr
            })
          }
          //3:专题展示区
          if (data[i].type == 3) {
            _this.setData({
              special: data[i]
            })
          }
          //4底部展示区
          if (data[i].type == 4) {
            _this.setData({
              residence: data[i]
            })
          }
          //5底部图片栏
          if (data[i].type == 5) {
            _this.setData({
              recommend: data[i]
            })
          }
        }
      } else {
        console.log(res.data.message)
      }
    })
    getJSON('goods/getByRecommend', {
      'Source-Type': 'free-goods-application'
    }, '', res => {
      if (res.data.code == 200) {
        var _this = this;
        _this.setData({
          reHome: res.data.data
        })
      } else {
        console.log(res.data.message)
      }
    })
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id
    })
  },
  // 专题展示
  bindInfo(e) {
    if (e.currentTarget.dataset.type == 1) {
      // 跳转详情页
      wx.navigateTo({
        url: '/home/home/productInfo/productInfo?sourceid=' + e.currentTarget.dataset.sourceid
      })
    } else if (e.currentTarget.dataset.type == 2) {
      // 跳转爆品专区
      wx.navigateTo({
        url: '/home/home/explosives/explosives?sourceid=' + e.currentTarget.dataset.sourceid
      })
    }
  },
  // 跳转详情页
  bindInfoData(e) {
    wx.navigateTo({
      url: '/home/home/productInfo/productInfo?sourceid=' + e.currentTarget.dataset.sourceid
    })
  },
  // 跳转到搜索页
  bindSearch() {
    wx.navigateTo({
      url: '/home/home/searchInfo/searchInfo'
    })
  },
  onShareAppMessage: function(ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '云展厅',
      path: 'pages/index/index',
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