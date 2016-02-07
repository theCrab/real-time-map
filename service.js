// <-- MODULES
var cluster = require('cluster');
var domainServe = require('domain');
var http = require('http');
var static = require( 'node-static' );
var opener = require('opener');
// MODULES -->

// <-- CONSTANTS
var WORKERS = 1;
var SERVER_PORT = 3000;
var CLIENT_PORT = 3001;
var SERVICE = {};
var MAX_COUNT = 0;
// CONSTANTS -->

// <-- CONFIG

var file = new static.Server('.',{
  cache: 0,
  gzip: true
});
var cities = require( './data/geodata/cities.json');
var cityCountries = require( './data/geodata/cities_with_countries.json');
var countryOf = {};
for (var i in cityCountries) {
  countryOf[cityCountries[i].city] = cityCountries[i].country;
}
MAX_COUNT = cities.features.length;
// CONFIG -->

// <-- SERVER

if (cluster.isMaster) {
  for (var i = 0; i < WORKERS; ++i) {
    console.log('worker %s started.', cluster.fork().process.pid);
  }
  cluster.on('disconnect', function(worker) {
    console.error('disconnect!');
    console.log('worker ' + cluster.fork().process.pid + ' born.');
  });
} else {
  var server = http.createServer(function(request, response) {
    var domain = domainServe.create();
    domain.on('error', function(er) {
      console.error('error', er.stack);
      try {
        var killtimer = setTimeout(function() {
          process.exit(1);
        }, 30000);
        killtimer.unref();
        server.close();
        cluster.worker.disconnect();
        response.statusCode = 500;
        response.end(JSON.stringify({
          status: 0,
          message: 'Domain Error'
        }));
      } catch (er2) {
        console.error('Error sending 500!', er2.stack);
      }
    });
    domain.add(request);
    domain.add(response);
    domain.run(function() {
      if (request.headers.origin) {
        response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
        response.setHeader('Access-Control-Allow-Methods', 'GET')
      }
      next(request, response);
    });
  });
  server.listen(SERVER_PORT);
  var client = http.createServer(function(request, response) {
    request.addListener('end',function() {
      file.serve(request, response);
    }).resume();
  });
  client.listen(CLIENT_PORT);
  opener('http://localhost:' + CLIENT_PORT);
}

// SERVER -->

// <-- REQUEST SETUP
function next(request, response) {
  var url = request.url.split('/')[1];
  if (SERVICE[url]) {
    SERVICE[url](function(result) {
      response.end(JSON.stringify(result));
    });
  } else response.end(JSON.stringify({
    status: 0,
    message: 'Service Error'
  }));
}
// REQUEST SETUP -->

// <-- METHODS
function getIndex() {
  return Math.floor(Math.random() * MAX_COUNT);
}
// METHODS -->

// <-- SERVICES
SERVICE['getCity'] = function(callback) {
  var i = getIndex();
  var obj = cities.features[i];
  var city = decodeURI(obj.id);
  var dt = {
    id: city,
    lat: obj.geometry.coordinates[1],
    lng: obj.geometry.coordinates[0],
    name: city,
    country: countryOf[city]
  }
  callback({status: 1, data: dt});
}
// SERVICES -->
