//book.js
const service = require('../../service.js')
Page({
  data: {
    book: {},
  },
  onLoad: function (options) {
    console.debug(options);
    const book = service.getBook(options.id);
    if (book) {
      this.setData({book: book});
      wx.setNavigationBarTitle({title: book.title});
    } else {
      wx.navigateBack();
    }
  }
})
