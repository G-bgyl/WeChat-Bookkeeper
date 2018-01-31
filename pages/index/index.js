//index.js

const service = require('../../service.js');

Page({
  data: {
    list: []
  },

  onShow: function () {
    const list = service.getListList();
    console.debug(list);
    this.setData({list: list})
  },

  gotoListDetail: function(e) {
    const listId = e.target.dataset.item.id;
    wx.navigateTo({
      url: '/pages/list/list?id=' + listId,
      // 请求参数 query 参数， 多个参数：?id=123&name=ttt
    });
  },

  addList: function() {
    wx.navigateTo({
      url: '/pages/create-list/create-list',
    });
  },

  removeList: function(e) {
    wx.showModal({
      title: '确认',
      content: '确定要删除该书单吗？',
      // 箭头函数
      // 
      success: res => {
        if(res.confirm) {
          const item = e.target.dataset.item;
          const result = service.removeList(item.id);
          if(result) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
            });
            this.setData({list: result});
          } else {
            wx.showToast({
              title: '删除失败',
            });
          }
          console.debug(e, item);
        }
      }
    })
  }
})
