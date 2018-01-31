function getListList() {
  // es6最新版本 有const，意思是常量
    const idList = wx.getStorageSync('listIdList') || [];
    const listMap = wx.getStorageSync('listMap') || {};
    console.debug(idList);
    const list = idList.map(item => {
        return listMap[item];
    });
    return list;
}

function getList(listId) {
    const listMap = wx.getStorageSync('listMap') || {};
    return listMap[listId];
}

function addList(title, description) {
    const idList = wx.getStorageSync('listIdList') || [];
    const listMap = wx.getStorageSync('listMap') || {};
    const id = 'l' + new Date().getTime();
    console.debug(id);
    listMap[id] = {
        id: id,
        title: title,
        description: description,
        datetime: new Date().getTime(),
    };
    idList.push(id);
    wx.setStorageSync('listIdList', idList);
    wx.setStorageSync('listMap', listMap);
    return getListList();
}

function editList(id, title, description) {
    const idList = wx.getStorageSync('listIdList') || [];
    const listMap = wx.getStorageSync('listMap') || {};
    if(!listMap[id]) {
        idList.push(id);
        wx.setStorageSync('listIdList', idList);
        listMap[id] = {
            id: id,
            title: title,
            description: description,
            datetime: new Date().getTime(),
        };
    } else {
        listMap[id].title = title;
        listMap[id].description = description;
    }
    wx.setStorageSync('listMap', listMap);
    return getListList();
}

function removeList(listId) {
    let idList = wx.getStorageSync('listIdList') || [];
    const listMap = wx.getStorageSync('listMap') || {};
    delete listMap[listId];
    idList = idList.reduce((a, b) => {
        if(b !== listId) {
            a.push(b);
        }
        return a;
    }, []);
    wx.setStorageSync('listIdList', idList);
    wx.setStorageSync('listMap', listMap);
    return getListList();
}

function getBookList(listId) {
    const listMap = wx.getStorageSync('listMap') || {};
    if(listMap[listId]) {
        const list = listMap[listId];
        const bookIdList = list.books || [];
        const bookMap = wx.getStorageSync('bookMap') || {};
        const bookList = bookIdList.map(item => {
            return bookMap[item];
        });
        return bookList;
    } else {
        return [];
    }
}

function addBook(listId, book) {
    console.debug(listId, book);
    const bookMap = wx.getStorageSync('bookMap') || {};
    const listMap = wx.getStorageSync('listMap') || {};
    if(listMap[listId]) {
        const list = listMap[listId];
        const bookIdList = list.books || [];
        if (bookIdList.find(item => item === book.id)) {
            return getBookList(listId);
        }
        bookIdList.push(book.id);
        list.books = bookIdList;
        bookMap[book.id] = book;
        wx.setStorageSync('bookMap', bookMap);
        wx.setStorageSync('listMap', listMap);
        return getBookList(listId);
    } else {
        return false;
    }
}

function editBook(book) {
    const bookMap = wx.getStorageSync('bookMap') || {};
    if(bookMap[book.id]) {
        bookMap[book.id].state = book.state;
        wx.setStorageSync('bookMap', bookMap);
        return bookMap[book.id];
    } else {
        return false;
    }
}

function getBook(bookId) {
    const bookMap = wx.getStorageSync('bookMap') || {};
    return bookMap[bookId];
}
// 一个文件就是一个模块 表示向外暴露方法{}包裹起来的是一个对象
module.exports = {
  getListList: getListList,
  getList: getList,
  addList: addList,
  editList: editList,
  removeList: removeList,
  addBook: addBook,
  getBook: getBook,
  editBook: editBook,
  getBookList: getBookList
}