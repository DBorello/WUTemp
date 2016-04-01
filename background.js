function getTemp(Station,callback, errorCallback) {

  var searchUrl = 'http://stationdata.wunderground.com/cgi-bin/stationlookup?station='+ Station +'&units=english&v=2.0&format=json&_=' +
    + Date.now();
  //console.log(searchUrl);
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);

  x.responseType = 'json';
  x.onload = function() {

    var response = x.response;
	
    if (!response) {
      errorCallback('No response from WU!');
      return;
    }
	//console.log(x.response.stations)
    var temp = response.stations[Station].temperature;

    callback(temp);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}


var LastTemp = 1;
var LastColor = '#000000'

function doUpdate() {

	
	chrome.storage.sync.get({
		PWS: 'KORPHILO1'
	  }, function(items) {
		var Station = items.PWS;
	  
		getTemp(Station,function(temp) {
			var canvas = document.createElement('canvas');
			canvas.width = 19;
			canvas.height = 19;

			var context = canvas.getContext('2d');
			context.font = "bold 10px Silkscreen";

			
			if (LastTemp > parseFloat(temp)) {
				LastColor = '#FF1F1F';
			} else if (LastTemp < parseFloat(temp)) {
				LastColor = '#298A1E';
			}

			context.fillStyle = LastColor
			context.fillText(String(temp),0,14);
			
			var imageData = context.getImageData(0, 0, 19, 19);
			chrome.browserAction.setIcon({
			  imageData: imageData
			});
			
			LastTemp = parseFloat(temp);
			
		}, function(errorMessage) {
		  document.getElementById('status').textContent = errorMessage;
		});

	});
};

document.addEventListener('DOMContentLoaded', function() {
	doUpdate();
});

var pollInterval = 1*1000;

function startRequest() {
		doUpdate();
		window.setTimeout(startRequest,pollInterval);
}
startRequest()


function OpenWUPage() {
	chrome.storage.sync.get({
		PWS: 'KORPHILO1'
	  }, function(items) {
		var Station = items.PWS;
		chrome.tabs.create({url: "http://www.wunderground.com/personal-weather-station/dashboard?ID=" + Station});
	  });
}

// Called when the user clicks on the browser action icon.
chrome.browserAction.onClicked.addListener(function(tab) {
   OpenWUPage();
});
