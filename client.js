var arduinoId = "75439333335351B0C151";
var serialPort = require("serialport");
var porter = serialPort.SerialPort;
var RestClient = require('node-rest-client').Client;
var restclient = new RestClient();
var restServer = 'http://192.168.1.5:8000/';

var Datastore = require('nedb')
var db = new Datastore({ filename: 'client.db', autoload: true });

var dataGenerator = function(){
  return {
    lastUpdate: new Date(),
    temp: Math.random()*50,
    humidity: Math.random()*80
  }
};

var ardPort = new porter("/dev/ttyACM0");

var writeLocal = function(args){
  db.insert(args, function (err, newDocs) {
    console.log('written to local DB success');
  });
};

var writeRemote = function(args){
  var payload = {
    data:args,
    headers:{"Content-Type": "application/json"}
  };
  restclient.post(restServer+"§write", payload, function(data, response){
    console.log('written to remote DB success');
  });
};

// triggers when there is new message from Arduino port

ardPort.on("open",function(data){
  console.log('data geliy'+data);
  var randomdata = dataGenerator();
  writeLocal(randomdata);
  writeRemote(randomdata);
});

// periodic manual trigger

var triggerWrite = function(){
  var randomdata = dataGenerator();
  writeLocal(randomdata);
  writeRemote(randomdata);
};

setInterval(triggerWrite, 5000);
