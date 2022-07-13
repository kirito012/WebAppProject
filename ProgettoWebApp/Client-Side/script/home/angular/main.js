import {getModels} from "./get/getModels.js";
import {getMachines} from "./get/getMachines.js";
import {getProfile, changeProfileData, getNewPfp} from "./get/getProfile.js"

let button = document.querySelector(".submitValues");
let form = document.querySelector(".form");


const app = angular.module('myApp', []);

app.controller('myController', function($scope, $http, $timeout) {
    getModels();
    getMachines();
    getProfile();

    button.addEventListener("click", () => {
        changeProfileData();
    });

    form.addEventListener("submit", () => {
        getNewPfp();
    });


});