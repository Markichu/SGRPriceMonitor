var coinGeckoETH = [];
var coinGeckoUSD = [];
var coinGeckoETHV = [];
var coinGeckoUSDV = [];

// Data Chart Options
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
		text:  "Sögur Historical Market Price"
	},
	noData: {
		text: "Loading Data..."
	},
	xaxis: {
		type: 'datetime',
		labels: {
			show: false
		},
		tooltip: {
			enabled: false
		},
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
			formatter: (value) => "$" + value.toFixed(2)
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
			}
		},
		title: {
			text: "SGR/ETH",
			style: {
				color: "#32c5ff"
			}
		}
	}],
	tooltip: {
		enabled: true,
        followCursor: true,
        showOnMarkerHover: true,
		shared: true,
		x: {
			show: true,
			format: 'dd MMM yyyy'
		},
		y: [{
			formatter: (value) => "$" + value.toLocaleString('en-US', {maximumFractionDigits:8}),
			title: {
				formatter: (seriesName) => seriesName,
			},
		},{
			formatter: (value) => value.toFixed(8) + " ETH",
			title: {
				formatter: (seriesName) => seriesName,
			},
		}],
		marker: {
			show: true,
		}
	}
};

// Time Chart Options
var optionsTime = {
	series: [{
		name: 'Volume (USD)',
		data: coinGeckoUSDV
	},{
		name: 'Volume (ETH)',
		data: coinGeckoETHV
	}],
	chart: {
		id: 'chartTime',
		height: 130,
		type: 'line',
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
	colors: ['#134cee', '#32c5ff'],
	noData: {
		text: "Loading Data..."
	},
	xaxis: {
		type: 'datetime',
		decimalsInFloat: 0
	},
	yaxis: [{
    	seriesName: 'Volume (USD)',
		tickAmount: 2,
		decimalsInFloat: 0,
		axisBorder: {
			show: true,
			color: "#134cee"
		},
		labels: {
			style: {
				colors: "#134cee"
			},
			formatter: (value) => "$" + value.toFixed(0)
		},
		title: {
			text: "Volume (USD)",
			style: {
				color: "#134cee"
			}
		}
	},{
    	seriesName: 'Volume (ETH)',
		opposite: true,
		tickAmount: 2,
		decimalsInFloat: 0,
		axisBorder: {
			show: true,
			color: "#32c5ff"
		},
		labels: {
			style: {
				colors: "#32c5ff"
			}
		},
		title: {
			text: "Volume (ETH)",
			style: {
				color: "#32c5ff"
			}
		}
	}],
	tooltip: {
		enabled: true,
        followCursor: true,
        showOnMarkerHover: true,
		shared: true,
		x: {
			show: true,
			format: 'dd MMM yyyy'
		},
		y: [{
			formatter: (value) => "$" + value.toLocaleString('en-US', {maximumFractionDigits:8}),
			title: {
				formatter: (seriesName) => seriesName,
			},
		},{
			formatter: (value) => value.toFixed(8) + " ETH",
			title: {
				formatter: (seriesName) => seriesName,
			},
		}],
		marker: {
			show: true,
		}
	}
};

var chartData = new ApexCharts(document.querySelector("#chart-data"), optionsData);
var chartTime = new ApexCharts(document.querySelector("#chart-time"), optionsTime);

chartData.render();
chartTime.render();

// get market data from CoinGecko for SGR/ETH pair
$.getJSON("https://api.coingecko.com/api/v3/coins/saga/market_chart?vs_currency=eth&days=max", function(data) {
	$.each(data.prices, function(index, timePrice) {
		coinGeckoETH.push(timePrice);
	});
	$.each(data.total_volumes, function(index, timeVolumes) {
		coinGeckoETHV.push(timeVolumes);
	});
	updateCharts();
});

// get market data from CoinGecko for SGR/USD pair
$.getJSON("https://api.coingecko.com/api/v3/coins/saga/market_chart?vs_currency=usd&days=max", function(data) {
	$.each(data.prices, function(index, timePrice) {
		coinGeckoUSD.push(timePrice);
	});
	$.each(data.total_volumes, function(index, timeVolumes) {
		coinGeckoUSDV.push(timeVolumes);
	});
	updateCharts();
});

// get current information from Sogur API
function getStats() {
	$.getJSON("https://sogur-info.sogur.com/sogur_rates_info.json", function(data) {
		updateStats(data);
	});
}
getStats();
setInterval(function() {
	getStats();
}, 30 * 1000); // refresh every 30 seconds

// Update Chart Data
function updateCharts() {
	var dataLen = Math.min(coinGeckoUSD.length, coinGeckoETH.length);
	chartData.updateSeries([{
		name: 'CoinGecko SGR/USD',
		data: coinGeckoUSD.slice(0, dataLen)
	},{
		name: 'CoinGecko SGR/ETH',
		data: coinGeckoETH.slice(0, dataLen)
	}], true)
	chartTime.updateSeries([{
		name: 'Volume (USD)',
		data: coinGeckoUSDV.slice(0, dataLen)
	},{
		name: 'Volume (ETH)',
		data: coinGeckoETHV.slice(0, dataLen)
	}], true)
}

// Update Stats Data
function updateStats(data) {
	document.querySelector(".stats-data").innerHTML = " \
	<text>Buy Price (USD): <text class='stats-loaded-usd'>$" + data.sgrUsdBuyPrice.toLocaleString('en-US', {maximumFractionDigits:14}) + "</text></text><br> \
	<text>Sell Price (USD): <text class='stats-loaded-usd'>$" + data.sgrUsdSellPrice.toLocaleString('en-US', {maximumFractionDigits:14}) + "</text></text><br> \
	<text>Buy Price (ETH): <text class='stats-loaded-eth'>" + data.sgrEthBuyPrice + " ETH</text></text><br> \
	<text>Sell Price (ETH): <text class='stats-loaded-eth'>" + data.sgrEthSellPrice + " ETH</text></text><br> \
	<text>Market Cap (USD): <text class='stats-loaded-usd'>$" + data.marketCap.toLocaleString('en-US', {maximumFractionDigits:9}) + "</text></text><br> \
	<text class='stats-update'>Last updated at " + new Date(data.createdAt).toLocaleTimeString() + ".</text> \
	";
}
