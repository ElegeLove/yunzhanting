var app = getApp();
var host = 'https://yt.mx5918.com/';
function api(_methods, url, header, data, callback) {

  wx.request({
    url: host + url,
    method: _methods,
    header: header,
    data: data,
    dataType: 'json',
    success: (res) => {
      typeof callback == "function" && callback(res, "");
    },
    fail: (res) => {
      console.log('请求数据失败')
      console.log(err)
      typeof callback == "function" && callback(err, "");
    }
  });
}

export function getJSON(url, header, data, callback) {
  api('GET', url, header, data, callback)
}
export function postJSON(url, header, data, callback) {
  api('POST', url, header, data, callback)
}