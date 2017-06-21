'use strict';

module.exports = function (oApp) {

    require('../db/mongodb.js')(message => {

      oApp.all('/api/message**', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, X-XSRF-TOKEN");
        next();
      });

      oApp.get('/api/message', (req, res) => {
        message.find({}).toArray((err, messages) => {
          if(err)
            return res.status(500).send('Error occurred: database error');

          res.json(messages.map(message => {
              return {
                  id: message.id,
                  createdTime: message.createdTime,
                  eventType: message.eventType,
                  text: message.text,
                  created: message.created
              };
          }));
        });
      });

      oApp.get('/api/message/:id', function (req, res) {
        message.findOne({ id: req.params.id }, (err, message) => {
          if(err)
            return res.status(500).send('Error occurred: database error');
          if(!message)
            return res.status(404).send('Message not found');

          res.json({
              id: message.id,
              createdTime: message.createdTime,
              eventType: message.eventType,
              text: message.text,
              created: message.created
          });
        });
      });

      oApp.post('/api/message', function (req, res) {
        var messages = [];
        for(var i = 0; i < req.body.length; i++) {
      		var event = req.body[i];
          messages.push({
  	            id: event.id,
  	            createdTime: event.createdTime,
  	            eventType: event.eventType,
  	            text: event.content && event.content.text
  	        });
          }
        message.insertMany(messages, (err, result)=> {
          if (err) {
              return res.status(500).send('Error occurred: database error');
          }

          res.json({
              info: "success"
          });
        });
      });

      oApp.delete('/api/message/:id', function (req, res) {
        message.deleteOne({ id: req.params.id }, function (err) {
            if (err) {
                return res.status(500).send('Error occurred: database error');
            }

            return res.send();
        });
      });

      oApp.put('/api/message/:id', function(req,res){
        message.findOneAndUpdate({ id: req.params.id }, {
            $set: {
              created: req.body.created
          }}, function(err){
              if(err){
                  return res.status(500).send('Error occurred: database error');
              }
              res.send();
          });
      });
    });
};
