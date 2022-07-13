        var deviceToRemove = {};

        var remove = true;

        var search;
        var badgeNumber;
        var nameCustom;
        
        var device;




        /*let app = angular.module('myApp', []);

        app.controller('myCtrlDevice', function($scope, $http, $timeout) {

                /*
                setInterval(function () {
                    $http({
                        method : "GET",
                        url : "/home/getData"
                    }).then(function mySuccess(response) {
                        console.log(response.data);
                    }, function myError(response) {
                        console.log(response);
                    });
                }, 3000);
                
                  
                $scope.selected = undefined;
                $scope.selection = function(obj){
                    $scope.selected = obj.$index;    
                    index = obj.selected;
                        if($scope.selected == undefined){        
                            sel.innerHTML = "Selezionare un dispositivo dal menù";        
                            }else{    
                                $timeout(function(){       
                                    if(remove){    
                                        array = {model: dev[$scope.selected].model, id: dev[$scope.selected].uniqueid, topics: {h: true, f: false, d: false, r: false}};    
                                        $http.post("/subscribe", JSON.stringify(array)).then(function mySuccess(response){    
                                            if(response.data){    
                                               
                                            }
                                        }, function myError(response) {    
                                            console.log(response);
                                        });
                                    }
                                }, 200);
                            }
                        }         

                $scope.resetChoice = function(){
                    $scope.selected = undefined;
                    if($scope.selected == undefined){
                        array = {model: "", id: "", topics: {}};
                        $http.post("/subscribe", JSON.stringify(array)).then(function mySuccess(response){
                            if(response.data){
                                console.log(response.data);
                            }
                        }, function myError(response) {
                            console.log(response);
                        });
                    }
                }

                */


                /*
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
                                    console.log(response);
                                });
                            }
                        }, function myError(response) {
                            console.log(response);
                        });
                        $timeout(function(){
                            remove = true;
                        }, 500);
                    }, 100);
                }
                
        });*/

