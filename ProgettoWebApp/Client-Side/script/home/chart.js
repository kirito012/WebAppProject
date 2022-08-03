import { getTopicTime } from "./angular/dinamicTable.js";

export let createChart = ($scope, $http, topic, date, device, index, historicDataAll) => {
	getTopicTime(topic, date, (newTopic, newDate) => {
		historicDataAll($scope, $http, newTopic, newDate, device, index, ($scope, res) => {
			let values = [];
			let labels = [];
			let newValues = [];
			let newCount = 0;
			let value = 0;

			res.pageData.forEach((element, i) => {
				values.push(parseInt(element.value));
				//labels.push(element.formattedDate);
			});

			let count = Math.floor((values.length / 15));
			let time = Math.floor(values.length / count);

			for (let i = 1; i <= 15; i++) {
				for (let j = newCount; j < count * i; j++) {
					value += values[newCount];
					newCount++;
				}
				value = value / count;
				newValues.push(Math.round((value + Number.EPSILON) * 100) / 100);
				value = 0;
			}

			for (let i = 0; i < time; i++) {
				labels.push(res.pageData[time*i].formattedDate);
			}


			let data = {
				labels: labels,
				datasets: [{
					label: newTopic.replaceAll("_", " "),
					backgroundColor: '#112d42',
					borderColor: '#112d42',
					data: newValues,
				}]
			};

			let config = {
				type: 'line',
				data: data,
				options: {}
			};


			let myChart = new Chart(
				document.getElementById('chart'),
				config
			);


		});
	});
}