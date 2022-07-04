        var inputValue = document.querySelector("#inputSearch");
        var clicked = false;


        var sel = document.querySelector(".selector");
        var nameDevice = document.querySelector(".nameData span");
        var idDevice = document.querySelector(".badgeNumberData span");
        var dev;
        var index;

        var array = {};

        var deviceToRemove = {};

        var remove = true;

        var search;
        var badgeNumber;
        var nameCustom;
        
        var newMachine = {};


        let app = angular.module('myApp', []);
        app.controller('myCtrlDevice', function($scope, $http, $timeout) {
                $http({
                    method : "GET",
                    url : "/home/getMachines"
                }).then(function mySuccess(response) {
                    dev = response.data;
                    $scope.devices = dev;
                }, function myError(response) {
                    
                });

                $http({
                    method : "GET",
                    url : "/home/getModels"
                }).then(function mySuccess(response) {
                    $scope.models = response.data;
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
                                    $timeout(function(){
                                        if(remove){
                                            array = {model: dev[$scope.selected].model, id: dev[$scope.selected].uniqueid, topics: ["f", "j", "h", "g"]};
                                            $http.post("/subscribe", JSON.stringify(array)).then(function mySuccess(response){
                                                if(response.data){
                                                    console.log(response.data);
                                                }
                                            }, function myError(response) {
                                                
                                            });
                                        }
                                    }, 200);
                                }
                            }

                $scope.resetChoice = function(){
                    $scope.selected = undefined;
                    if($scope.selected == undefined){
                        sel.innerHTML = "Selezionare un dispositivo dal menù";
                        nameDevice.innerHTML = "";
                        idDevice.innerHTML = "";
                        array = {model: "", id: "", topics: []};
                        $http.post("/subscribe", JSON.stringify(array)).then(function mySuccess(response){
                            if(response.data){
                                console.log(response.data);
                            }
                        }, function myError(response) {
                                                    
                        });
                    }
                }

        $scope.addMachine = function(){
            badgeNumber = document.querySelector(".numeroMatricola").value;
            nameCustom = document.querySelector(".nomePersonalizzato").value;
            model = document.querySelector(".modello").value;
            newMachine = {search: model, name: nameCustom, badgeNumber: badgeNumber};
            $http.post("/addMachine", JSON.stringify(newMachine)).then(function mySuccess(response){
                if(response.data){
                    $http({
                        method : "GET",
                        url : "/home/getMachines"
                    }).then(function mySuccess(response) {
                        dev = response.data;
                        $scope.devices = dev;
                    }, function myError(response) {
                        
                    });
                }
            }, function myError(response) {
                                         
            });
        }

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

        $scope.remove = function(){
            $timeout(function(){
                remove = false;
                deviceToRemove = {badgeNumber: dev[$scope.selected].uniqueid};
                $http.post("/removeMachine", JSON.stringify(deviceToRemove)).then(function mySuccess(response){
                    if(response.data){
                        $http({
                            method : "GET",
                            url : "/home/getMachines"
                        }).then(function mySuccess(response) {
                            dev = response.data;
                            $scope.devices = dev;
                        }, function myError(response) {
                            
                        });
                    }
                }, function myError(response) {
                    
                });
                $timeout(function(){
                    remove = true;
                }, 500);
            }, 100);
        }

    });
