var express = require('express'), api = require('./routes/api'), bodyParser = require('body-parser');
var app = express();
var Datastore = require('nedb'), db = new Datastore({ filename: 'server.db', autoload: true });

app.use(bodyParser.json());

app.use(function(req, res, next) {
	console.log('received request: '+req.url+' / '+req.method);
	console.log(req.body);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Cache-Control');

  if(req.method === 'POST'){
  	console.log(req.body);
  	db.insert(req.body, function (err, newDoc) {
	  	console.log('inserted new row to DB');
		});
  };

});
 
//app.get('/getAll', api.getAll);
//app.post('/write', api.write);
 
app.listen(8000, '192.168.1.5');

console.log("Express server listening...");