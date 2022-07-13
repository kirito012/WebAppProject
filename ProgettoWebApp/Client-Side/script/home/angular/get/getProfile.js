export let getProfile = ($scope, $http) =>{
    $http({
        method : "GET",
        url : "/home/getProfile"
    }).then(function mySuccess(response) {
        $scope.profileData = response.data;
        $scope.name = $scope.profileData.name;
        $scope.surname = $scope.profileData.surname;
        $scope.email = $scope.profileData.email;
        $scope.birthday = new Date($scope.profileData.Birthday);
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