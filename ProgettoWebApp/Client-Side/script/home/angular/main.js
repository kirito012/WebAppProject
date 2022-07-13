import {getModels} from "./get/getModels.js";
import {getMachines} from "./get/getMachines.js";
import {getProfile, changeProfileData, getNewPfp} from "./get/getProfile.js"

let button = document.querySelector(".submitValues");
let form = document.querySelector(".form");


const app = angular.module('myApp', []);

app.controller('myController', function($scope, $http, $timeout) {
    getModels($scope, $http);
    getMachines($scope, $http);
    getProfile($scope, $http);

    button.addEventListener("click", () => {
        changeProfileData($scope, $http);
    });

    form.addEventListener("submit", () => {
        getNewPfp($scope, $http);
    });


});