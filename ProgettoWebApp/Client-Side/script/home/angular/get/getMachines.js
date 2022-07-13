let dev;

export let getMachines = ($scope, $http, devices) => {
    $http({
        method : "GET",
        url : "/home/getMachines"
    }).then(function mySuccess(response) {
        dev = response.data;
        devices.response.data;
    }, function myError(response) {
        console.log(response);
    });
}