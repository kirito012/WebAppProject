export let getAlert = ($scope, $http, device, index, callback) => {
	let info = { matricola_id: device[index].uniqueid };
	$http.post("/getWarnings", JSON.stringify(info)).then(function mySuccess(response) {
		if (callback) {
			callback($scope, response.data);
		}
	}, function myError(response) {
		console.log(response);
	});
}


export let removeAlert = ($scope, $http, device, index, topic, time, error, callback) => {
	let newInfo = { matricola_id: device[index].uniqueid, name: topic, timestamp: time, errorId: error };
	$http.post("/deleteWarnings", JSON.stringify(newInfo)).then(function mySuccess(response) {
		if (callback) {
			callback($scope, response.data);
		}
	}, function myError(response) {
		console.log(response);
	});
}