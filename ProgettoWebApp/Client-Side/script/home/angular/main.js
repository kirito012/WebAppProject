import {getModels} from "./get/getModels.js";
import {getMachines, refreshMachine} from "./get/getMachines.js";
import {getProfile, getNewPfp} from "./get/getProfile.js"
import {getTopics} from "./get/getTopics.js";
import {activeTopics} from "./post/machineTopics.js";
import {refreshProfileData} from "./post/changePersonal.js";
import {removeMachine, emptyPost} from "./post/removeMachine.js";
import {textAnimation, removeTextAnimation} from "../animation/animate.js";
import {updateTopics} from "./post/updateTopics.js";
import {sendInfo} from "./post/machineInfos.js";
import {getData} from "./get/getData.js";


let inputValue = document.querySelector("#inputSearch");
let clicked = false;

let devicesList;
export let index;

let topics;

let oldTopics = {}

let userId;

let dataStream;

let closeConn = {action: "close"};

let infos = document.querySelectorAll(".infoBottom span");


let app = angular.module('myApp', ['ngWebSocket']);

app.controller('myController', function($scope, $http, $timeout, $interval, $websocket) {

    dataStream = $websocket('ws://192.168.0.6:8081/socketData');
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
            let devicesList = document.querySelectorAll(".device");
            let delay = 1200;
            devicesList.forEach((element) => {
                element.style.transitionDelay = delay + "ms";
                delay += 100;
            })
        }, 0);
        let inputsAddMachine = document.querySelectorAll(".input.addMachine");
        inputsAddMachine.forEach((element) => {
            element.value = "";
        })
        document.querySelector(".added h3").innerHTML = "Dispositivo aggiunto";
        $timeout(() => {
            document.querySelector(".added h3").innerHTML = "";
        }, 5000);
    });;

    getProfile($scope, $http, ($scope, data) => {
        $timeout(() => {
            $scope.profileData = data;
            $scope.name = data.name;
            $scope.surname = data.surname;
            $scope.email = data.email;
            $scope.birthday = new Date(data.Birthday);
            userId = data.id;
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
                console.log(device);
                $scope.devices = device;
                $scope.removeSelection();
            }, 0);
        }); 
        activeTopics($scope, $http, devicesList, $index, ($scope, topicsActive) => {
            topics.forEach((element) => {
                let newClass = element.name.replaceAll(" ", "_");
                document.querySelector("." + newClass).checked = false;
            })
            if(topicsActive){
                topicsActive.forEach((element, i) => {
                    topics.forEach((item) => {
                        if(element.name == item.name){
                            let newClass = element.name.replaceAll(" ", "_");
                            document.querySelector("." + newClass).checked = true;
                        }  
                    })
                })
            }
            sendInfo($scope, $http, devicesList, $index, topicsActive, oldTopics, userId, ($scope, userId) => {

                let socketInfo = {utente_id: userId, action: "set"};

                dataStream.send(JSON.stringify(socketInfo));

                dataStream.onMessage((response) => {
                    console.log(response.data);
                })

                oldTopics = topicsActive;
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
        emptyPost($scope, $http, oldTopics, ($scope, data) => {
            if(dataStream){
                dataStream.send(JSON.stringify(closeConn));
            }
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