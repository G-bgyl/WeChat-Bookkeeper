const service = require('../../service.js');

Page({
  data: {
    listId: '',
    title: '',
    description: '',
    doing: false,
  },

  onLoad: function(options) {
    if (options.id) {
      this.setData({
        listId: options.id,
      });
    } else {
      wx.navigateBack();
    }
  },

  onTitleInput: function(e) {
    this.setData({
      title: e.detail.value
    });
  },

  onDescriptionInput: function(e) {
    this.setData({
      description: e.detail.value
    });
  },

  addBook: function() {
    wx.showModal({
      title: '提示',
      content: '开发中',
      showCancel: false,
    });
    return;
    if (this.data.doing) return;

    if (!this.data.title) {
      wx.showModal({
        title: '提示',
        content: '请输入书单名称！',
        showCancel: false,
      });
      return;
    }

    if (this.data.description.length > 200) {
      wx.showModal({
        title: '提示',
        content: '书单介绍最多200个字！',
        showCancel: false,
      });
      return;
    }

    this.setData({
      doing: true
    });
    let result;
    if (this.data.id) {
      result = service.editList(this.data.id, this.data.title, this.data.description);
    } else {
      result = service.addList(this.data.title, this.data.description);
    }

    if (result) {
      wx.navigateBack();
    } else {
      wx.showModal({
        title: '错误',
        content: (this.data.id ? '保存' : '添加') + '书单失败！',
        showCancel: false,
      });
      this.setData({
        doing: false
      });
    }
  }
});