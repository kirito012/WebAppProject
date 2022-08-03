import { getModels } from "./get/getModels.js";
import { getMachines, refreshMachine } from "./get/getMachines.js";
import { getProfile, getNewPfp } from "./get/getProfile.js"
import { getTopics } from "./get/getTopics.js";
import { activeTopics } from "./post/machineTopics.js";
import { refreshProfileData } from "./post/changePersonal.js";
import { removeMachine, emptyPost } from "./post/removeMachine.js";
import { textAnimation, removeTextAnimation, gaugeTextAnimation } from "../animation/animate.js";
import { updateTopics } from "./post/updateTopics.js";
import { sendInfo } from "./post/machineInfos.js";
import { getLocation } from "./get/getLocation.js";
import { updateData } from "./get/updateData.js";
import { historicData, historicDataAll } from "./post/historicData.js";
import { getAlert, removeAlert } from "./post/postError.js";
import { indexUpdate } from "../script.js";
import { dinamicTable } from "./dinamicTable.js";
import { createChart } from "../chart.js"

let inputValue = document.querySelector("#inputSearch");
let clicked = false;

let devicesList;
export let index;

let topics;

let button = document.querySelector(".submitAddMachine");

let oldTopics = {}

let userId;

let dataStream;

let closeConn = { action: "close" };

let infos = document.querySelectorAll(".infoBottom span");

let map;

let setted = false;

let marker;

let dataSelected;
let itemClasses = ["bar b1", "bar b2", "bar b3", "bar b4"];

let oldValue = 0;

let app = angular.module('myApp', ['ngWebSocket']);

app.controller('myController', ($scope, $http, $timeout, $interval, $websocket) => {
	document.querySelector(".showMore").style.display = "none";

	map = L.map('map').setView([0, 0], 1);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);


	getModels($scope, $http);

	getMachines($scope, $http, (device) => {
		$timeout(() => {
			$scope.devices = device;
			devicesList = $scope.devices;
		}, 0);
	});

	refreshMachine($scope, ($newScope, data) => {
		$timeout(() => {
			if (data.error) {
				let error = {
					machineNameExceed: "Nome macchina troppo lungo",
					machineMissing: "Modello non disponibile",
				}
				document.querySelector(".error").innerHTML = error[data.error];
				setTimeout(() => {
					document.querySelector(".error").innerHTML = "";
				}, 5000)
				button.classList.add("error");
				$timeout(() => {
					button.classList.remove("error");
				}, 500)
			} else {
				$newScope.devices = data;
			}
			button.classList.add("success");
			$timeout(() => {
				button.classList.remove("success");
			}, 500)
		}, 0);
		let inputsAddMachine = document.querySelectorAll(".input.addMachine");
		inputsAddMachine.forEach((element) => {
			element.value = "";
		})
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
				let newName = data[i].name.replaceAll(" ", "_");
				element.classList.add(newName);
				if (i < 16) {
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
				$scope.removeSelection();
				if (dataStream) {
					dataStream.send(JSON.stringify(closeConn));
					dataStream = undefined;
				}
			}, 0);
		});





		activeTopics($scope, $http, devicesList, $index, ($scope, topicsActive) => {
			$scope.activeTopics = topicsActive;
			topics.forEach((element) => {
				let newClass = element.name.replaceAll(" ", "_");
				document.querySelector("." + newClass).checked = false;
			})
			if (topicsActive) {
				topicsActive.forEach((element, i) => {
					topics.forEach((item) => {
						if (element.name == item.name) {
							let newClass = element.name.replaceAll(" ", "_");
							document.querySelector("." + newClass).checked = true;
						}
					})
				})
			}




			sendInfo($scope, $http, devicesList, $index, topicsActive, oldTopics, userId, ($scope, userId) => {
				setted = false;
				if (marker) {
					map.removeLayer(marker);
					map.setView([0, 0], 1);
				}
				if (!dataStream) {
					dataStream = $websocket('ws://192.168.0.6:8081/socketData');
					let socketInfo = { utente_id: userId, action: "start" };
					dataStream.send(JSON.stringify(socketInfo));
					dataStream.onMessage((msg) => {
						let data = JSON.parse(msg.data);
						updateData(data, dataSelected, gaugeTextAnimation, $scope, $http);
						if (!setted) {
							if (data.location) {
								getLocation($scope, $http, data.location, ($scope, coordinates) => {
									map.setView([coordinates.data[0].latitude, coordinates.data[0].longitude], 12);
									marker = L.marker([coordinates.data[0].latitude, coordinates.data[0].longitude]).addTo(map)
								})
								setted = true;
							}
						}
					})
				}
				let responseTopic = { utente_id: userId, action: "set", objective: "set_output_display_line_1_response_topic", responseTopic: "line", msg: "display_line_1" };
				let location = { utente_id: userId, action: "get", objective: "get_location", msg: "location", responseTopic: "location" };
				dataStream.send(JSON.stringify(location));
				dataStream.send(JSON.stringify(responseTopic));
				oldTopics = topicsActive;
			})





			getAlert($scope, $http, devicesList, index, ($scope, res) => {
				if (res.length != 0) {
					document.querySelector(".noNotify").style.display = "none";
					$scope.warnings = res;
					$scope.getIndex = ($index) => {
						removeAlert($scope, $http, devicesList, index, $scope.warnings[$index].name, $scope.warnings[$index].formattedTime, $scope.warnings[$index].errorId, ($scope, newRes) => {
							$scope.warnings = newRes;
							if (newRes.length == 0) {
								document.querySelector(".noNotify").style.display = "flex";
							}
						})
					}
				}
			})




			document.querySelector(".send").onclick = () => {
				let chart = document.querySelector(".historicChart");
				let table = document.querySelector(".table");
				if (table.className == ("table active")) {
					let topic, dateTime;
					dinamicTable($scope, $http, $timeout, topic, dateTime, devicesList, index, indexUpdate, historicData);
				} else if (chart.className == ("historicChart active")) {
					let topic, dateTime;
					createChart($scope, $http, topic, dateTime, devicesList, index, historicDataAll);
				}
			}
		});
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
			if (dataStream) {
				dataStream.send(JSON.stringify(closeConn));
				dataStream = undefined;
			}
		});
		topics.forEach((element) => {
			let newClass = element.name.replaceAll(" ", "_");
			document.querySelector("." + newClass).checked = false;
		})
		document.querySelector(".gaugeIndicator").style.transform = "rotate(180deg)";
		document.querySelector(".gaugeContainer h4").innerHTML = "Seleziona un dato...";
		document.querySelector(".s2 span").innerHTML = "";
		document.querySelector(".b1").style.height = 0 + "px";
		document.querySelector(".b2").style.height = 0 + "px";
		document.querySelector(".b3").style.height = 0 + "px";
		document.querySelector(".b4").style.height = 0 + "px";
		document.querySelector(".b1 span").innerHTML = "";
		document.querySelector(".b2 span").innerHTML = "";
		document.querySelector(".b3 span").innerHTML = "";
		document.querySelector(".b4 span").innerHTML = "";
		document.querySelector(".s1 span").innerHTML = "";
		//map.setView([0, 0], 1);
		//map.removeLayer(marker);
		$scope.activeTopics = undefined;
		$scope.pages = [];
		$scope.datas = [];
		document.querySelector(".showMore").style.display = "none";
		setted = false;
		gaugeTextAnimation(oldValue, 0);
		oldValue = 0;
	}

	$scope.sendTopic = ($index) => {
		$timeout(() => {
			let idLabel = document.querySelectorAll(".topicLabel")[$index].getAttribute("id");
			let idInput = idLabel.slice(1);
			let input = document.getElementById(idInput);
			if (index != undefined) {
				devicesList = $scope.devices;
				let id = devicesList[index].uniqueid;
				let model = devicesList[index].model;
				let topic = $scope.topics[$index].name;
				let inputValue = input.checked;
				updateTopics($scope, $http, id, model, topic, inputValue, () => {

				});
			} else {
				input.checked = false;
			}
		}, 0)
	}

	$scope.myFunction = function (index) {
		clicked = false;
		inputValue.value = index;
	}
	$scope.disable = function () {
		clicked = true;
	}
	$scope.mouseOut = function () {
		if (!clicked) {
			inputValue.value = '';
		}
	}


	let dataSelector = (item) => {
		for (let key in itemClasses) {
			if (item.className == itemClasses[key]) {
				dataSelected = item.className.slice(-1);
				let value = 180 - (document.querySelector('.' + item.className.replace(' ', '.') + ' span').innerHTML.slice(0, -1) * (1.8));
				document.querySelector(".gaugeIndicator").style.transform = "rotate(-" + value + "deg)";
				gaugeTextAnimation(oldValue, document.querySelector('.' + item.className.replace(' ', '.') + ' span').innerHTML);
				document.querySelector(".gaugeContainer h4").innerHTML = document.querySelector(".n" + dataSelected).innerHTML;
			}
		}
	}

	document.querySelectorAll(".bar").forEach((element) => {
		element.onclick = () => {
			dataSelector(element);
		}
	})


});