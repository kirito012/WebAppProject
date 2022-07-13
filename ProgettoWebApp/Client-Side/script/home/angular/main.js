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

app.controller('myController', function($rootScope, $http, ) {
    getModels($rootScope, $http);
    getMachines($rootScope, $http, (device) => {
        $rootScope.devices = device;
        $rootScope.$digest();
    });
    getProfile($rootScope, $http);
    refreshMachine($rootScope, ($newrootScope, data) => {
        $newrootScope.devices = data;
        $rootScope.$digest();
    });;



    button.addEventListener("click", changeProfileData($rootScope, $http));

    formProfile.addEventListener("submit", () => {
        getNewPfp($rootScope, $http);
        formProfile.querySelector(".fileInput").value = "";
    });
    
    

    $rootScope.myFunction = function(index){
        clicked = false;
        inputValue.value = index;
    }
    $rootScope.disable = function(){
        clicked = true;
    }
    $rootScope.mouseOut = function(){
        if(!clicked){
            inputValue.value = '';
        }
    }

});