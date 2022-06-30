let app = angular.module('myApp', []);
        app.controller('myCtrl', function($scope, $http) {
            $http({
                method : "GET",
                url : "/home/getModels"
            }).then(function mySuccess(response) {
                $scope.models = response.data;
            }, function myError(response) {
                
            });
        });

        app.controller('myCtrlDevice', function($scope, $http) {
            $http({
                method : "GET",
                url : "/home/getMachines"
            }).then(function mySuccess(response) {
                var devices = response.data;
              }, function myError(response) {
                
            });
           
            var array = {model: "modello", id: "id", topics: ["f", "j", "h", "g"]};


            $http.post("/home/subscribe", JSON.stringify(array)).then(function mySuccess(response){
                if(response.data){
                    console.log(response.data);
                }
            }, function myError(response) {
                
            });
        });