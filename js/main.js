//API URLs
var apiUrl = 'http://localhost:8080/temperature/';
//highchart
var temperatureChart;
var humidityChart;
var windQualityChart;
var powderChart;
var stationId;

//init
function init() {
	console.log('Initializing page...');
    getStations();
}

//get stations
function getStations() {
    console.log('Getting station list...');
    var x = new XMLHttpRequest(); //create object request
    x.open('GET', apiUrl+'station/'); //Open connection
    x.send(); //send request to api
    x.onreadystatechange = function() {
        if(x.readyState == 4 && x.status == 200) {
            console.log(x.responseText);
            var jsonData = JSON.parse(x.responseText);
            if(jsonData.status == 0) showStations(jsonData.stations);
        }
    }
 }

//show stations
function showStations(stations) {
    console.log('Showing stations...');
    console.log(stations);
    var divStations = document.getElementById('sidebarElements');
    for(var i = 0; i < stations.length; i++) {
        var divInfo = document.createElement('li');
        var divIcon = document.createElement('div');
        var divName = document.createElement('div');
        var divIp = document.createElement('div');
        var imgIcon = document.createElement('img');
        divInfo.className = "stationinfo";
        divInfo.setAttribute('onclick','getTemperatures('+stations[i].id+')');
        divIcon.className = "stationicon";
        imgIcon.src = 'images/station.png';
        divName.className = "stationname";
        divName.innerHTML = stations[i].description;
        divIp.className = "stationip";
        divIp.innerHTML = stations[i].ipAddress;

        divIcon.appendChild(imgIcon);
        divInfo.appendChild(divIcon);
        divInfo.appendChild(divName);
        divInfo.appendChild(divIp);
        divStations.appendChild(divInfo);
    }
}

//get temperatures
function getTemperatures(id) {
	stationId = id;
	console.log('Getting station temperatures...');
    // prepareChart(testData);
    var x = new XMLHttpRequest(); //create object request
    x.open('GET', apiUrl+'station/' + id); //Open connection
    x.send(); //send request to api
    x.onreadystatechange = function() {
        if(x.readyState == 4 && x.status == 200) {
            // console.log(x.responseText);
            var jsonData = JSON.parse(x.responseText);
            if(jsonData.status == 0) {
				prepareChart(jsonData.station);  
			}
        }
    }
}

//prepare chart
function prepareChart(data) {
	// console.log(data);
	console.log('Preparing chart...');
	//data arrays
	var xAxisCategories = [];
	var seriesDataTemp = [];
	var seriesDataHum = [];
	var seriesDataWind = [];
	var seriesDataPow = [];
    //read data
    // console.log(data);
	data.readings.forEach(function(item) {
		xAxisCategories.push(item.dateTime);
		seriesDataTemp.push(item.temperature);
		seriesDataHum.push(item.humidity);
		seriesDataWind.push(item.windQuality);
		seriesDataPow.push(item.powder);
	});
	// console.log(seriesDataTemp)
	// console.log(seriesData);
	drawColumnChart('readings', xAxisCategories, 'values', seriesDataTemp, seriesDataHum, seriesDataWind, seriesDataPow);
}

//draw column chart
function drawColumnChart(chartSubtitle, xAxisCategories, seriesName, seriesDataTemp, seriesDataHum, seriesDataWind, seriesDataPow) {
	console.log('Drawing chart...');
	console.log(seriesDataPow)
	//highchart test
	temperatureChart = Highcharts.chart('chartTemp', {
		title: {
			text : 'Temperature',
			style: {
				'font-size' :'18pt', 
				color: '#555'
			}
		},
		subtitle: {
			text: chartSubtitle,
			style: {
				'font-size' :'14pt', 
				color: '#777'
			}
		},
		xAxis: {
			reversed: true,
			categories: xAxisCategories
		},
		yAxis: {
			min: 0,
			max: 50,
			title: {
				text: 'Degrees Celsius'
			},
			style: {
				'font-size' : '12pt'
			}
		},
		plotOptions : {
			series: {
				dataLabels: {
					enabled: true,
					style: {
						color: '#0D47A1'
					}
				}
			}
		},
		series: [
			{
				name: seriesName,
				animation: false,
				color: '#0D47A1',
				data: seriesDataTemp
			}
		]
	});

	humidityChart = Highcharts.chart('chartHum', {
		title: {
			text : 'Humidity',
			style: {
				'font-size' :'18pt', 
				color: '#555'
			}
		},
		subtitle: {
			text: chartSubtitle,
			style: {
				'font-size' :'14pt', 
				color: '#777'
			}
		},
		xAxis: {
			reversed: true,
			categories: xAxisCategories
		},
		yAxis: {
			min: 0,
			max: 100,
			title: {
				text: 'Percentage'
			},
			style: {
				'font-size' : '12pt'
			}
		},
		plotOptions : {
			series: {
				dataLabels: {
					enabled: true,
					style: {
						color: '#0D47A1'
					}
				}
			}
		},
		series: [
			{
				name: seriesName,
				animation: false,
				color: '#0D47A1',
				data: seriesDataHum
			}
		]
	});

	windQualityChart = Highcharts.chart('chartWind', {
		title: {
			text : 'Air Quality',
			style: {
				'font-size' :'18pt', 
				color: '#555'
			}
		},
		subtitle: {
			text: chartSubtitle,
			style: {
				'font-size' :'14pt', 
				color: '#777'
			}
		},
		xAxis: {
			reversed: true,
			categories: xAxisCategories
		},
		yAxis: {
			min: 0,
			max: 1000,
			title: {
				text: 'PPM'
			},
			style: {
				'font-size' : '12pt'
			}
		},
		plotOptions : {
			series: {
				dataLabels: {
					enabled: true,
					style: {
						color: '#0D47A1'
					}
				}
			}
		},
		series: [
			{
				name: seriesName,
				animation: false,
				color: '#0D47A1',
				data: seriesDataWind
			}
		]
	});

	powderChart = Highcharts.chart('chartPowder', {
            
		title: {
			text: 'Powder level',
			style: {
				'font-size' :'18pt', 
				color: '#555'
			}
		},
		subtitle: {
			text: chartSubtitle,
			style: {
				'font-size' :'14pt', 
				color: '#777'
			}
		},
		xAxis: {
			type: 'datetime',
			reversed: true,
			categories: xAxisCategories
		},
		yAxis: {
			min: 0,
			max: 600,
			title: {
				text: 'PPM'
			},
			style: {
				'font-size' : '12pt'
			}
		},
		legend: {
			enabled: true
		},
		plotOptions: {
			area: {
				fillColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
					stops: [
						[0, Highcharts.getOptions().colors[0]],
						[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
					]
				},
				marker: {
					radius: 2
				},
				lineWidth: 1,
				states: {
					hover: {
						lineWidth: 1
					}
				},
				threshold: null
			}
		},
		series: [{
			type: 'area',
			animation: false,
			name: seriesName,
			data: seriesDataPow
		}]
	});
}

setInterval(function() {
	getTemperatures(stationId);
},3000);


