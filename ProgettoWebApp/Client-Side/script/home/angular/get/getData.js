export let getData = ($scope, $http, callback) => {
    $http({
        method : "GET",
        url : "/home/getData"
    }).then(function mySuccess(response) {
        if(callback){
            callback($scope, response.data);
        }
    }, function myError(response) {
        console.log(response);
    });
}