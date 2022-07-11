        var inputValue = document.querySelector("#inputSearch");
        var clicked = false;

        var sel = document.querySelector(".selector");
        var nameDevice = document.querySelector(".nameData span");
        var idDevice = document.querySelector(".badgeNumberData span");
        var select = document.querySelector(".select");
        var dev;
        var index;
        
        var deviceSelected = document.querySelector("body");
        var clone;

        var array = {};

        var deviceToRemove = {};

        var remove = true;

        var search;
        var badgeNumber;
        var nameCustom;
        
        var newMachine = {};

        var responseData;

        let app = angular.module('myApp', []);
        app.controller('myCtrlDevice', function($scope, $http, $timeout) {
                $http({
                    method : "GET",
                    url : "/home/getMachines"
                }).then(function mySuccess(response) {
                    dev = response.data;
                    $scope.devices = dev;
                }, function myError(response) {
                    console.log(response);
                });

                $http({
                    method : "GET",
                    url : "/home/getModels"
                }).then(function mySuccess(response) {
                    $scope.models = response.data;
                }, function myError(response) {
                    console.log(response);
                });



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
                                                deviceSelected.classList.remove("active");    
                                                responseData = response.data;
                                                select.innerHTML = "Disositivo selezionato: ";
                                                sel.innerHTML = "Modello: " + responseData.model;        
                                                nameDevice.innerHTML = dev[$scope.selected].customname;       
                                                idDevice.innerHTML = responseData.id;        
                                                deviceSelected = document.querySelector("." + responseData.id);
                                                clone = deviceSelected;
                                                deviceSelected.classList.add("active");
                                                $scope.removeAll();
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
                        select.innerHTML = "Nessun dispositivo selezionato";
                        sel.innerHTML = "Selezionare un dispositivo dal menù";
                        nameDevice.innerHTML = "";
                        idDevice.innerHTML = "";
                        deviceSelected.classList.remove("active");
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
                                console.log(response);
                            });
                        }
                    }, function myError(response) {
                                                
                    });
                }*/

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
                /*
                $scope.remove = function(){
                    $timeout(function(){
                        remove = false;
                        clone.style.background = "red";
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

                $scope.removeAll = function(){
                    header.classList.add("active");
                    toggle.classList.add("active");
                    menu.classList.remove("active");
                    navigation.classList.toggle("active");
                    adding.classList.remove("active");
                    box.style.animationName = "boxRemove";
                    box.classList.remove("active");
                    devices.style.animationName = "boxRemove1";
                    devices.classList.remove("active");
                    devicesToggle.classList.remove("active");
                }*/
        });

