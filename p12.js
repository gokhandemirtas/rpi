// ************ Definitions *************
var serialport = require("serialport");
SerialPort = serialport.SerialPort;
serial_number = "55431313438351A050C1"
var port_id = ""; 
pnpId = "";
manufacturer = "";
//var localdate = new Date();

    
counter = 0;
C = 0.0;
F = 0.0;
K = 0.0;
H = 0.0;
D = 0.0;
l = 0;	
u = 0;    
//****************************************
create_db();
read_data();

		
function getPort(callback)
{
	serialport.list(function (err, ports) 
	{
  
		ports.forEach(function(p) 
		{  
	        if (p.serialNumber.indexOf(serial_number) >0) 
	        {
				//console.log("arduino");
				port_id = p.comName;
				pnpId = p.pnpId;
				manufacturer = p.manufacturer;  
				//console.log(ports);
				//console.log("manufacturer : " + p.manufacturer);
				//console.log("pnpID : " + p.pnpId);
				//console.log("Serial : " + p.serialNumber);
				console.log("Product ID : " + p.productId);
				//console.log("port: " + p.comName);
	            port_id=p.comName;
	            callback(port_id); 
			}        
		});   


	});
  
}

//*****************************************

// ********************SERIAL READING FUNCTION********************
function read_data()
{


	console.log("port adresi " + port_id);
	var SerialPort = require("serialport").SerialPort

	getPort(function (serialPort) 
	{
		var serialPort = new SerialPort("/dev/ARDUINO", 
		{
			parser: serialport.parsers.readline("\r")
 
		});
  
		serialPort.on("open", function () 
		{
			console.log('open');
			serialPort.on('data', function(data) 
			{
				result = data.trim();
				console.log("uzunluk_data: " + data.length);
				console.log("uzunluk_result: " + result.length);
				console.log('data received: ' + data);

			    if (result.length > 28) 
			    { 
					//		 console.log ("command successful");
					C = result.slice(0,5);
			        F = result.slice(6,11);
			        K = result.slice(12,18);
			        H = result.slice(19,24);
			        D = result.slice(25,result.length);
					localdate = new Date(new Date).toISOString();
					 //var d = new Date();
			         //localdate = d.getUTCDate() + '.' + (d.getUTCMonth() +1) + '.' + d.getUTCFullYear() + ' ' + d.getUTCHours() + ':' + d.getUTCMinutes() + ':' + d.getUTCSeconds();
					console.log("C = " + C);
			        console.log("F = " + F);
			        console.log("K = " + K);
			        console.log("H = " + H);
			        console.log("D = " + D);
			        console.log("time = " + localdate);
			         
			        insert_data();
			        console.log ("counter="+ counter);
					if (counter == 1)
						{
							counter = 0;
							//data_transfer();
						}
					else
						{
							counter = counter + 1;
						}
							 
				}
				else 
				{
					 console.log("command not successful" );
				}            
       
			});
  
		});
	});
}
//*****************DATABASE RECORDING******************************

//**********  Create database if not exists ********
function create_db()
{
	var fs = require("fs");
	//var file = process.env.CLOUD_DIR + "/" + "ydata.db3";
	var file = "ydata.db3";
	var exists = fs.existsSync(file);

	if(!exists) 
	{
		console.log("Creating DB file.");
		var sqlite3 = require('sqlite3').verbose();
		var db = new sqlite3.Database("ydata.db3");
		fs.openSync(file, "w");
  
		db.serialize(function ()
		{
		db.run ("CREATE TABLE IF NOT EXISTS data (date DATETIME,temperatureC REAL,temperatureF REAL,temperatureK REAL,humidity NUMERIC, dewpoint REAL,port_id TEXT)");
		});
	}
}

//*************** INSERT DATA TO DB TABLE *****************
function insert_data()
{
	var sqlite3 = require('sqlite3').verbose();
	var fs = require("fs");
	var file = "ydata.db3";
	var exists = fs.existsSync(file);
	var db = new sqlite3.Database("ydata.db3");

	db.serialize(function ()
	{
	
		db.run ("CREATE TABLE IF NOT EXISTS data (date DATETIME,temperatureC REAL,temperatureF REAL,temperatureK REAL,humidity NUMERIC, dewpoint REAL,port_id TEXT)");
	
	//var localdate = new Date();
	
		var stmt = db.prepare("INSERT INTO data (date,temperatureC,temperatureF,temperatureK,humidity, dewpoint ,port_id) VALUES ((?),(?),(?),(?),(?),(?),(?))",localdate,C,F,K,H,D,port_id);
		stmt.run();
		stmt.finalize();
    });    
	db.close();      
}       
function data_transfer()
{
	var io  = require('/opt/node/node_modules/socket.io/node_modules/socket.io-client'),
    dl  = require('/opt/node/node_modules/delivery'),
    fs  = require('fs');
	//var manager = io.Manager ('http://10.34.26.213:80', {autoConnect: false});  
	//manager.open();
	var socket = io.connect ('http://10.34.26.213:80');

	socket.on('connect', function() 
	{
		console.log('client: connected to server' );
	
		delivery = dl.listen(socket);
		delivery.connect();
	
		delivery.on('delivery.connect',function(delivery)
		{
			delivery.send(
			{
				name : 'ydata.db3',
				path : '/home/pi/proje/newprj/ydata.db3'
			});
			delivery.on ('send.success',function(file)
			{
	           console.log('File send successfully!');
	        
			});
		});
		delivery.on('delivery.reconnect',function(){});
		//socket.on ('disconnect',function(){});
		//manager.close();
		//console.log("disconnected");
	});
	
	
}
