var http = require("http");
var express = require('express');
var app = express();
var lineReader = require('line-reader');

function insertData() {
    // load the Couchbase driver and connect to the cluster
    var driver = require("couchbase");
    var cb = new driver.Cluster("127.0.0.1:8091");
    var myBucket = cb.openBucket("cbtest");
    var maxdocs = 1000000;
    var incnumber = 950000;
    var minnum = 0;
    var maxnum = 13513;

        while (incnumber < maxdocs) {
            site_id = Math.floor((Math.random() * 100) + 1);
            ticket_id = Math.floor(Math.random() * 10000);
            user_id = Math.floor(Math.random() * 100);
            event_type_id = Math.floor((Math.random() * 10) + 1);
            assest_id = randomInt(maxnum, minnum);
            event_description = randomString(128); //128 length string
            created_at = new Date();
            var stuffs = {
                "site_id":site_id,
                "ticket_id":ticket_id,
                "user_id":user_id,
                "event_type_id":event_type_id,
                "created_at":created_at.toUTCString(),
                "assest_id":assest_id,
                "description":event_description
            };
            //console.log("DEBUG:", JSON.stringify(incnumber), ":", JSON.stringify(stuffs));
            myBucket.upsert(JSON.stringify(incnumber), JSON.stringify(stuffs), function (err, result) {
                if (err) {
                    console.log("ERR:", err.message);
                } else {
                    //console.log("DONE!");
                }
            });
            incnumber++;
        }
    cb.shutdown;
}

function randomNum(hi){
    return Math.floor(Math.random()*hi);
}
function randomChar(){
    return String.fromCharCode(randomNum(100));
}
function randomString(length){
    var str = "";
    for(var i = 0; i < length; ++i){
        str += randomChar();
    }
    return str;
}
function randomInt (mincount, maxcount) {
    return Math.floor(Math.random() * (maxcount - mincount) + mincount);
}

app.listen(3000);
insertData();

/*

*/