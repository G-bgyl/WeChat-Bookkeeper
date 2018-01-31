// pages/search/search.js

const utils = require('../../utils/util.js');
const service = require('../../service.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    list: [],
    bookMap: {},
    listId: '',
    pagination: {
      search: '',
      start: 0,
      count: 20,
      nomore: false,
      loading: false,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.id = 'l1494780835390';
    const list = service.getBookList(options.id);
    console.debug(list);
    const bookMap = list.reduce((a, b) => {
      a[b.id] = true;
      return a;
    }, {});
    this.setData({
      bookMap: bookMap,
      listId: options.id,
    });
    // this.search({detail: {value: '哈利波特'}});
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
    console.debug('fff');
    this.load();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  showInput: function () {
    this.setData({
        inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
        inputVal: "",
        inputShowed: false
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
    this.setData({'pagination.loading': false, list: [], 'pagination.search': e.detail.value, 'pagination.start': 0, 'pagination.nomore': false});
    this.load();
  },

  gotoBookDetail: function (e) {
    console.debug(e);
    wx.navigateTo({url: '/pages/book/book?from=search&id=' + e.currentTarget.dataset.item.id + '&isbn=' + e.currentTarget.dataset.item.isbn13});
  },

  load: function() {
    if(this.data.pagination.loading || this.data.pagination.nomore) return;
    this.setData({'pagination.loading': true});
    wx.request({
      url: 'https://yueduhr.duapp.com/bookapi.php',
      data: {
        m: 'search',
        q: this.data.pagination.search,
        s: this.data.pagination.start,
        c: this.data.pagination.count,
      },
      success: (res) => {
        console.debug(res);
        // ||是或者的意思
        const list = res.data.books || [];
        if(list.length < this.data.pagination.count) {
          this.setData({'pagination.nomore': true});
        } else {
          this.setData({'pagination.start': this.data.pagination.start + this.data.pagination.count});
        }
        this.setData({
          list: this.data.list.concat(list),
        });
      },
      complete: () => {
        this.setData({'pagination.loading': false});
      }
    });
  },

  addBook: function(e) {
    const item = e.target.dataset.item;
    const state = e.target.dataset.state;
    item.state = state;
    const result = service.addBook(this.data.listId, item);
    if(result) {
      console.debug(result);
      const bookMap = result.reduce((a, b) => {
        a[b.id] = true;
        return a;
      }, {});
      this.setData({bookMap: bookMap});
    } else {
      wx.showToast({
        title: '添加失败',
      });
    }
  },
})