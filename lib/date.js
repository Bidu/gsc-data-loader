module.exports = {
  dateFormat: function(date) {
    let month = date.getMonth()+1,
        day = date.getDate(),
        year = date.getFullYear();
    if(day<10) {
      day='0'+day;
    }
    if(month<10) {
      month='0'+month;
    }
    return `${year}-${month}-${day}`;
  },
  currentDay: function() {
    let today = new Date();
    return this.dateFormat(today);
  },
  threeDaysAgo: function() { //here we use three days ago, because search analytics delay crawl
    let current = new Date(),
        threeDaysAgo = new Date(current.setDate(current.getDate()-3));
    return this.dateFormat(threeDaysAgo);
  }
}
