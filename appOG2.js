var http = require("http");
var express = require('express');
var app = express();
var lineReader = require('line-reader');
var fs = require("fs");

// load the Couchbase driver and connect to the cluster
var driver = require("couchbase");
var cb = new driver.Cluster("127.0.0.1:8091");
var myBucket = cb.openBucket("cbtest");

function insertData() {
    var somevalue = 2;

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
            fs.appendFile('stockids.txt', JSON.stringify(stocksid) + "\n", function (err) {
                if (err) {
                    console.log("ERR:", err.message);
                }
                });
            // console.log("THE ID:", stocksid);
            delete stocks._id;
            // console.log("DEBUG:", stocksid, stocks);
            myBucket.upsert(JSON.stringify(stocksid), JSON.stringify(stocks), function (err, result) {
                if (err) {
                    console.log("ERR:", err.message);
                } else {
                    //console.log("DONE!");
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

