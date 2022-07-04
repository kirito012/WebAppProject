let mqtt = require("mqtt");
var child_process = require('child_process');
let utility = require("./utility");
const e = require("express");

let client;
let usersTopics = {};

module.exports.usersTopics = usersTopics;

module.exports.connectToNewTopic = (model, id, topics, user) => {
  usersTopics[user] = { model: model, id: id, data: {}, subbedTopics: topics };

  utility.forEach(usersTopics[user].subbedTopics,(element,key) => {
    let topic = `${model}/${id}/${key}`;

    client.subscribe([topic], () => {
      console.log(`${user} subscribed to topic '${topic}'`);
    });
  });
}

module.exports.disconnectFromTopic = (user) => {
  let model = usersTopics[user].model;
  let id = usersTopics[user].id;

  utility.forEach(usersTopics[user].subbedTopics,(element,key) => {
    let topic = `${model}/${id}/${key}`;

    client.unsubscribe([topic], () => {
      console.log(`${user} unsubscribed to topic '${topic}'`);
    });
  })

  usersTopics[user] = undefined;
}

module.exports.Connect = (connectUrl) => {
    client = mqtt.connect(connectUrl, {
        clientId: utility.generateRandomKey(),
        clean: true,
        connectTimeout: 4000,
        username: "User1",
        password: "Olivetti",
        reconnectPeriod: 1000,
    });

    client.on("connect", () => {
        console.log("Connected to the broker!");
    });

    client.on("message", (topic, payload) => {
        utility.forEach(usersTopics, (user) => {
          let builtTopic = topic.split("/")

          if (user.subbedTopics[builtTopic[builtTopic.length-1]]) {
            user.data[builtTopic[builtTopic.length-1]] = payload.toString();
            console.log(payload.toString());
          }
        });
    });

    return client;
}

module.exports.startBroker = () => {
    child_process.exec('../broker.bat', function(error, stdout, stderr) {
        console.log(stdout);
    });
}

