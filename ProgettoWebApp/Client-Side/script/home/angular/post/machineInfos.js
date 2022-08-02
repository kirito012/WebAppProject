export let sendInfo = ($scope, $http, device, i, topics, oldTopics, userId, callback) => {
	let info = { model: device[i].model, name: device[i].customname, id: device[i].uniqueid, topics: topics, oldTopics: oldTopics };
	$http.post("/sendInfo", JSON.stringify(info)).then(function mySuccess(response) {
		if (callback) {
			callback($scope, userId);
		}
	}, function myError(response) {
		console.log(response);
	});
}