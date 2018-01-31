// pages/list/list.js

const service = require('../../service.js');
const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    list: [],
    listId: '',
    inputShowed: false,
    inputVal: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.debug(options);
    this.setData({listId: options.id});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const detail = service.getList(this.data.listId);
    wx.setNavigationBarTitle({title: detail.title});
    const list = service.getBookList(this.data.listId);
    this.setData({list: list.filter(item => item.title.toLowerCase().indexOf(this.data.inputVal.toLowerCase() || '') != -1), detail: detail});
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  showActionSheet: function () {
    wx.showActionSheet({
      itemList: ['扫描条形码', '搜索书籍', '手动录入'],
      success: (res) => {
        console.debug(res);
        switch(res.tapIndex) {
          case 0:
            this.scanCode();
            break;

          case 1:
            wx.navigateTo({
              url: '/pages/search/search?id=' + this.data.listId,
            });
            break;

          case 2:
            wx.navigateTo({
              url: '/pages/form/form?id=' + this.data.listId,
            });
            break;
        }
      }
    });
  },

  gotoBookDetail: function(e) {
    const book = e.currentTarget.dataset.item;
    wx.navigateTo({url: '/pages/book/book?id=' + book.id});
  },

  scanCode: function () {
    wx.scanCode({
      success: res => {
        console.debug(res);
        if (res.scanType === 'EAN_13') {
          wx.request({
            url: 'https://yueduhr.duapp.com/bookapi.php',
            data: {
              m: 'getinfo',
              isbn: res.result,
            },
            success: (res) => {
              console.debug(res);
              if (res.data) {
                const result = service.addBook(this.data.listId, res.data);
                wx.showToast({title: '添加成功', icon: 'success'});
                this.setData({list: result});
              } else {
                wx.showToast({title: '没有查找到书籍信息'});
              }
              // this.setData({
              //   list: res.data.books || [],
              // });
            },
            complete: () => {
              this.setData({loading: false});
            }
          });
        } else {
          wx.showToast({title: '请扫描图书的条形码！'});
        }
      },
      fail: e => {
        console.debug(e);
      }
    });
  },

  showInput: function () {
    this.setData({
        inputShowed: true
    });
  },

  hideInput: function () {
    const list = service.getBookList(this.data.listId);
    this.setData({
        inputVal: "",
        inputShowed: false,
        list: list
    });
  },

  clearInput: function () {
    this.setData({
        inputVal: ""
    });
  },

  inputTyping: function (e) {
    this.setData({
        inputVal: e.detail.value
    });
  },

  search: function (e) {
    const list = service.getBookList(this.data.listId);
    this.setData({list: list.filter(item => item.title.toLowerCase().indexOf(this.data.inputVal.toLowerCase() || '') != -1)});
  },

  switchState: function(e) {
    const state = e.target.dataset.state;
    const book = e.target.dataset.item;
    if(state == book.state) {
      return;
    } else {
      book.state = state;
      service.editBook(book);
      this.setData({
        list: this.data.list.map(item => {
          if(item.id == book.id) {
            return book;
          } else {
            return item;
          }
        })
      });
    }
  }
})