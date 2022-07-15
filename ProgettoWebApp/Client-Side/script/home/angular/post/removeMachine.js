export let removeMachine = ($scope, $http, callback) => {
    deviceToRemove = {};
    $http.post("/removeMachine", JSON.stringify(deviceToRemove)).then(function mySuccess(response){
        if(response.data){
            if(callback){
                callback($scope, reponse.data);
            }
        }
    }, function myError(response) {
        console.log(response);
    });
}