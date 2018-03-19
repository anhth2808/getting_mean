var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

var theEarth = (function() {
    var earthRadius = 6371; // km, miles is 3959

    var getDistanceFromRads = function(rads) {
        return parseFloat(rads * earthRadius);
    };
    var getRadsFromDistance = function(distance) {
        return parseFloat(distance / earthRadius);
    };

    return {
        getRadsFromDistance: getDistanceFromRads,
        getDistanceFromRads: getRadsFromDistance
    };
})();

module.exports.locationsListByDistance = function(req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    var geoOptions = {
        spherical: true,
        maxDistance: theEarth.getRadsFromDistance(20),
        num: 10
    }

    if (!lng || !lat) {
        sendJsonResponse(res, 404, {
            "message": "lng or lat query prameters are required!"
        });
        return;
    }

    Loc.geoNear(point, geoOptions, function(err, results, stats) {
        var locations = [];
        // console.log("length:", results);
            if (err) {
                sendJsonResponse(res, 404, err);
            } else {
                results.forEach(function(doc) {
                    locations.push({
                        distance: theEarth.getDistanceFromRads(doc.dis),
                        name: doc.obj.name,
                        address: doc.obj.address,
                        rating: doc.obj.rating,
                        facilities: doc.obj.facilities,
                        _id: doc.obj._id
                    });
                });
                sendJsonResponse(res, 200, locations);                        
            }
    });
};


module.exports.locationsCreate = function(req, res) {
    sendJsonResponse(res, 200, {"status": "success"});
};

module.exports.locationsReadOne = function(req, res) {
    if (req.params && req.params.locationid) {
        Loc
            .findById(req.params.locationid)
            .exec(function(err, location) {
                if (!location) {
                    sendJsonResponse(res, 400, {
                        "message": "location is no found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, location);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No locationid in request"
        });
    }
};


module.exports.locationsUpdateOne = function(req, res) {
    sendJsonResponse(res, 200, {"status": "success"});
};
module.exports.locationsDeleteOne = function(req, res) {
    sendJsonResponse(res, 200, {"status": "success"});
};

