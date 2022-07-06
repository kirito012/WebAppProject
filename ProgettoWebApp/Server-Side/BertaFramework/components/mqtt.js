let mqtt = require("mqtt");
let utility = require("./utility");

let usersTopics = {};

module.exports.usersTopics = () => {return usersTopics};

module.exports.connectToNewTopic = (client, model, id, topics, user) => {
  usersTopics[user] = { model: model, id: id, data: {}, subbedTopics: topics };
  
  utility.forEach(usersTopics[user].subbedTopics,(element,key) => {
    let topic = `${model}/${id}/${key}`;

    client.subscribe([topic], () => {
      console.log(`${user} subscribed to topic '${topic}'`);
	  });
  });
}

module.exports.disconnectFromTopic = (client ,user) => {
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

module.exports.connectToBroker= (connectUrl) => {
  let client = mqtt.connect(connectUrl, {
    clientId: utility.generateRandomKey(),
    clean: true,
    connectTimeout: 4000,
    username: "User1",
    password: "Olivetti",
    reconnectPeriod: 1000,
  });

  client.on("message", (topic, payload) => {
    utility.forEach(usersTopics, (user) => {
      let builtTopic = topic.split("/");

      if (user.subbedTopics[builtTopic[builtTopic.length - 1]]) {
        user.data[builtTopic[builtTopic.length - 1]] = payload.toString();
      }
    });
  });

  client.on("connect", () => {
    console.log("Connected to the broker!");
    return client;
  });
};