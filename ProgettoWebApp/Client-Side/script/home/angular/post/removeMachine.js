let removeButton = document.querySelector(".remove.button");

export let removeMachine = ($scope, $http, i, device, callback) => {
    removeButton.addEventListener("click", () => {
        deviceToRemove = {id: device[i].id, name: device[i].customname, model: device[i].model};
        $http.post("/removeMachine", JSON.stringify(deviceToRemove)).then(function mySuccess(response){
            if(response.data){
                if(callback){
                    callback($scope, reponse.data);
                }
            }
        }, function myError(response) {
            console.log(response);
        });
    });
}