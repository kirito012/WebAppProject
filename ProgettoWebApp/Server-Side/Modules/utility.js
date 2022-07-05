let crypto = require('crypto');
let validator = require("email-validator");

module.exports.generateRandomKey = () => {
  return crypto.randomBytes(48).toString('hex');
}

module.exports.dayCheck = (day) => {
  let today = new Date;
  today.setHours(23,59,59,998);
  
  let newDay = new Date(day);
  newDay.setHours(23,59,59,998);

  if (today < newDay){
    return false;
  }
  else if (today.getFullYear() - 16 > newDay.getFullYear()){
    return true;
  }
  else {
    return false;
  }
}

module.exports.checkEmail = (Email) => {
  if (Email) {
    return validator.validate(Email);
  }
  else{
    return false
  }
}

module.exports.checkLength = (obj,callback,error) => {
  if (Object.keys(obj).length > 0 || obj.length > 0){
    callback();
  }
  else{
    error();
  }
};

module.exports.forEach = (obj,callback,lastindexcallback) => {
  if (typeof obj == "object"){
    let keys = Object.keys(obj);

    for (let key in obj) {
      callback(obj[key],key);

      if (key == keys[keys.length - 1] && lastindexcallback != undefined){
        lastindexcallback();
      }
    }
  }
  else if (Array.isArray(obj)){
    for (let i = 0; i < obj.length;i++){
      callback(obj[i],i);

      if (i == obj.length -1 && lastindexcallback != undefined) {
        lastindexcallback();
      }
    }
  }
  else {
    throw console.error("you can't loop over a " + typeof obj);
  }
}
