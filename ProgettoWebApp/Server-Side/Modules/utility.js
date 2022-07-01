let crypto = require('crypto');

module.exports.generateRandomKey = () => {
  return crypto.randomBytes(48).toString('hex');
}

module.exports.DayCheck = (Day) => {
  let Today = new Date;
  Today.setHours(23,59,59,998);
  
  let newDay = new Date(Day);
  newDay.setHours(23,59,59,998);

  if (Today < newDay){
    return false;
  }
  else if (Today.getFullYear() - 16 > newDay.getFullYear()){
    return true;
  }
  else {
    return false;
  }
}

module.exports.checklength = (obj,callback,error) => {
  if (obj.length > 0){
    callback();
  }
  else{
    error();
  }
};