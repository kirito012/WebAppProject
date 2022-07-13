
let dev;

export let getMachines = ($scope, $http, callback) => {
    $http({
        method : "GET",
        url : "/home/getMachines"
    }).then(function mySuccess(response) {
        dev = response.data;
        callback(response.data);
    }, function myError(response) {
        console.log(response);
    });
}