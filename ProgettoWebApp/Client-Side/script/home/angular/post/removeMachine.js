let removeButton = document.querySelector(".confirmRemove");
let deviceToRemove = {};

import { alert } from "../../script.js";

export let removeMachine = ($scope, $http, i, device, callback) => {
	removeButton.onclick = () => {
		deviceToRemove = { id: device[i].uniqueid };
		$http.post("/removeMachine", JSON.stringify(deviceToRemove)).then(function mySuccess(response) {
			if (callback) {
				console.log(response.data);
				callback($scope, response.data);
				alert.classList.remove("active");
			}
		}, function myError(response) {
			console.log(response);
		});
	}
}


export let emptyPost = ($scope, $http, topics, callback) => {
	let empty = { oldTopics: topics };
	$http.post("/removeMachine", JSON.stringify(empty)).then(function mySuccess(response) {
		if (callback) {
			callback($scope, response.data);
		}
	}, function myError(response) {
		console.log(response);
	});
}