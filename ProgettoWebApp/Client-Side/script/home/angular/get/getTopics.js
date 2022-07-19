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


export let activeTopics = ($scope, $http, device, index, callback) => {
    let deviceSelected = {id: device[index].uniqueid, model: device[index].model};
    $http({
        method : "POST",
        url : "/getMachineTopics",
        data: JSON.stringify(deviceSelected)
    }).then(function mySuccess(response) {
        console.log(response.data);
        if(callback){
            callback($scope, response.data);
        }
    }, function myError(response) {
        console.log(response);
    });
}