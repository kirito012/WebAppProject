import {getModels} from "./get/getModels.js";
import {getMachines} from "./get/getMachines.js";
import {getProfile, changeProfileData, getNewPfp} from "./get/getProfile.js"


const app = angular.module('myApp', []);

app.controller('myController', function($scope, $http, $timeout) {
    getModels();
    getMachines();
});