let crypto = require('crypto');

module.exports.generateRandomKey = function(){
  return crypto.randomBytes(48).toString('hex');
}

module.exports.DayCheck = function(Day){
  let Today = new Date;
  Today.setHours(23,59,59,998);
  
  Day = new Date(Day);
  Day.setHours(23,59,59,998);

  if (Today < Day){
    return false;
  }
  else if (Today.getFullYear - 16 > Day.getFullYear){
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