let formProfile = document.querySelector(".form");

export let getProfile = ($scope, $http, callback) =>{
    $http({
        method : "GET",
        url : "/home/getProfile"
    }).then(function mySuccess(response) {
        if(callback){
            callback($scope, response.data);
        }
    }, function myError(response) {
        console.log(response);
    });
}

export let getNewPfp = ($scope, $http) => {
    formProfile.addEventListener("submit", () => {
        $http({
            method : "GET",
            url : "/home/getProfilePicture"
        }).then(function mySuccess(response) {
            if(response.data){
                fun();
                formProfile.querySelector(".fileInput").value = "";
            }
        }, function myError(response) {
            console.log(response);
        });
    });
}

