import {getMachines} from "../get/getMachines.js";

let newMachine = {};

let model, id, customname;

let permitted = false;

export let addMachine = ($scope, $http) => {
    if(permitted){
        model = document.querySelector(".input.model").value;
        id = document.querySelector(".input.id").value;
        customname = document.querySelector(".input.name").value;
        newMachine = {model: model, id: id, customname: customname};
        $http.post("/addMachine", JSON.stringify(newMachine)).then(function mySuccess(response){    
            if(response.data){    
                getMachines($scope, $http);
            }
        }, function myError(response) {    
            console.log(response);
        });
    }
}