import {getModels} from "./get/getModels.js";
import {getMachines, refreshMachine} from "./get/getMachines.js";
import {getProfile, getNewPfp} from "./get/getProfile.js"
import {refreshProfileData} from "./post/changePersonal.js";
import {removeMachine} from "./post/removeMachine";

import {index} from "../script.js";

let inputValue = document.querySelector("#inputSearch");
let clicked = false;



let app = angular.module('myApp', []);

app.controller('myController', function($scope, $http, $timeout) {
    getModels($scope, $http);

    getMachines($scope, $http, (device) => {
        $timeout(() => {
            $scope.devices = device;
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

    removeMachine($scope, $http, index, $scope.devices, ($scope, device) => {
        $scope.devices = device;
    });
    
    

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