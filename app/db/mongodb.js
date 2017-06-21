var MongoClient = require('mongodb').MongoClient,
  test = require('assert');
// Connection url
var url = 'mongodb://localhost:27017/test';

module.exports = function(callback) {
  // Connect using MongoClient
  MongoClient.connect(url, function(err, db) {
    // Create a collection we want to drop later
    var col = db.collection('messages');

    callback(col);
  });
};
