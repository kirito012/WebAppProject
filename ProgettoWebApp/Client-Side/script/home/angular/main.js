import {getModels} from "./get/getModels.js";
import {getMachines, refreshMachine} from "./get/getMachines.js";
import {getProfile, getNewPfp} from "./get/getProfile.js"
import {changeProfileData, refreshProfileData} from "./post/changePersonal.js";
   
/* profile chages */


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

    refreshProfileData($scope, ($newScope, data) => {
        $newScope.profileData = response.data;
        $newScope.name = $scope.profileData.name;
        $newScope.surname = $scope.profileData.surname;
        $newScope.email = $scope.profileData.email;
    })

    getNewPfp($scope, $http);
    
    

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