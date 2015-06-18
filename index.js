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

var ardPort = new porter("/dev/ttyACM0");
ardPort.on("open",function(data){
  console.log('data geliy'+data)
});
