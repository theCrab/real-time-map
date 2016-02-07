// <-- CONSTANTS
var CITIES_AVAILABLE = {};
var LOOP_TIME = 3000;
var INTERVAL = null;
// CONSTANTS -->

// <-- METHODS
function setUpMap() {
  $('#map').gmap({'disableDefaultUI':true, 'callback': start});
}

function start() {
  INTERVAL = setInterval(getCity, LOOP_TIME);
}

function stop() {
  if (!INTERVAL) return;
  clearInterval(INTERVAL);
  INTERVAL = null;
}

function getCity() {
  $.getJSON("http://localhost:3000/getCity", dataHandler);
}

function dataHandler(data) {
  if (data.status == 0) return;
  var city = data.data;
  var marker = {'id': city.id, 'position': new google.maps.LatLng(city.lat, city.lng), 'bounds':true };
  var info = {'content': city.name + ' - ' + city.country };
  addMarker(marker, info);
}

function addMarker(marker, info) {
  $('#map').gmap('addMarker', marker).click(function() {
    $('#map').gmap('openInfoWindow', info, this);
  });
}

// METHODS -->

jQuery(document).ready(setUpMap);
