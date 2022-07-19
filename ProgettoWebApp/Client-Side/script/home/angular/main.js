import {getModels} from "./get/getModels.js";
import {getMachines, refreshMachine} from "./get/getMachines.js";
import {getProfile, getNewPfp} from "./get/getProfile.js"
import {getTopics, activeTopics} from "./get/getTopics.js";
import {refreshProfileData} from "./post/changePersonal.js";
import {removeMachine, emptyPost} from "./post/removeMachine.js";
import {textAnimation, removeTextAnimation} from "../animation/animate.js";
import {updateTopics} from "./post/updateTopics.js";



let inputValue = document.querySelector("#inputSearch");
let clicked = false;

let devicesList;
export let index;

let topics;


let infos = document.querySelectorAll(".infoBottom span");

let app = angular.module('myApp', []);

app.controller('myController', function($scope, $http, $timeout) {
    getModels($scope, $http);

    getMachines($scope, $http, (device) => {
        $timeout(() => {
            $scope.devices = device;
            devicesList = $scope.devices;
        }, 0);
    });

    refreshMachine($scope, ($newScope, data) => {
        $timeout(() => {
            $newScope.devices = data;
        }, 0);
    });;

    getProfile($scope, $http, ($scope, data) => {
        $timeout(() => {
            $scope.profileData = data;
            $scope.name = data.name;
            $scope.surname = data.surname;
            $scope.email = data.email;
            $scope.birthday = new Date(data.Birthday);
        }, 0);
    });

    refreshProfileData($scope, ($scope, data) => {
        $timeout(() => {
            console.log(data);
            $scope.profileData = data;
            $scope.name = data.name;
            $scope.surname = data.surname;
            $scope.email = data.email;
            $scope.birthday = new Date(data.Birthday);
        }, 0);
    })

    getNewPfp($scope, $http);

    getTopics($scope, $http, (data) => {
        $timeout(() => {
            topics = data;
            let labels = document.querySelectorAll(".topicLabel");
            let topicCheck = document.querySelectorAll(".checkbox");

            let delayTopic = 1; 

            topicCheck.forEach((element, i) => {
                element.setAttribute("id", "i" + i);
                labels[i].htmlFor = "i" + i;
                labels[i].setAttribute("id", "ii" + i);
                let newName= data[i].name.replaceAll(" ", "_");
                element.classList.add(newName);
                if(i < 16){
                    labels[i].style.transitionDelay = delayTopic / 8 + "s";
                    delayTopic++;
                }
            });
        }, 0)
    });


    $scope.selected = ($index) => {
        index = $index;
        devicesList = $scope.devices;
        document.querySelectorAll(".device").forEach((element) => {
            element.classList.remove("active");
        })
        document.querySelectorAll(".device")[index].classList.add("active");
        infos[0].innerHTML = devicesList[index].customname;
        infos[1].innerHTML = devicesList[index].model;
        infos[2].innerHTML = devicesList[index].uniqueid;
        infos.forEach((element, i) => {
            infos[i].innerHTML = infos[i].textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        })
        textAnimation();
        removeMachine($scope, $http, index, devicesList, ($scope, device) => {
            $timeout(() => {
                $scope.devices = device;
            }, 0);
        });
        activeTopics($scope, $http, devicesList, $index, ($scope, topicsActive) => {
            topics.forEach((element) => {
                let newClass = element.name.replaceAll(" ", "_");
                document.querySelector("." + newClass).checked = false;
            })
            topicsActive.forEach((element, i) => {
                topics.forEach((item) => {
                    if(element.name == item.name){
                        let newClass = element.name.replaceAll(" ", "_");
                        document.querySelector("." + newClass).checked = true;
                    }  
                })
            })
        })
    }    
 

    $scope.removeSelection = () => {
        index = undefined;
        document.querySelectorAll(".device").forEach((element) => {
            element.classList.remove("active");
        })
        infos.forEach((element, i) => {
            infos[i].innerHTML = infos[i].textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        })
        $timeout(() => {
            infos[0].innerHTML = "";
            infos[1].innerHTML = "";
            infos[2].innerHTML = "";
        }, 1000);
        removeTextAnimation();
        emptyPost($scope, $http, () => {

        });
        topics.forEach((element) => {
            let newClass = element.name.replaceAll(" ", "_");
            document.querySelector("." + newClass).checked = false;
        })
    }
   
    $scope.sendTopic = ($index) => {
        $timeout(() => {
            let idLabel = document.querySelectorAll(".topicLabel")[$index].getAttribute("id");
            let idInput = idLabel.slice(1);
            let input = document.getElementById(idInput);
            if(index != undefined){
                devicesList = $scope.devices;
                let id = devicesList[index].uniqueid;
                let model = devicesList[index].model;
                let topic = $scope.topics[$index].name;
                let inputValue = input.checked;
                updateTopics($scope, $http, id, model, topic, inputValue, () => {

                });
            }else{
               input.checked = false;
            }
        }, 0)
    }

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