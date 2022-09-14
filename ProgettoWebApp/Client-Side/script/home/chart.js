import { getTopicTime } from "./angular/dinamicTable.js";

let data = {
	labels: [],
	datasets: [{
    labels: "Scegli un dato da visualizzare",
		backgroundColor: '#112d42',
		borderColor: '#112d42',
    data: []
	}]
};

let config = {
	type: 'line',
	data: data,
	options: {}
};


export let myChart = new Chart(
	document.getElementById('chart'),
	config
);

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

			for (let i = 0; i < 15; i++) {
				labels.push(res.pageData[count*i].formattedDate);
			}

			addData(myChart, labels, newValues, newTopic.replaceAll("_", " "));


		});
	});
}


let addData = (chart, label, newData, topic) => {
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
	label.forEach((element) => {
		chart.data.labels.push(element);
	});
	newData.forEach((element) => {
    console.log(element);
    console.log(chart.data.datasets[0].data);  
    chart.data.datasets[0].data.push(element);
	});
	chart.data.datasets[0].label = topic;
	chart.update(); 
}




export let resetChart = (chart) => {
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.data.datasets[0].label = "Scegli un dato da visualizzare"; 
  chart.update();
}