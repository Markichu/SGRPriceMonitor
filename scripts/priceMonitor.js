/*
// this function will generate output in this format
// data = [
[timestamp, 23],
[timestamp, 33],
[timestamp, 12]
...
]
*/

var coinGeckoETH = [];
var coinGeckoUSD = [];
var exmoUSD = [];
var coinGeckoUSDV = [];

var optionsData = {
	series: [{
		name: 'CoinGecko SGR/USD',
		data: coinGeckoUSD
	},{
		name: 'CoinGecko SGR/ETH',
		data: coinGeckoETH
	}],
	chart: {
		id: 'chartData',
		type: 'line',
		height: 230,
		toolbar: {
			show: true,
			tools: {
				reset: false
	        }
		}
	},
	colors: ['#134cee', '#32c5ff'],
	stroke: {
		width: 2
	},
	dataLabels: {
		enabled: false
	},
	title: {
		text:  "CoinGecko SGR/USD"
	},
	noData: {
		text: "Loading Data..."
	},
	xaxis: {
		type: 'datetime',
		labels: {
			show: false
		}
	},
	yaxis: [{
    	seriesName: 'CoinGecko SGR/USD',
		tickAmount: 5,
		decimalsInFloat: 2,
		axisBorder: {
			show: true,
			color: "#134cee"
		},
		labels: {
			style: {
				colors: "#134cee"
			},
			align: 'right',
			formatter: function (value) {
	      		return "$" + value.toFixed(2);
		    }
		},
		title: {
			text: "SGR/USD",
			style: {
				color: "#134cee"
			}
		}
	},{
    	seriesName: 'CoinGecko SGR/ETH',
		opposite: true,
		tickAmount: 5,
		decimalsInFloat: 4,
		axisBorder: {
			show: true,
			color: "#32c5ff"
		},
		labels: {
			style: {
				colors: "#32c5ff"
			},
			align: 'center'
		},
		title: {
			text: "SGR/ETH",
			style: {
				color: "#32c5ff"
			}
		}
	}
	]
};

var optionsTime = {
	series: [{
		name: 'CoinGecko SGR/USD',
		data: coinGeckoUSDV
	}],
	chart: {
		id: 'chartTime',
		height: 130,
		type: 'bar',
		brush:{
			target: 'chartData',
			enabled: true
		},
		selection: {
			enabled: true,
			xaxis: {
				min: new Date(new Date().setMonth(new Date().getMonth() - 3)).getTime(),
				max: new Date().getTime()
			}
		},
	},
	colors: ['#134cee'],
	noData: {
		text: "Loading Data..."
	},
	xaxis: {
		type: 'datetime'
	},
	yaxis: {
		title: {
			text: "Volume (USD)",
			style: {
				color: "#134cee"
			}
		},
		tickAmount: 2,
		align: 'center',
		labels: {
			style: {
				colors: "#134cee"
			},
			formatter: function (value) {
	      		return "$" + value.toFixed(0);
		    }
		}
	}
};

var chartData = new ApexCharts(document.querySelector("#chart-data"), optionsData);
var chartTime = new ApexCharts(document.querySelector("#chart-time"), optionsTime);

chartData.render();
chartTime.render();

$.getJSON("https://api.coingecko.com/api/v3/coins/saga/market_chart?vs_currency=eth&days=max", function(data) {
	$.each(data.prices, function(index, timePrice) {
		coinGeckoETH.push(timePrice);
	});
	updateCharts()
});

$.getJSON("https://api.coingecko.com/api/v3/coins/saga/market_chart?vs_currency=usd&days=max", function(data) {
	$.each(data.prices, function(index, timePrice) {
		coinGeckoUSD.push(timePrice);
	});
	$.each(data.total_volumes, function(index, timeVolumes) {
		coinGeckoUSDV.push(timeVolumes);
	});
	updateCharts()
});

$.getJSON("https://api.exmo.com/v1.1/candles_history?symbol=SGR_USDT&resolution=D&from=1600300800&to=" + Math.floor(Date.now()/1000), function(data) {
	console.log(data)
	$.each(data.candles, function(index, object) {
		exmoUSD.push([object.t, (object.o + object.c)/2])
	});
	console.log(exmoUSD)
	updateCharts()
});

function updateCharts(){
	chartData.updateSeries([{
		name: 'CoinGecko SGR/USD',
		data: coinGeckoUSD
	},{
		name: 'EXMO SGR/USD',
		data: exmoUSD
	},{
		name: 'CoinGecko SGR/ETH',
		data: coinGeckoETH
	}], true)
	chartTime.updateSeries([{
		name: 'CoinGecko SGR/USD',
		data: coinGeckoUSDV
	}], true)
}
