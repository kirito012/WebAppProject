import {getModels} from "./get/getModels.js";
import {getMachines, refreshMachine} from "./get/getMachines.js";
import {getProfile, changeProfileData, getNewPfp} from "./get/getProfile.js"

/* profile chages */

let button = document.querySelector(".submitValues");
let formProfile = document.querySelector(".form");

/*    */

/* machines changes */

let formMachines = document.querySelector(".formMachine");
let submitAddMachine = document.querySelector(".submitAddMachine");

/*    */

let inputValue = document.querySelector("#inputSearch");
let clicked = false;


let app = angular.module('myApp', []);

app.controller('myController', function($scope, $http) {
    getModels($scope, $http);
    getMachines($scope, $http, (device) => {
        $scope.$apply(() => {
            $scope.devices = device;
        });
    });
    getProfile($scope, $http);
    refreshMachine($scope, ($newScope, data) => {
        $scope.$apply(() => {
            $newScope.devices = data;
        });
    });;



    button.addEventListener("click", changeProfileData($scope, $http));

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