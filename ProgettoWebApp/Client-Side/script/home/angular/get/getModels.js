export let getModels = ($scope, $http) => {
	$http({
		method: "GET",
		url: "/home/getModels"
	}).then(function mySuccess(response) {
		$scope.models = response.data;
	}, function myError(response) {
		console.log(response);
	});
}