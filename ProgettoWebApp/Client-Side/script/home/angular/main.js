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
import {getLocation} from "./get/getLocation.js";


let inputValue = document.querySelector("#inputSearch");
let clicked = false;

let devicesList;
export let index;

let topics;

let oldTopics = {}

let userId;

let dataStream;

let closeConn = {action: "close"};

let closeListener = false;

let infos = document.querySelectorAll(".infoBottom span");

let map;

let setted = false;

let marker;

export let dataSelected;
let itemClasses = ["bar b1", "bar b2", "bar b3", "bar b4"];

let app = angular.module('myApp', ['ngWebSocket']);

app.controller('myController', ($scope, $http, $timeout, $interval, $websocket) => {

    map = L.map('map').setView([0,0], 1);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

    dataStream = $websocket('ws://192.168.0.6:8081/socketData');
    dataStream.onMessage((msg) => {
        console.log(msg.data);
        let data = JSON.parse(msg.data);
        if(data.heartbeat){
            document.querySelector(".s1 span").innerHTML = "Online";
        }else{
            document.querySelector(".s1 span").innerHTML = "Offline";
        }

        if(data.board_temperature){
            document.querySelector(".b1").style.height = data.board_temperature * 2 + "px";
            document.querySelector(".b1 span").innerHTML = data.board_temperature + "°";
        }
        if(data.cpu_usage_average){
            document.querySelector(".b2").style.height = data.cpu_usage_average * 2 + "px";
            document.querySelector(".b2 span").innerHTML = data.cpu_usage_average + "%";
        }
        if(data.free_storage){
            document.querySelector(".b3").style.height = data.free_storage * 2 + "px";
            document.querySelector(".b3 span").innerHTML = data.free_storage + "%";
        }
        if(data.free_memory){
            document.querySelector(".b4").style.height = data.free_memory * 2 + "px";
            document.querySelector(".b4 span").innerHTML = data.free_memory + "%";
        }
        if(data.location && !setted){
            console.log(data.location);
            getLocation($scope, $http, data.location, ($scope, coordinates) => {
                map.setView([coordinates.data[0].latitude, coordinates.data[0].longitude], 12);
                marker = L.marker([coordinates.data[0].latitude, coordinates.data[0].longitude]).addTo(map)
            })
            setted = true;
        }
    })

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
                if(dataStream){
                    dataStream.send(JSON.stringify(closeConn));
                    dataStream = undefined;
                }
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
                if(!dataStream){
                    dataStream = $websocket('ws://192.168.0.6:8081/socketData');
                    dataStream.onMessage((msg) => {
                        console.log(msg.data);
                        let data = JSON.parse(msg.data);
                        if(data.heartbeat){
                            document.querySelector(".s1 span").innerHTML = "Online";
                        }else{
                            document.querySelector(".s1 span").innerHTML = "Offline";
                        }

                        if(data.board_temperature){
                            document.querySelector(".b1").style.height = data.board_temperature * 2 + "px";
                            document.querySelector(".b1 span").innerHTML = data.board_temperature + "°";
                        }
                        if(data.cpu_usage_average){
                            document.querySelector(".b2").style.height = data.cpu_usage_average * 2 + "px";
                            document.querySelector(".b2 span").innerHTML = data.cpu_usage_average + "%";
                        }
                        if(data.free_storage){
                            document.querySelector(".b3").style.height = data.free_storage * 2 + "px";
                            document.querySelector(".b3 span").innerHTML = data.free_storage + "%";
                        }
                        if(data.free_memory){
                            document.querySelector(".b4").style.height = data.free_memory * 2 + "px";
                            document.querySelector(".b4 span").innerHTML = data.free_memory + "%";
                        }
                    })
                }
                let socketInfo = {utente_id: userId, action: "start"};
                let location = {utente_id: userId, action: "get", objective: "get_location", msg: "location", responseTopic: "location"};
                dataStream.send(JSON.stringify(location));
                dataStream.send(JSON.stringify(socketInfo));
                oldTopics = topicsActive;
                setted = false;
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
                dataStream = undefined;
            }
        });
        topics.forEach((element) => {
            let newClass = element.name.replaceAll(" ", "_");
            document.querySelector("." + newClass).checked = false;
        })
        document.querySelector(".b1").style.height = 0 + "px";
        document.querySelector(".b2").style.height = 0 + "px";
        document.querySelector(".b3").style.height = 0 + "px";
        document.querySelector(".b4").style.height = 0 + "px";
        document.querySelector(".b1 span").innerHTML = "";
        document.querySelector(".b2 span").innerHTML = "";
        document.querySelector(".b3 span").innerHTML = "";
        document.querySelector(".b4 span").innerHTML = "";
        document.querySelector(".s1 span").innerHTML = "";
        map.setView([0, 0], 1);
        map.removeLayer(marker);
        setted = false;
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

  
    let dataSelector = (item) => {
        for(let key in itemClasses){
            if(item.className == itemClasses[key]){
                dataSelected = item.className.slice(-1);
                let value = 180 - (document.querySelector('.' + item.className.replace(' ', '.') + ' span').innerHTML.slice(0, -1) * (1.8));
                document.querySelector(".gaugeIndicator").style.transform = "rotate(-" + value + "deg)";
            }
        }
    }

    document.querySelectorAll(".bar").forEach((element) => {
        element.addEventListener("click", () => {
            dataSelector(element);
        })
    })

});