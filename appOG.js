var http = require("http");
var express = require('express');
var app = express();

function insertData() {
    // load the Couchbase driver and connect to the cluster
    var driver = require("couchbase");
    var cb = new driver.Cluster("127.0.0.1:8091");
    var myBucket = cb.openBucket("cbtest");
    var maxdocs = 400000;
    var incnumber = 200000;
    // insert stuff in using the upsert method ()
    while (incnumber < maxdocs) {
        site_id = Math.floor((Math.random() * 100) + 1);
        ticket_id = Math.floor(Math.random() * 10000);
        user_id = Math.floor(Math.random() * 100);
        event_type_id = Math.floor((Math.random() * 10) + 1);
        created_at = new Date();
        var stuffs = {
            "site_id" : site_id,
            "ticket_id" : ticket_id,
            "user_id" : user_id,
            "event_type_id" : event_type_id,
            "created_at" : created_at.toUTCString()
        };
        //console.log("DEBUG:", JSON.stringify(incnumber), ":", JSON.stringify(stuffs));
        myBucket.upsert(JSON.stringify(incnumber), JSON.stringify(stuffs), function (err, result) {
            if (err) {
                console.log("ERR:",err.message);
            }else{
                //console.log("DONE!");
            }
        });
        incnumber++;
    }
    cb.shutdown;
}

function onRequest(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}

app.listen(3000);
insertData();

/*

*/
