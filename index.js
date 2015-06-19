var arduinoId = "75439333335351B0C151";
var serialPort = require("serialport");
var porter = serialPort.SerialPort;

serialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});

var Datastore = require('nedb')
var db = new Datastore({ filename: 'veritabani.db', autoload: true });

var sampleData = [{
  lastUpdate: new Date(),
  temp: 44,
  humidity: 122
}];

var ardPort = new porter("/dev/ttyACM0");

var dbInsert = function(data){
  db.insert(data, function (err, newDocs) {
    console.log('inserted to DB success'+newDocs);
  });
};

ardPort.on("open",function(data){
  console.log('data geliy'+data);
  dbInsert(sampleData);
});
