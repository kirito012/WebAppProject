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
        var nameDevice = document.querySelector(".nameData span");
        var idDevice = document.querySelector(".badgeNumberData span");
        var dev;
        var index;

        var array = {};

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
                    index = obj.selected;
                    if($scope.selected == undefined){
                        sel.innerHTML = "Selezionare un dispositivo dal menù";
                    }else{
                        sel.innerHTML = "Modello: " + dev[$scope.selected].model
                        nameDevice.innerHTML = dev[$scope.selected].customname;
                        idDevice.innerHTML = dev[$scope.selected].uniqueid;
                        array = {model: dev[$scope.selected].model, id: dev[$scope.selected].uniqueid, topics: ["f", "j", "h", "g"]};
                        $http.post("/subscribe", JSON.stringify(array)).then(function mySuccess(response){
                            if(response.data){
                                console.log(response.data);
                            }
                        }, function myError(response) {
                            
                        });
                    }
                }
                $scope.resetChoice = function(){
                    $scope.selected = undefined;
                    if($scope.selected == undefined){
                        sel.innerHTML = "Selezionare un dispositivo dal menù";
                        nameDevice.innerHTML = "";
                        idDevice.innerHTML = "";
                    }
                }
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