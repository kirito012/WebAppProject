let crypto = require('crypto');

module.exports.generateRandomKey = function(){
  return crypto.randomBytes(48).toString('hex');
}

module.exports.DayCheck = function(Day){
  let Today = new Date;
  Today.setHours(23,59,59,998);
  
  let newDay = new Date(Day);
  newDay.setHours(23,59,59,998);

  console.log(Today.getFullYear());

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

module.exports.Redirect = function(res,url,error){
  if (error){
    res.redirect(url + "?error=" + error);
  }
  else{
    res.redirect(url);
  }
}