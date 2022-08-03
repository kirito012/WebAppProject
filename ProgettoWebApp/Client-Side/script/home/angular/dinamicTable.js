export let dinamicTable = ($scope, $http, $timeout, topic, dateTime, devicesList, index, indexUpdate, historicData) => {
	getTopicTime(topic, dateTime, (topicUpdated, dateTimeUpdated) => {
		historicData($scope, $http, topicUpdated, dateTimeUpdated, devicesList, index, 1, ($scope, res) => {
			$scope.pages = [];
			$scope.datas = res.pageData;
			veifyHeartbeat(topicUpdated, $scope.datas);
			$scope.pagesNumber = res.pagesNumber;
			if (res.pagesNumber < 6) {
				for (let i = 1; i <= res.pagesNumber; i++) {
					$scope.pages.push({ value: i });
				}
				document.querySelector(".showMore").style.display = "none";
			} else {
				for (let i = 1; i <= 5; i++) {
					$scope.pages.push({ value: i });
				}
				document.querySelector(".showMore").style.display = "flex";
			}
			$timeout(() => {
				let pages = document.querySelectorAll(".pages");
				updateNavigator($scope, $http, pages, topic, dateTime, devicesList, index, 1, getTopicTime, indexUpdate, historicData);
			}, 0);
		})
	})
	let pageInput = document.querySelector(".inputPage");
	let selectPage = document.querySelector(".selectPage");
	document.querySelector(".showMore").onclick = () => {
		selectPage.classList.add("active");
	}
	document.querySelector(".submitNewData").onclick = () => {
		getTopicTime(topic, dateTime, (newTopic, newDateTime) => {
			historicData($scope, $http, newTopic, newDateTime, devicesList, index, parseInt(pageInput.value), ($scope, res) => {
				$scope.pagesNumber = res.pagesNumber;
				$scope.datas = res.pageData;
				veifyHeartbeat(newTopic, $scope.datas);
				generateIndicator($scope, parseInt(pageInput.value), res.pagesNumber, indexUpdate);
				$timeout(() => {
					selectPage.classList.remove("active");
					let newPages = document.querySelectorAll(".pages");
					updateNavigator($scope, $http, newPages, newTopic, newDateTime, devicesList, index, pageInput.value, getTopicTime, indexUpdate, historicData);
				}, 0);
			})
		})
	}
	document.querySelector(".less").onclick = () => {
		$timeout(() => {
			getTopicTime(topic, dateTime, (newTopic, newDateTime) => {
				previusPage($scope, $http, $timeout, devicesList, index, newTopic, newDateTime, historicData, indexUpdate, () => {

				});
			});
		}, 0);
	}
	document.querySelector(".more").onclick = () => {
		getTopicTime(topic, dateTime, (newTopic, newDateTime) => {
			let pagesNumber = $scope.pagesNumber;
			nextPage($scope, $http, $timeout, pagesNumber, devicesList, index, newTopic, newDateTime, historicData, indexUpdate, () => {

			});
		});
	}
}


export let getTopicTime = (topic, dateTime, callback) => {
	topic = document.querySelector("select.topic").options[document.querySelector("select.topic").selectedIndex].text.replaceAll(" ", "_");
	dateTime = parseFloat(document.querySelector("select.time").options[document.querySelector("select.time").selectedIndex].value) * 3600 * 1000;
	if (callback) {
		callback(topic, dateTime);
	}
}

let updateNavigator = ($scope, $http, pages, topic, date, devicesList, index, value, getTopicTime, indexUpdate, historicData) => {
	let pageNavigator = (item) => {
		pages.forEach((element) => {
			element.classList.remove("active");
		})
		item.classList.add("active");
	}
	pages.forEach((element, i) => {
		element.onclick = () => {
			pageNavigator(element);
			getTopicTime(topic, date, (newTopic, newDateTime) => {
				historicData($scope, $http, newTopic, newDateTime, devicesList, index, $scope.pages[i].value, ($scope, res) => {
					$scope.pagesNumber = res.pagesNumber;
					$scope.datas = res.pageData;
					veifyHeartbeat(newTopic, $scope.datas);
				})
			})
		}
		pages[i].classList.add("p" + (i + 1));
		if (value) {
			if (parseInt(pages[i].innerHTML) == parseInt(value)) {
				pages[i].classList.add("active");
			}
		}
	})
	indexUpdate();
}


let veifyHeartbeat = (topicName, datas) => {
	if (topicName == "heartbeat") {
		datas.forEach((element, i) => {
			datas[i].value = "Online";
		});
	}
}


let generateIndicator = ($scope, numPages, pagesNumber, indexUpdate) => {
	$scope.pages = [];
	let maxValue = numPages + 4;
	if (maxValue <= pagesNumber ) {
		if (numPages <= 5){
			for (let i = 1; i <= 5; i++){
				$scope.pages.push({value: i});
			}
		} else {
			for (let i = numPages; i <= maxValue; i++) {
				$scope.pages.push({ value: i });
			}
		}
	} else {
		for (let i = pagesNumber - 4; i <= pagesNumber; i++) {
			$scope.pages.push({ value: i });
		}
	}
	indexUpdate();
}



let previusPage = ($scope, $http, $timeout, devicesList, index, newTopic, newDateTime, historicData, indexUpdate, callback) => {
	let page = document.querySelector(".pages.active");
	let pageNumber = parseInt(page.innerHTML);
	if (pageNumber > 1) {
		historicData($scope, $http, newTopic, newDateTime, devicesList, index, pageNumber - 1, ($scope, res) => {
			$scope.pagesNumber = res.pagesNumber;
			$scope.datas = res.pageData;
			veifyHeartbeat(newTopic, $scope.datas);
			let previusValue = parseInt(page.className.substring(31, 32)) - 1;
			if (previusValue >= 1) {
				page.classList.remove("active");
				document.querySelector(".p" + previusValue).classList.add("active");
				indexUpdate();
			} else {
				$scope.pages = [];
				if (pageNumber - 1 > 5) {
					for (let i = pageNumber - 5; i <= pageNumber - 1; i++) {
						$scope.pages.push({ value: i });
					}
				} else {
					for(let i = 1; i <= 5; i++){
						$scope.pages.push({value: i});
					}
				}
				$timeout(() => {
					let pages = document.querySelectorAll(".pages");
					updateNavigator($scope, $http, pages, newTopic, newDateTime, devicesList, index, pageNumber - 1, getTopicTime, indexUpdate, historicData);
				}, 0);
			}
		});
	}
}


let nextPage = ($scope, $http, $timeout, pagesNumber, devicesList, index, newTopic, newDateTime, historicData, indexUpdate, callback) => {
	let page = document.querySelector(".pages.active");
	let pageNumber = parseInt(page.innerHTML);
	console.log(pagesNumber);
	if (pageNumber < pagesNumber) {
		historicData($scope, $http, newTopic, newDateTime, devicesList, index, pageNumber + 1, ($scope, res) => {
			$scope.pagesNumber = res.pagesNumber;
			$scope.datas = res.pageData;
			veifyHeartbeat(newTopic, $scope.datas);
			let nextValue = parseInt(page.className.substring(31, 32)) + 1;
			if (nextValue < 6) {
				page.classList.remove("active");
				document.querySelector(".p" + nextValue).classList.add("active");
				indexUpdate();
			} else {
				$scope.pages = [];
				if(pageNumber + 1 < pagesNumber - 5) {
					for (let i = pageNumber + 1; i <= pageNumber + 5; i++) {
						$scope.pages.push({ value: i });
					}
				} else {
					for (let i = pagesNumber - 4; i <= pagesNumber; i++) {
						$scope.pages.push({ value: i });
					}
				}
				$timeout(() => {
					let pages = document.querySelectorAll(".pages");
					updateNavigator($scope, $http, pages, newTopic, newDateTime, devicesList, index, pageNumber + 1, getTopicTime, indexUpdate, historicData);
				}, 0);
			}
		});
	}
}