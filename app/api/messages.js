'use strict';

var Promise = require("bluebird");

module.exports = function (oApp) {

    let message = require('../db/models/message.js');

    oApp.all('/api/message**', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With, X-XSRF-TOKEN");
      next();
    });

    oApp.get('/api/message', (req, res) => {
      message.find().then(messages => {
        res.json(messages.map(message => {
            return {
                id: message.id,
                createdTime: message.createdTime,
                eventType: message.eventType,
                text: message.text,
                created: message.created
            };
        }));
      }).catch((err) => {
        console.log(err);
        return res.status(500).send('Error occurred: database error');
      });
    });

    oApp.get('/api/message/:id', function (req, res) {
      message.findOne({ id: req.params.id })
        .then(message => {
          res.json({
              id: message.id,
              createdTime: message.createdTime,
              eventType: message.eventType,
              text: message.text,
              created: message.created
          });
        })
        .catch(err => {
          if (err) {
              res.status(500).send('Error occurred: database error');
          }
        });
    });

    oApp.post('/api/message', function (req, res) {
      Promise.reduce(req.body, function(total, event) {
        return new message({
	            id: event.id,
	            createdTime: event.createdTime,
	            eventType: event.eventType,
	            text: event.content && event.content.text
	        }).save(function (err, message) {
	            if (err) {
	                return res.status(500).send('Error occurred: database error');
	            }
	        })
          .then((message) => {
            return total + 1;
          });
      }, 0).then(total => {
          //Total number of messages
          res.json({
            total: total
          });
      });
    });

    oApp.delete('/api/message/:id', function (req, res) {
      message.remove({ id: req.params.id }, function (err) {
          if (err) {
              return res.status(500).send('Error occurred: database error');
          }

          return res.send();
      });
    });

    oApp.put('/api/message/:id', function(req,res){
      message.update({
            id: req.params.id
        }, {
            created: req.body.created
        }, function(err){
            if(err){
                return res.status(500).send('Error occurred: database error');
            }
            res.send();
        });
    });

};
