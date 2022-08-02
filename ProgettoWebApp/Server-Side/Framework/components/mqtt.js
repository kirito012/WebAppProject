let mqtt = require("mqtt");
let utility = require("./utility");

let usersTopics = {};
let user = {};
let matricola = {};

let client = mqtt.connect("mqtt://localhost:1883", {
  clientId: utility.generateRandomKey(),
  protocolVersion: 5,
  clean: true,
  connectTimeout: 1000 * 60 * 60 * 24,
  username: "User1",
  password: "Olivetti",
  reconnectPeriod: 1000,
  properties: {
    requestResponseInformation: true,
    requestProblemInformation: true,
  },
  will: {
    topic: "will/message",
    payload: "we died",
    qos: 0,
    retain: false,
  },
});

module.exports.getMqttVariables = getMqttVariables = (topic,callback) => {
  let splitted = topic.split("/");
  let head = splitted[splitted.length - 1];
  let matricola_id = splitted[2];

  callback(head,matricola_id);
}

module.exports.fixTopicString = fixTopicString = (topic,callback) => {
  let topicStr = topic.split("/");
  if ( topicStr.length >= 4) {
    topicStr[1] = topicStr[1].replace(/\s/g, '');
    topicStr[1] = topicStr[1].toLowerCase();
    topicStr = topicStr.join("/");

    callback(topicStr);
  }
  else{
    callback(topic);
  }
}



//cashregister/form100/80E10008038/fiscal/heartbeat
//cashregister/form100/80E10002884/fiscal/heartbeat

client.on("message", (topic, payload) => {
  getMqttVariables(topic, (head,matricola_id) => {
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
});

client.on("connect", () => {
  console.log("Connected to the broker!");
});

module.exports.getClient = (callback) => {
  callback(client);
}

module.exports.newMatricola = (id,name,parentId,parentName,callback) => {
  if (user[parentId]) {
    user[parentId].selectedMatricola = id;

    if (!matricola[id]){
      matricola[id] = {};
  
      matricola[id].id = id;
      matricola[id].name = name;
      matricola[id].defaultTopic = "cashregister/" + name + "/" + id + "/fiscal";

      if (callback) {
        callback();
      }
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
      matricola[id].defaultTopic = "cashregister/" + name.replace(" ", '').toLowerCase() + "/" + id + "/fiscal";
    
      if (callback) {
        callback();
      }
    }
    else{
      if (callback) {
        callback();
      }
    }
  }
}

module.exports.getMachineData = (userId,callback) => {
  if (user[userId]) {
    callback(user[userId].data);
  }
};

module.exports.getTopicString = (topicName,userId,callback) => {
  if (user[userId]) {
    callback(matricola[user[userId].selectedMatricola].defaultTopic + topicName);
  }
}

module.exports.getMatricola = (userId, callback) => {
  callback(matricola[user[userId].selectedMatricola]);
}

module.exports.clearMachineData = (userId,callback) => {
  if (user[userId]) {
    delete user[userId].data;
    user[userId].data = {};
    callback();
  }
};


module.exports.connectToNewTopic = (userId,topicName,topicString,callback) => {
  let currentUser = user[userId];
  getMqttVariables(topicString, (head,matricola_id) => {
    if (currentUser) {
      topicName = topicName.replaceAll(" ", "_");
      topicName = topicName.toLowerCase();

      if (usersTopics[topicName + matricola_id]){
        if(usersTopics[topicName + matricola_id].subscribedUsers.indexOf(userId) >= 0){
          if (callback) {
            callback();
          }
          return
        }
        else {
          usersTopics[topicName + matricola_id].subscribedUsers.push(userId);
          if (callback) {
            callback();
          }
        }
      }
      else{
        usersTopics[topicName + matricola_id] = {};
  
        usersTopics[topicName + matricola_id].name = topicName;
        usersTopics[topicName + matricola_id].id = matricola_id
        usersTopics[topicName + matricola_id].subscribedUsers = [userId];
  
        fixTopicString(topicString,(topicStr) => {
          usersTopics[topicName + matricola_id].topicString = topicStr;
  
          client.subscribe(usersTopics[topicName + matricola_id].topicString,{},() => {
            if (callback) {
              callback();
            }
          });
        });
      }
    }
    else {
      //console.log("mqtt user not found");
    }
  });
}

module.exports.getSubbedTopics = (fw,userId,callback) => {
  let returnDict = {};

  fw.utility.foreach(usersTopics, (topic,key) => {
    if (topic.subscribedUsers.includes(userId)) {
      returnDict[key] = topic;
      returnDict[key].builtKey = key
    }
  }, () => {
    if (callback) {
      callback(returnDict);
    }
    else {
      return returnDict;
    }
  });
}

module.exports.disconnectFromTopic = (userId,topicName,topicString) => {
  if (!topicString){return};
  let currentUser = user[userId];
  getMqttVariables(topicString, (head,matricola_id) => {
    if (currentUser) {
      if (usersTopics[topicName + matricola_id]){
        let index = usersTopics[topicName + matricola_id].subscribedUsers.indexOf(userId);
  
        if (index > -1) {
          usersTopics[topicName + matricola_id].subscribedUsers.splice(index, 1);
        }
  
        if (usersTopics[topicName + matricola_id].length <= 0) {
          if (!usersTopics[topicName + matricola_id].topicString.contains("alarm") || !usersTopics[topicName + matricola_id].topicString.contains("warning")){
            client.unsubscribe(usersTopics[topicName + matricola_id].topicString);
            usersTopics[topicName + matricola_id] = undefined;
          }
          else{
            console.log("can't delete an alarm or warning");
          }
        }
      }
      else{
        //console.log("mqtt topic not found");
      }
    }
    else {
      //console.log("mqtt user not found");
    }
  });
}

module.exports.publishToTopic = (topic,msg,responseTopic, retain) => {
  fixTopicString(topic, (topicStr) => {
    fixTopicString(msg, (messageT) => {
      fixTopicString(responseTopic, (responseT) => {
        client.publish(topicStr,messageT,{qos: 0, retain: retain || false, properties: {responseTopic: responseT, correlationData: "test"}})
      });
    });
  });
}