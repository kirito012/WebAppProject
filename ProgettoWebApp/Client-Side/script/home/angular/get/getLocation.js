export let getLocation = ($scope, $http, address, callback) => {
    $http({
        method : "GET",
        url : "http://api.positionstack.com/v1/forward?access_key=9be1a4e5e07bd9a7a2c5c75761d9c70c&query=" + address + "&country=IT"
    }).then(function mySuccess(response) {
        if(callback){
            callback($scope, response.data);
        }
    }, function myError(response) {
        console.log(response);
    });
}