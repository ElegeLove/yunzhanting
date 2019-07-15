// pages/favorites/favorites.js
// pages/page/favorites/home/home.js
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
    favList: [],
    activeList: [],
    activeCur: '',
    activeCar: false,
    carAllatv: false,
    favListId: ''
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function() {
    var _this = this;
    _this.setData({
      activeCar: false
    })
    favInfo(_this)
    // trans(_this.data.favList)
    setTimeout(function() {
      //要延时执行的代码
      trans(_this, _this.data.favList)
    }, 500)
  },

  // 删除
  bindDel(e) {
    var _this = this;
    wx.getStorage({
      key: 'user',
      success(res) {
        getJSON('favorites/remove?goodsId=' + e.currentTarget.dataset.goodsid, {
          'Source-Type': 'free-goods-application',
          'userId': res.data.userId
        }, '', res => {
          if (res.data.code == 200) {
            favInfo(_this)
            setTimeout(function() {
              //要延时执行的代码
              trans(_this, _this.data.favList)
            }, 500)
            wx.showToast({
              title: '删除成功',
              duration: 2000 //持续的时间
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000 //持续的时间
            })
          }
        })
      }
    })
  },
  // 选中
  carChange(e) {
    let string = "favList[" + e.target.dataset.id + "].setid"
    let strings = "favList[" + e.target.dataset.id + "].carAll"
    this.setData({
      [string]: !this.data.favList[e.target.dataset.id].setid,
      [strings]: !this.data.favList[e.target.dataset.id].carAll
    })
    this.setData({
      activeList: this.data.favList.filter(item => item.setid).map(item => item.setid),
      activeid: this.data.favList.filter(item => (item.catalogueId == e.target.dataset.carlist && item.carAll == true)).map(item => (item.carAllid = true))
    })
    let arr = this.data.favList.filter(item => (item.catalogueId == e.target.dataset.carlist))
    if (this.data.activeid.length == arr.length) {
      this.data.favList.filter(item => (item.catalogueId == e.target.dataset.carlist)).map(item => item.carAllid = true)
      this.setData({
        favList: this.data.favList
      })

    } else {
      this.data.favList.filter(item => (item.catalogueId == e.target.dataset.carlist)).map(item => item.carAllid = false)
      this.setData({
        favList: this.data.favList
      })
    }
    if (this.data.favList.length == this.data.activeList.length) {
      this.setData({
        activeCar: true
      })
    } else {
      this.setData({
        activeCar: false
      })
    }
  },
  // 取消选中
  clear() {
    this.setData({
      activeCar: false
    })
    for (let i = 0; i < this.data.favList.length; i++) {
      let string = "favList[" + i + "].setid"
      let strings = "favList[" + i + "].carAll"
      let stringid = "favList[" + i + "].carAllid"
      this.setData({
        [string]: false,
        [strings]: false,
        [stringid]: false
      })
    }
  },
  //分类选中
  carAll(e) {
    this.setData({
      carAllatv: !this.data.carAllatv
    })
    if (this.data.carAllatv == false) {
      this.data.favList.filter(item => (item.catalogueId == e.currentTarget.dataset.id)).map(item => {
        item.setid = false;
        item.carAllid = false;
      })
      this.setData({
        favList: this.data.favList
      })
    } else {
      this.data.favList.filter(item => (item.catalogueId == e.currentTarget.dataset.id)).map(item => {
        item.setid = true;
        item.carAllid = true;
      })
      this.setData({
        favList: this.data.favList
      })
    }
    this.setData({
      activeList: this.data.favList.filter(item => item.setid).map(item => item.setid)
    })
    if (this.data.favList.length == this.data.activeList.length) {
      this.setData({
        activeCar: true
      })
    } else {
      this.setData({
        activeCar: false
      })
    }
  },
  // 全选
  allChange(e) {
    this.setData({
      activeCar: !this.data.activeCar
    })
    if (this.data.activeCar == false) {
      for (let i = 0; i < this.data.favList.length; i++) {
        let string = "favList[" + i + "].setid"
        let strings = "favList[" + i + "].carAll"
        let stringsid = "favList[" + i + "].carAllid"
        this.setData({
          [string]: false,
          [strings]: false,
          [stringsid]: false
        })
      }
    } else {
      for (let i = 0; i < this.data.favList.length; i++) {
        let string = "favList[" + i + "].setid"
        let strings = "favList[" + i + "].carAll"
        let stringsid = "favList[" + i + "].carAllid"
        this.setData({
          [string]: true,
          [strings]: true,
          [stringsid]: true
        })
      }
    }
  },
  // 提交
  subSure() {
    var _this = this;
    _this.data.favList.filter(item => (item.target == 'infoData')).map(item => (item.val = '希望获取更详细的了解'))
    var arrId = _this.data.favList.filter(item => item.setid).map(item => ({
      goodsId: item.id,
      remark: item.val
    }))
    wx.getStorage({
      key: 'user',
      success(res) {
        postJSON('business/commit', {
          'userId': res.data.userId,
          'Source-Type': 'free-goods-application'
        }, arrId, res => {
          if (res.data.code == 200) {
            _this.clear()
            _this.data.favList.filter(item => (item.id)).map(item => (item.target = ''))
            _this.setData({
              favList: _this.data.favList,
              valData:''
            })
            wx.showToast({
              title: "提交成功",
              icon: 'none',
              duration: 2000 //持续的时间
            })
          } else {
            wx.showToast({
              title: "请选择需要提交的产品",
              icon: 'none',
              duration: 2000 //持续的时间
            })
          }
        })
      }
    })
  },
  // 模态框
  showModal(e) {
    this.setData({
      modalshow: e.currentTarget.dataset.target,
      favListId: e.currentTarget.dataset.id,
      activeCur: ''
    })
  },
  //反馈原因
  modelChange(e) {
    this.data.favList.filter(item => (item.id == this.data.favListId)).map(item => (item.target = e.currentTarget.dataset.cur))
    this.setData({
      favList: this.data.favList,
      activeCur: e.currentTarget.dataset.cur
    })
  },
  hideModal(e) {
    this.setData({
      modalshow: null
    })
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },
  // ListTouch计算方向
  ListTouchMove(e) {
    if (e.touches[0].pageX - this.data.ListTouchStart > 50) {
      this.setData({
        ListTouchDirection: 'right'
      })
    }
    if (this.data.ListTouchStart - e.touches[0].pageX > 50) {
      this.setData({
        ListTouchDirection: 'left'
      })
    }
  },
  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  bindinput(e) {
    this.data.favList.filter(item => (item.id == e.currentTarget.dataset.id)).map(item => {
      if (item.target == 'message') {
        item.val = e.detail.value
        return item.val
      }
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
      path: 'pages/favorites/favorites',
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

function trans(_this, data) {
  let cache = {} // cache存储的键是eid，值是这个eid在indices数组中的下标
  let indices = [] // 数组中的每一个值是一个数组，数组中的每一个元素是原数组中相同eid的下标
  data.forEach((item, i) => {
    let eid = item.catalogueId
    let index = cache[eid]
    if (index !== undefined) {
      indices[index].push(i)
    } else {
      cache[eid] = indices.length
      indices.push([i])
    }
  })
  /**
   * 此时，cache：{cat: 0, dog: 1, pig: 2}
   * indices: [[0, 1, 3, 5], [2, 6], [4]]
   * indices中的第1项是eid为cat的数组下标
   * indices中的第2项是eid为dog的数组下标
   * indices中的第3项是eid为pig的数组下标
   */
  let result = []
  indices.forEach(item => {
    item.forEach(index => {
      result.push(data[index]) // 依次把index对应的元素data[index]添加进去即可
    })
  })
  _this.setData({
    favList: result
  })
  // return result
}

function favInfo(_this) {
  wx.getStorage({
    key: 'user',
    success(res) {
      getJSON('favorites/list', {
        'Source-Type': 'free-goods-application',
        'userId': res.data.userId
      }, '', res => {
        if (res.data.code == 200) {
          _this.setData({
            favList: res.data.data
          })
        } else {
          console.log(res.data.message)
        }
      })
    }
  })
}