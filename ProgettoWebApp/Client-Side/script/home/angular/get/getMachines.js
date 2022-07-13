
let dev;

let formMachines = document.querySelector(".formMachine");

export let getMachines = ($scope, $http, callback) => {
    $http({
        method : "GET",
        url : "/home/getMachines"
    }).then(function mySuccess(response) {
        dev = response.data;
        if(callback){
            callback(response.data);
        }
    }, function myError(response) {
        console.log(response);
    });
}

export let refreshMachine = ($scope, callback) => {
    document.forms["formMachine"].addEventListener("submit", (event, $scope) => {
        event.preventDefault();
        const resp = fetch(event.target.action, {
          method: "POST",
          body: new URLSearchParams(new FormData(event.target)),
        }).then((response) => {
            response.json().then((data) => {
                if(callback){
                    callback(data);
                }
            }).catch((err) => {
                console.log(err);
            })
        });
      });
}