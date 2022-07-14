let button = document.querySelector(".submitValues");

let newData = {};

let email;
let newName;
let surname;
let birthday;

export let changeProfileData = ($scope, $http) => {
    button.addEventListener("click", () => {
        email = document.querySelector(".newI1").value;
        birthday = document.querySelector(".newI2").value;
        newName = document.querySelector(".newI3").value;
        surname = document.querySelector(".newI4").value;
    
        newData = {email: email, birthday: birthday, name: newName, surname: surname};
        $http.post("/changeUserData", JSON.stringify(newData)).then(function mySuccess(response){    
            if(response.data){    
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
        }, function myError(response) {    
                console.log(response);
        });
    });
}

export let refreshProfileData = ($scope, callback) => {
    document.forms["formSettings"].addEventListener("submit", (event) => {
        event.preventDefault();
        const resp = fetch(event.target.action, {
          method: "POST",
          body: new URLSearchParams(new FormData(event.target)),
        }).then((response) => {
            response.json().then((data) => {
                if(callback){
                    callback($scope, data);
                }
            }).catch((err) => {
                console.log(err);
            })
        });
      });
}