export let updateTopics = ($scope, $http, id, model, topicName, value, callback) => {
	let info = { topic: topicName, scope: value, id: id, model, model };
	$http.post("/updateTopic", JSON.stringify(info)).then(function mySuccess(response) {
		if (callback) {
			callback($scope);
		}
	}, function myError(response) {
		console.log(response);
	});
}