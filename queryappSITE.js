/**
 * Created by justin on 11/13/14.
 */
var http = require("http");
var express = require('express');
var app = express();
var lineReader = require('line-reader');

function viewData() {
    // load the Couchbase driver and connect to the cluster
    var driver = require('couchbase');
    var cb = new driver.Cluster("127.0.0.1:8091");
    var myBucket = cb.openBucket("cbtest");

    var ViewQuery = driver.ViewQuery;
    var EventQuery = ViewQuery.from('site', 'sitelocation').range(start = [81], end = [82]).stale(2);

    console.log("query is ...", EventQuery);
    var stamp1 = new Date();
    console.log(stamp1);

    myBucket.query(EventQuery, function(err, resulting) {
        if (err) {
            console.log("query failed", err);
            return;
        }
        console.log("success!", resulting);
        var stamp2 = new Date();
        console.log(stamp2);
        console.log("it took", stamp2 - stamp1);
    });
/*            myBucket.get((resulting[j].id), function (err, result) {
                if (err) {
                    console.log("ERROR:", err.message);
                } else {
                    console.log("the doc", result.value);
                }
            });*/
}

function onRequest(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
}
function myCallback() {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Thanks for waiting!\n');
    response.end();
}
app.listen(3000);
viewData();
