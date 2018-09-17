let today = new Date();

module.exports = {
  threeDaysAgo: () => {
    today.setDate(today.getDate()-3);
    let month = today.getMonth()+1,
        day = today.getDate(),
        year = today.getFullYear();
    if(dd<10) {
      day='0'+day;
    }

    if(month<10) {
      month='0'+month;
    }
    return `${year}-${month}-${day}`;
  },

  currentDay: () => {
    let day = today.getDate(),
        month = today.getMonth()+1,
        year = today.getFullYear();
    if(dd<10) {
      day='0'+day;
    }
    if(month<10) {
      month='0'+month;
    }
    return `${year}-${month}-${day}`
  }

}
