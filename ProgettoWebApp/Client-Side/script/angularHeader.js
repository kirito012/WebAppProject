var inputValue = document.querySelector("#inputSearch");
        var clicked = false;

        let app = angular.module('myApp', []);
        app.controller('myCtrl', function($scope, $http) {
            $http({
                method : "GET",
                url : "/home/getModels"
            }).then(function mySuccess(response) {
                $scope.models = response.data;
                $scope.myFunction = function(index){
                    clicked = false;
                    inputValue.value = index;
                }
                $scope.disable = function(){
                    clicked = true;
                }
                $scope.mouseOut = function(){
                    if(!clicked){
                        inputValue.value = '';
                    }
                }
            }, function myError(response) {
                
            });
        });

        app.controller('myCtrlDevice', function($scope, $http) {
            $scope.get = function(){
                $http({
                    method : "GET",
                    url : "/home/getMachines"
                }).then(function mySuccess(response) {
                    $scope.devices = response.data;
                }, function myError(response) {
                    
                });
            }
            window.onload = $scope.get();debugger
        });

        app.controller('postController', function($scope, $http) {
            var array = {model: "modello", id: "id", topics: ["f", "j", "h", "g"]};
            $http.post("/home/subscribe", JSON.stringify(array)).then(function mySuccess(response){
                if(response.data){
                    console.log(response.data);
                }
            }, function myError(response) {
                
            });
        });