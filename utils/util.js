function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
// 如果只有一位在前面补零
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 格式化书单
function formatBookList(list) {
  list = list || [];
  return list.map(item => {
    return formatBook(item);
  });
}

function formatBook(book) {
  return {
    title: book.title,
    id: book.id,
  };
}

module.exports = {
  formatTime: formatTime,
  formatBookList: formatBookList,
  formatBook: formatBook
}
