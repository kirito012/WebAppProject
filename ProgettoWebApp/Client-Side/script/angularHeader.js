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

        var sel = document.querySelector(".selector");
        var dev;

        app.controller('myCtrlDevice', function($scope, $http) {
                $http({
                    method : "GET",
                    url : "/home/getMachines"
                }).then(function mySuccess(response) {
                    $scope.devices = response.data;
                    dev = response.data;
                }, function myError(response) {
                    
                });
                $scope.selected = undefined;
                $scope.selection = function(obj){
                    $scope.selected = obj.$index;
                    if($scope.selected == undefined){
                        sel.innerHTML = "Selezionare un dispositivo dal menù";
                    }else{
                        sel.innerHTML = "Nome: " + dev[$scope.selected].customname;
                    }
                }
                $scope.resetChoice = function(){
                    $scope.selected = undefined;
                    if($scope.selected == undefined){
                        sel.innerHTML = "Selezionare un dispositivo dal menù";
                    }
                }
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


        app.controller('removeDevice', function($scope, $http){
            var deviceToRemove = {badgeNumber: $scope.devices[$scope.selected]};
            $scope.remove = function(){
                $http.post("/home/removeMachine", JSON.stringify(deviceToRemove)).then(function mySuccess(response){
                    if(response.data){
                        console.log(response.data);
                    }
                }, function myError(response) {
                    
                });
            }
        });