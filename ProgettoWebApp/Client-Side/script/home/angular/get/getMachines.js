import {devices} from "../main.js";

let dev;

export let getMachines = ($scope, $http) => {
    $http({
        method : "GET",
        url : "/home/getMachines"
    }).then(function mySuccess(response) {
        dev = response.data;
        devices = response.data;
    }, function myError(response) {
        console.log(response);
    });
}