let mqtt = require("mqtt");
let utility = require("./utility");

let usersTopics = {};
let user = {};
let matricola = {};

let client = mqtt.connect("mqtt://localhost:1883", {
  clientId: utility.generateRandomKey(),
  clean: true,
  connectTimeout: 4000,
  username: "User1",
  password: "Olivetti",
  reconnectPeriod: 1000,
});

module.exports.newMatricola = (id,name,parentId,parentName) => {
  matricola[id] = {};

  matricola[id].id = id;
  matricola[id].name = name;
  matricola[id].parentId = parentId;
  matricola[id].parentName = parentName;
  matricola[id].data = {};

  if (user[parentId]) {
    user[parentId].selectedMatricola = id;
  }
  else {
    user[parentId] = {};
    
    user[parentId].id = parentId;
    user[parentId].name = parentName;
    user[parentId].selectedMatricola = id;
  }
}

module.exports.usersTopics = () => {return usersTopics};

module.exports.connectToNewTopic = (userId,topicName,topicString) => {
  let currentUser = user[userId];

  if (currentUser) {
    if (usersTopics[topicName]){
      usersTopics[topicName].subscribedUsers.push(userId);
    }
    else{
      usersTopics[topicName] = {};

      usersTopics[topicName].name = topicName;
      usersTopics[topicName].topicString = topicString.trim();
      usersTopics[topicName].subscribedUsers = [userId];

      client.subscribe(usersTopics[topicName].topicString);
    }
  }
  else {
    console.log("mqtt user not found");
  }
}

module.exports.disconnectFromTopic = (userId,topicName) => {
  let currentUser = user[userId];

  if (currentUser) {
    if (usersTopics[topicName]){
      let index = usersTopics[topicName].subscribedUsers.indexOf(userId);

      if (index > -1) {
        usersTopics[topicName].subscribedUsers.splice(index, 1);
      }

      if (usersTopics[topicName].length <= 0) {
        client.unsubscribe(usersTopics[topicName].topicString);
        usersTopics[topicName] = undefined;
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

module.exports.connectToBroker = (connectUrl) => {
  client = mqtt.connect(connectUrl, {
    clientId: utility.generateRandomKey(),
    clean: true,
    connectTimeout: 4000,
    username: "User1",
    password: "Olivetti",
    reconnectPeriod: 1000,
  });

  client.on("message", (topic, payload) => {
    let splitted = topic.split("/");
    let head = splitted[splitted.length - 1];

    console.log(topic);
    console.log(payload);

    if(usersTopics[head]) {
      usersTopics[head].subscribedUsers.foreach((userId) => {
        if (user[userId]){
          if (matricola[user[userId].selectedMatricola]) {
            matricola[user[userId].selectedMatricola].data[head] = payload;
            console.log(matricola);
          }
        }
      })
    }
  });

  client.on("connect", () => {
    console.log("Connected to the broker!");
    return client;
  });
};