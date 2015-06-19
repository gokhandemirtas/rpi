
//execute commands
var Datastore = require('nedb'), db = new Datastore({ filename: 'server2.db', autoload: false });

// GET
exports.getAll = function (req, res) {
  console.log('Getting all readings...');
	db.find({}, function (err, docs) {
		res.json(docs);
	});
};

// POST
exports.write = function (req, res) {
  var data = req.body;
  console.log('request to write data:');
  console.log(data);
  db.insert(data, function (err, newDoc) {
  	console.log('inserted to DB');
	});
};