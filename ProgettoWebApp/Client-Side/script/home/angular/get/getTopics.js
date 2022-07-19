export let getTopics = ($scope, $http, callback) => {
    $http({
        method : "GET",
        url : "/home/getTopics"
    }).then(function mySuccess(response) {
        $scope.topics = response.data;
        if(callback){
            callback(response.data);
        }
    }, function myError(response) {
        console.log(response);
    });
}