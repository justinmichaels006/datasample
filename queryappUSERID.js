/**Created by justin*/
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
    var EventQuery = ViewQuery.from('events', 'eventtype').reduce(true).id_range(start = [9,0,[2014,12,3,0,0,0]], end = [9,100,[2014,12,3,24,0,0]], inclusive_end = true).group(2);
    //EventQuery.reduce(true);
    //EventQuery.stale = "ok";
    //EventQuery.startkey = [9,0,[2014,12,3,0,0,0]];
    //EventQuery.endkey = [9,100,[2014,12,3,24,0,0]];
    //EventQuery.group_level = 2;
    //EventQuery.inclusive_end = true;

    console.log("query is ...", EventQuery);
    myBucket.query(EventQuery, function(err, resulting) {
        for(j in resulting) {
            console.log(resulting[j]);
        }
    });
    /*        myBucket.get(JSON.stringify(stocksid), function (err, result) {
     if (err) {
     console.log("ERROR:", err.message);
     } else {
     console.log("GOTIT", result);
     }
     });*/
    cb.shutdown;
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
