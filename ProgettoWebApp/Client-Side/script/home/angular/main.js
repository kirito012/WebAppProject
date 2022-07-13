import {getModels} from "./get/getModels.js";
import {getMachines} from "./get/getMachines.js";
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


const app = angular.module('myApp', []);

app.controller('myController', function($scope, $http, $timeout) {
    getModels($scope, $http);
    getMachines($scope, $http);
    getProfile($scope, $http);

    button.addEventListener("click", changeProfileData($scope, $http));

    formProfile.addEventListener("submit", () => {
        getNewPfp($scope, $http);
        formProfile.querySelector(".fileInput").value = "";
    });

    formMachines.addEventListener("submit", getMachines($scope, $http));
    

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

document.forms["formMachine"].addEventListener("submit", (event) => {
    event.preventDefault();
    const resp = fetch(event.target.action, {
      method: "POST",
      body: new URLSearchParams(new FormData(event.target)),
    }).then((response) => {
        const body = response.json();
        console.log(response.json());
    });
  });