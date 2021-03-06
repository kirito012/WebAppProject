let crypto = require('crypto');
let validator = require("email-validator");
let path = require("path");
const { json } = require('stream/consumers');

module.exports.generateRandomKey = () => {
  return crypto.randomBytes(48).toString('hex');
}

module.exports.capFormat = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
  if (obj) {
    if (Object.keys(obj).length > 0 || obj.length > 0){
      callback();
    }
    else{
      if (error){
        error();
      }
    }
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

module.exports.formatDate = (date) => {
  return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
}

module.exports.getModels = (fw, callback) => {
  let jsonData = [];

  fw.queryDB("SELECT * FROM modelli;",[],(results) => {
    fw.utility.forEach(results, (model,i) => {
      jsonData[i] = model.name;
    }, () => {
      callback(jsonData);
    });
  });
}

module.exports.getMachines = (fw, utente, callback) => {
  fw.queryDB("selectCorrispondenze",[utente.id], (corrispondenze) => {
    let jsonData = [];

    fw.utility.forEach(corrispondenze,(corrispondenza) => {
      jsonData.push(JSON.parse(JSON.stringify(corrispondenza)));
		}, () => {
			callback(jsonData);
		});
  });
}

module.exports.getTopics = (fw, callback) => {
  fw.queryDB("selectTopicsName",["fiscal","action"], (topicList) => {
    let jsonData = [];

    fw.utility.forEach(topicList, (topicData) => {
      let data = JSON.parse(JSON.stringify(topicData))
      data.name = data.name.replaceAll("_", " ");

      jsonData.push(data);
		}, () => {
			callback(jsonData);
		});
  });
}

module.exports.getMachineTopics = (fw,data ,utente, callback) => {
  fw.queryDB("selectMachineTopics",[data.id,data.model,utente.id], (nameList) => {
    let jsonData = [];

    fw.utility.forEach(nameList, (topicData) => {
      let topicN = JSON.parse(JSON.stringify(topicData))
      topicN.name = topicN.name.replaceAll("_", " ");

      jsonData.push(topicN);
		}, () => {
			callback(jsonData);
		});
  });
}

module.exports.getMachinePureTopics = (fw, data, utente, callback) => {
  fw.queryDB("selectMachineTopics",[data.id,data.model,utente.id], (list) => {
    let jsonData = [];

    fw.utility.forEach(list, (topicData) => {
      let topicN = JSON.parse(JSON.stringify(topicData))

      jsonData.push(topicN);
		}, () => {
			callback(jsonData);
		});
  });
}

module.exports.getProfile = (fw, utente,callback) => {
  let profile = {};

  profile.name = utente.name;
  profile.surname = utente.surname;
  profile.email = utente.email;
  profile.birthday = fw.utility.formatDate(utente.birthday);
  profile.Birthday = utente.birthday;

  callback(profile);
}

module.exports.getProfilePicture = (fw, utente, callback) => {
  let image;

  fw.queryDB("selectProfilePictureRoot",[utente.id], (results) => {
    if (results[0]) {
      image = path.join(__dirname, ".." , ".." , "ProfilePictures", results[0].pictureroot.toString() + ".png");
      callback(image);
    }
    else {
      callback(404);
    }
  });
}
