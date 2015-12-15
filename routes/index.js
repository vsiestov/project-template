var express = require('express');
var router = express.Router();
var fs = require('fs');

function addRouter(path, params) {
    var link;

    params.page.name = path;

    if (path === 'index') {
        link = '/';
    } else {
        link = '/' + path;
    }

    router.get(link, function(req, res, next) {
        res.render(path, params, function (err, html) {
            if (err) {
                throw err;
            }

            res.send(html);
        });
    });
}

fs.readFile('pages.json', function (err, data) {
    var json,
        item;

    if (err) {
        throw err;
    }

    json = JSON.parse(data);

    for (item in json) {

        if (json.hasOwnProperty(item)) {
            addRouter(item, json[item]);
        }

    }

});

//
//router.post('/server/post-request.html', function (req, res, next) {
//
//    setTimeout(function () {
//        try {
//            res.sendFile(__dirname.replace('routes', '') + 'public/server/post-request.html');
//        } catch (e) {
//            console.log(e);
//        }
//    }, 1000);
//
//});

module.exports = router;
