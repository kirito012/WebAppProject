        let fileReader = new FileReader();
        let pfp = document.querySelector(".pfp");
        
        
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


        var deviceToRemove = {};

        var remove = true;

        var search;
        var badgeNumber;
        var nameCustom;
        
        var newMachine = {};

        var responseData;

        var device;

        let button = document.querySelector(".submitValues");

        let email;
        let newName;
        let surname;
        let birthday;

        let newData = {};

        let profilepicture;
        
        var formdata;

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



                formdata = new FormData(document.querySelector(".form"));


                $scope.uploadFile = () => {
                    formdata.append("profilepicture", document.querySelector(".fileInput").value);
                    console.log(formdata);
                    /*$http.post("/uploadpfp", formdata).then(function mySuccess(response){    
                        if(response.data){    
                            console.log("dd");
                        }
                    }, function myError(response) {    
                            console.log(response);
                    });*/
                }


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
                */
        });

