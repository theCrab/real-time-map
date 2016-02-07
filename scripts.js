// <-- USING SOCKET

// <-- CONSTANTS
var CITIES_AVAILABLE = {};
// CONSTANTS -->

// <-- SOCKET
var socket = io('http://localhost:3002');
socket.on('connect', function(){
  console.log("socket connected..");
});
socket.on('disconnect', function(){
  console.log("socket disconnected!");
});
socket.on('new-visit', function(data){
  dataHandler(data);
});
// SOCKET -->

// <-- METHODS
function setUpMap() {
  $('#map').gmap({'disableDefaultUI':true, 'callback': socket.emit('map-ready')});
}

function dataHandler(city) {
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
// USING SOCKET -->




// <-- USING JQUERY GET REQUEST LOOP

// <-- CONSTANTS
// var CITIES_AVAILABLE = {};
// var LOOP_TIME = 3000;
// var INTERVAL = null;
// CONSTANTS -->

// <-- METHODS
// function setUpMap() {
//   $('#map').gmap({'disableDefaultUI':true, 'callback': start});
// }
//
// function start() {
//   INTERVAL = setInterval(getCity, LOOP_TIME);
// }
//
// function stop() {
//   if (!INTERVAL) return;
//   clearInterval(INTERVAL);
//   INTERVAL = null;
// }
//
// function getCity() {
//   $.getJSON("http://localhost:3000/getCity", dataHandler);
// }
//
// function dataHandler(data) {
//   if (data.status == 0) return;
//   var city = data.data;
//   if (CITIES_AVAILABLE[city]) return;
//   var marker = {'id': city.id, 'position': new google.maps.LatLng(city.lat, city.lng), 'bounds':true };
//   var info = {'content': city.name + ' - ' + city.country };
//   addMarker(marker, info);
//   CITIES_AVAILABLE[city] = '';
// }
//
// function addMarker(marker, info) {
//   $('#map').gmap('addMarker', marker).click(function() {
//     $('#map').gmap('openInfoWindow', info, this);
//   });
// }
// METHODS -->

// jQuery(document).ready(setUpMap);
// USING JQUERY GET REQUEST LOOP -->
