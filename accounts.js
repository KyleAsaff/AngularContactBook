var express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	Bourne = require('bourne'),
	crypto = require('crypto');

var router = express.Router(),
	db = new Bourne('users.json');

function hash(password) {
	return crypto.createHash('sha256').update(password).digest('hex');
}

router
	.use(bodyParser.urlencoded())
	.use(bodyParser.json())
	.use(session({ secret: 'asldaslkhdsahdhsajdsj232jkadsjafsddsfsfdfjncv' }))
	.get('/login', function (req, res) {
		res.sendfile('public/login.html');
	})
	.post('/login', function (req, res) {
		var user = {
			user: req.body.username,
			password: hash(req.body.password)
		};
		db.findOne(user, function (err, data) {
			if(data) {
				req.session.userId = data.id;
				res.redirect('/');
			} else {
				res.redirect('/login');
			}
		});
	})
	.post('/register', function (req, res) {
		var user = {
			user: req.body.username,
			password: hash(req.body.password),
			options: {}
		};
		db.find({username: user.username }, function (err, data) {
			if(!data.length) { // If user does not exist
				db.insert(user, function (err, data) {
					req.session.userId = data.id;
					res.redirect('/');
				});
			} else {
				res.redirect('/login');
			}
		});
	})
	.get('/logout', function (req, res) {
		req.session.userId = null;
		res.redirect('/');
	})
	.use(function (req, res, next) {
		if(req.session.userId) {
			db.findOne({ id: req.session.userId }, function (err, data) {
				req.user = data;
			});
		}
		next();
	});

module.exports = router;