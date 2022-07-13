let dev;

export let getMachines = ($scope, $http) => {
    $http({
        method : "GET",
        url : "/home/getMachines"
    }).then(function mySuccess(response) {
        dev = response.data;
        $scope.devices = dev;
    }, function myError(response) {
        console.log(response);
    });
}