var http = require("http");
var express = require('express');
var app = express();
var lineReader = require('line-reader');

// load the Couchbase driver and connect to the cluster
var driver = require("couchbase");
var cb = new driver.Cluster("192.168.67.101:8091");
var myBucket = cb.openBucket("taxreturn");

function insertData() {
    var somevalue = 100;

    for (var i = 0; i < somevalue; i++) {
        console.log(i);
        // read line by line:
        lineReader.eachLine('stocks.json', function (line, last) {
            // console.log("what is last", last);
            var stocks;
            var stocksid;
            // console.log("RAW DATA:", line);
            stocks = JSON.parse(line);
            stocksid = stocks._id;
            // console.log("THE ID:", stocksid);
            delete stocks._id;
            // console.log("DEBUG:", stocksid, stocks);
            myBucket.upsert(JSON.stringify(stocksid), JSON.stringify(stocks), function (err, result) {
                if (err) {
                    console.log("ERR:", err.message);
                } else {
                    console.log("DONE!");
                }
            });
            if (last) {
                return false; // stop reading
            }
        });
    }
}

    app.listen(3000);
    insertData();

