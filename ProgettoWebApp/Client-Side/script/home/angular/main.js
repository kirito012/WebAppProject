import {getModels} from "./get/getModels.js";
import {getMachines, refreshMachine} from "./get/getMachines.js";
import {getProfile, changeProfileData, getNewPfp} from "./get/getProfile.js"
   
/* profile chages */

let formProfile = document.querySelector(".form");

/*    */

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

    getProfile($scope, $http);

    refreshMachine($scope, ($newScope, data) => {
        $timeout(() => {
            $newScope.devices = data;
        }, 0);
    });;

    changeProfileData($scope, $http);

    formProfile.addEventListener("submit", () => {
        getNewPfp($scope, $http);
        formProfile.querySelector(".fileInput").value = "";
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