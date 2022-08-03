let info = {};
let infoAll = {};

export let historicData = ($scope, $http, topic, dateTime, device, index, page, callback) => {
	info = { timeChoosen: dateTime, topic: topic, id: device[index].uniqueid, limit: undefined, columns: 10, page: page };
	$http.post("/tableData", JSON.stringify(info)).then(function mySuccess(response) {
		if (callback) {
			callback($scope, response.data);
		}
	}, function myError(response) {
		console.log(response);
	});
}

export let historicDataAll = ($scope, $http, topic, dateTime, device, index, callback) => {
	infoAll = { timeChoosen: dateTime, topic: topic, id: device[index].uniqueid, limit: undefined, page: 0};
	$http.post("/tableData", JSON.stringify(infoAll)).then(function mySuccess(response) {
		if (callback) {
			callback($scope, response.data);
		}
	}, function myError(response) {
		console.log(response);
	});
}