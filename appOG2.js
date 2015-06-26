var http = require("http");
var express = require('express');
var app = express();
var lineReader = require('line-reader');
var fs = require('fs');

// load the Couchbase driver and connect to the cluster
var driver = require("couchbase");
var cb = new driver.Cluster("192.168.41.101:8091");
var myBucket = cb.openBucket("DTV");

function insertData() {
    var somevalue = 10; //set to 1000 eventually

    for (var i = 0; i < somevalue; i++) {
        console.log(i);
        // read line by line:
        //lineReader.eachLine('comcast2.json', function (line, last)
        fs.readFile('comcast2.json', 'utf8', function (err,line) {
            if (err) {
                return console.log(err);
            }
            console.log(line);
            // console.log("what is last", last);
            var theRecording;
            var theRecordingID;
            console.log("RAW DATA:", line);
            theRecording = JSON.parse(line);
            theRecordingID = theRecording._irid;
            console.log("THE ID:", theRecordingID);
            delete theRecording._irid;
            // console.log("DEBUG:", stocksid, stocks);
            myBucket.upsert(theRecordingID, JSON.stringify(theRecording), function (err, result) {
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
    };
}

    app.listen(3000);
    insertData();

