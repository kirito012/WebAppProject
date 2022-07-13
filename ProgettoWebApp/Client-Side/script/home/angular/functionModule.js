import {app} from "./main";

let inputValue = document.querySelector("#inputSearch");
let clicked = false;

app.controller('myCtrlDevice', function($scope, $http, $timeout) {
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