let mqtt = require("mqtt");
var child_process = require('child_process');
let Functions = require("./utility");

let client;
let usersTopics = {};

module.exports.usersTopics = usersTopics;

module.exports.connectToNewTopic = (model, id, topics, user) => {
  usersTopics[user] = { model: model, id: id, data: {}, subbedTopics: topics };

  usersTopics[user].subbedTopics.forEach((element) => {
    let topic = `${model}/${id}/${element}`;

    client.subscribe([topic], () => {
      console.log(`${user} subscribed to topic '${topic}'`);
    });
  });
}

module.exports.disconnectFromTopic = (user) => {
  let model = usersTopics[user].model;
  let id = usersTopics[user].id;

  usersTopics[user].subbedTopics.forEach((element) => {
    let topic = `${model}/${id}/${element}`;

    client.unsubscribe([topic], () => {
      console.log(`${user} unsubscribed to topic '${topic}'`);
    });
  });

  usersTopics[user] = undefined;
}

module.exports.Connect = (connectUrl) => {
    client = mqtt.connect(connectUrl, {
        clientId: Functions.generateRandomKey(),
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
        usersTopics.forEach((user) => {
          let model = user.model;
          let id = user.id;
      
          usersTopics[user].subbedTopics.forEach((element) => {
            let topicBuild = `${model}/${id}/${element}`;
          });
        });
    });

    return client;
}

module.exports.startBroker = () => {
    child_process.exec('../broker.bat', function(error, stdout, stderr) {
        console.log(stdout);
    });
}

