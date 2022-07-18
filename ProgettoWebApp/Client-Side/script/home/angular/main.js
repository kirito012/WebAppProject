import {getModels} from "./get/getModels.js";
import {getMachines, refreshMachine} from "./get/getMachines.js";
import {getProfile, getNewPfp} from "./get/getProfile.js"
import {refreshProfileData} from "./post/changePersonal.js";
import {removeMachine, emptyPost} from "./post/removeMachine.js";



let inputValue = document.querySelector("#inputSearch");
let clicked = false;

let devicesList;
export let index;

let infos = document.querySelectorAll(".infoBottom span");

let app = angular.module('myApp', []);

app.controller('myController', function($scope, $http, $timeout) {
    getModels($scope, $http);

    getMachines($scope, $http, (device) => {
        $timeout(() => {
            $scope.devices = device;
            devicesList = $scope.devices;
        }, 0);
    });

    refreshMachine($scope, ($newScope, data) => {
        $timeout(() => {
            $newScope.devices = data;
        }, 0);
    });;

    getProfile($scope, $http, ($scope, data) => {
        $timeout(() => {
            $scope.profileData = data;
            $scope.name = data.name;
            $scope.surname = data.surname;
            $scope.email = data.email;
            $scope.birthday = new Date(data.Birthday);
        }, 0);
    });

    refreshProfileData($scope, ($scope, data) => {
        $timeout(() => {
            console.log(data);
            $scope.profileData = data;
            $scope.name = data.name;
            $scope.surname = data.surname;
            $scope.email = data.email;
            $scope.birthday = new Date(data.Birthday);
        }, 0);
    })

    getNewPfp($scope, $http);




    $scope.selected = ($index) => {
        index = $index;
        devicesList = $scope.devices;
        document.querySelectorAll(".device").forEach((element) => {
            element.classList.remove("active");
        })
        document.querySelectorAll(".device")[index].classList.add("active");
        infos[0].innerHTML = devicesList[index].customname;
        infos[1].innerHTML = devicesList[index].model;
        infos[2].innerHTML = devicesList[index].uniqueid;
        removeMachine($scope, $http, index, devicesList, ($scope, device) => {
            $timeout(() => {
                $scope.devices = device;
            }, 0);
        });
    }    
 
    $scope.removeSelection = () => {
        index = undefined;
        document.querySelectorAll(".device").forEach((element) => {
            element.classList.remove("active");
        })
        infos[0].innerHTML = "";
        infos[1].innerHTML = "";
        infos[2].innerHTML = "";
        emptyPost($scope, $http, () => {

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

});