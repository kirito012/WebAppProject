let mqtt = require("mqtt");
let utility = require("./utility");

let usersTopics = {};
let user = {};
let matricola = {};

let client = mqtt.connect("mqtt://localhost:1883", {
  clientId: utility.generateRandomKey(),
  clean: true,
  connectTimeout: 1000 * 60 * 60 * 24,
  username: "User1",
  password: "Olivetti",
  reconnectPeriod: 1000,
});

//cashregister/form100/80E10008038/fiscal/heartbeat
//cashregister/form100/80E10002884/fiscal/heartbeat

client.on("message", (topic, payload) => {
  let splitted = topic.split("/");
  let head = splitted[splitted.length - 1];
  let matricola_id = splitted[2];

  if(usersTopics[head + matricola_id]) {
    for (let i in usersTopics[head + matricola_id].subscribedUsers) {
      let userId = usersTopics[head + matricola_id].subscribedUsers[i];
      if (user[userId]){
        if (matricola[user[userId].selectedMatricola]) {
          if (matricola[user[userId].selectedMatricola].id == matricola_id) {
            user[userId].data[head] = payload.toString();
          }
        }
      }
    }
  }
});

client.on("connect", () => {
  console.log("Connected to the broker!");
});

module.exports.newMatricola = (id,name,parentId,parentName) => {
  if (user[parentId]) {
    user[parentId].selectedMatricola = id;

    if (!matricola[id]){
      matricola[id] = {};
  
      matricola[id].id = id;
      matricola[id].name = name;
    }
  }
  else {
    user[parentId] = {};
    
    user[parentId].id = parentId;
    user[parentId].name = parentName;
    user[parentId].selectedMatricola = id;
    user[parentId].data = {};

    if (!matricola[id]){
      matricola[id] = {};
  
      matricola[id].id = id;
      matricola[id].name = name;
    }
  }
}

module.exports.getMachineData = (userId,callback) => {
  if (user[userId]) {
    callback(user[userId].data);
  }
};

module.exports.clearMachineData = (userId,callback) => {
  if (user[userId]) {
    user[userId].data = {};
    callback();
  }
};


module.exports.connectToNewTopic = (userId,topicName,topicString) => {
  let currentUser = user[userId];
  let splitted = topicString.split("/");
  let matricola_id = splitted[2];

  if (currentUser) {
    if (usersTopics[topicName + matricola_id]){
      if(usersTopics[topicName + matricola_id].subscribedUsers.indexOf(userId) >= 0){
        return
      }
      else {
        usersTopics[topicName + matricola_id].subscribedUsers.push(userId);
      }
    }
    else{
      usersTopics[topicName + matricola_id] = {};

      usersTopics[topicName + matricola_id].name = topicName;
      usersTopics[topicName + matricola_id].subscribedUsers = [userId];

      let topicStr = topicString.split("/");
      topicStr[1] = topicStr[1].replace(/\s/g, '');
      topicStr[1] = topicStr[1].toLowerCase();
      topicStr = topicStr.join("/");
      usersTopics[topicName + matricola_id].topicString = topicStr;

      client.subscribe(usersTopics[topicName + matricola_id].topicString);
    }
  }
  else {
    console.log("mqtt user not found");
  }
}

module.exports.disconnectFromTopic = (userId,topicName,topicString) => {
  let currentUser = user[userId];
  let splitted = topicString.split("/");
  let matricola_id = splitted[2];

  if (currentUser) {
    if (usersTopics[topicName + matricola_id]){
      let index = usersTopics[topicName + matricola_id].subscribedUsers.indexOf(userId);

      if (index > -1) {
        usersTopics[topicName + matricola_id].subscribedUsers.splice(index, 1);
      }

      if (usersTopics[topicName + matricola_id].length <= 0) {
        client.unsubscribe(usersTopics[topicName + matricola_id].topicString);
        usersTopics[topicName + matricola_id] = undefined;
      }
    }
    else{
      console.log("mqtt topic not found");
    }
  }
  else {
    console.log("mqtt user not found");
  }
}