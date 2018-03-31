
//https://getting-meanstack.herokuapp.com/

var request = require("request");
var apiOptions = {
	server: "http://localhost:3000"
};
if (process.env.NODE_ENV === "production") {
	apiOptions.server = "https://getting-meanstack.herokuapp.com";
}


/* GET "Home" pages*/
module.exports.homeList = function(req, res){
	var requestOptions, path;
	path = "/api/locations";
	requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {},
		qs: {
			lng: -0.7992599,
			lat: 51.378091,
			maxDistance: 20
		}
	};
	request(
		requestOptions,
		function(err, response, body) {
			var i, data;
			data = body;
			if (response.statusCode === 200 && data.length) {
				data.forEach(function(d) {
					d.distance = _formatDistance(d.distance);
				});				
			}
			renderHomepage(req, res, data);
		}
	);
};
var renderHomepage = function(req, res, responseBody) {
	var message;
	if (!(responseBody instanceof Array)) {
		message = "API lookup error";
		responseBody = [];
	} else {
		if (!responseBody.length) {
			message = "No places found nearby";
		}
	}
	
	res.render('location-list', {
		title: 'Loc8r - find a place to work with wifi',
		pageHeader: {
			title: 'Loc8r',
			strapline: 'Find places to work with wifi near you!'
		},
		sidebar: "Locking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r hlp you find the place you're lookig for.",
		locations: responseBody,
		message: message
	 });
};

var _formatDistance = function(distance) {
	var numDistance, unit;
	if (distance > 1) {
		numDistance = parseFloat(distance).toFixed(1);
		unit = "km";
	} else {
		numDistance = parseInt(distance * 1000,10);
		unit = "m"
	}
	return numDistance + unit;
}
/* GET "Location info" pages*/
module.exports.locationInfo = function(req, res){
	var requestOptions, path;
	path = "/api/locations/" + req.params.locationid;
	requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {}
	};
	request(
		requestOptions,
		function(err, response, body) {
			var data = body;
			if (response.statusCode === 200) {
				data.coords = {
					lng: body.coords[0],
					lat: body.coords[1]
				};
				renderDetailPage(req, res, data);
			} else {
				_showError(req, res, response.statusCode);
			}
		}
	);
};
var renderDetailPage = function(req, res, locDetail) {
	res.render('location-info', {
		title: locDetail.name,
		pageHeader: {title: locDetail.name},
		sidebar: {
			context: "is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.",
			callToAction: "If you\'ve been and you like it - or if it you don\'t - please leave a review to help orther people just like you."
		},
		location: locDetail
	});
};
var _showError = function(req, res, status) {
	var title, content;
	if (status === 404) {
		title = "404, page not found";
		content = "Oh dear. Looks like we can't find this page. Sorry.";
	} else {
		title = status + ", something's gone wroong";
		content = "Something, somewhere, has gone just is a little bit wrong.";
	}
	res.status(status);
	res.render("generic-text", {
		title: title,
		content: content
	});
};
/* GET "Add review" pages*/
module.exports.addReview = function(req, res){
	res.render('location-review-form', { title: 'Add review' });
};