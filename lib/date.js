let today = new Date();

module.exports = {
  start: () => {
    today.setDate(today.getDate()-2);
        mm = today.getMonth()+1;
        dd = today.getDate();
        yyyy = today.getFullYear();
    if(dd<10) {
      dd='0'+dd;
    }

    if(mm<10) {
      mm='0'+mm;
    }
    return `${yyyy}-${mm}-${dd}`;
  },

  end: () => {
        dd = today.getDate(),
        mm = today.getMonth()+1,
        yyyy = today.getFullYear();
    if(dd<10) {
      dd='0'+dd;
    }
    if(mm<10) {
      mm='0'+mm;
    }
    return `${yyyy}-${mm}-${dd}`
  }

}
