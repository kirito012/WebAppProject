export let activeTopics = ($scope, $http, device, index, callback) => {
    let deviceSelected = {id: device[index].uniqueid, model: device[index].model};
    $http({
        method : "POST",
        url : "/getMachineTopics",
        data: JSON.stringify(deviceSelected)
    }).then(function mySuccess(response) {
        if(callback){
            callback($scope, response.data);
        }
    }, function myError(response) {
        console.log(response);
    });
}