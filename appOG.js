var http = require("http");
var express = require('express');
var app = express();
var lineReader = require('line-reader');
var uuid = require('uuid');

//global
var iridArray = [];
var driver = require("couchbase");
var cb = new driver.Cluster("192.168.106.101:8091");
var myBucket = cb.openBucket("recording");
var maxdocs = 5000; // Total number of users
var streamMin = 1;  // Shows Minimum
var streamMax = 10;  // Shows Maximum
var segments = 1800 // Show segments (1 hours recordings)

var incnumber = 0;      // Control loop counter
var segnumber = 0;      // Control loop counter
var streamnumber = 0;   // Control loop counter
/**
 *
 */
IRIDburst(function(err,iridCount){
    if(err){
        console.log(err);
        return;
    }
    if(iridCount){
        console.log("SUCCESS:",iridCount," user Recordings Started.");
        setStream(function(err,resultData){
            if(err){
                console.log(err);
                return;
            }
            if(resultData) {
                console.log("SUCCESS:", resultData," streams are set for recording segments.");
                streamBurst(function(err,resultRecord) {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    if (resultRecord) {
                        console.log("COMPLETE:")
                    }
                })
            }
        })
    }
});

/**
 *
 * @param done
 * @constructor
 */
function IRIDburst(done) {
    for(var i=1;i<=maxdocs;i++){
        start_time = new Date();
        var recordingDoc = {
            "_irid":i,
            "xrid": uuid.v1(),
            "stream_id" : "stream" + randomInt(streamMin,streamMax),
            "isActive" : randomString(5),
            "a8_url" : randomString(15) + "." + randomString(3),
            "start_time" : start_time,
            "end_time" : new Date(start_time + start_time.getMinutes() + 60),
            "erased_time" : start_time + 20000,
            "actual_start_time" : new Date(),
            "actual_end_time" : new Date(start_time + start_time.getMinutes() + 60),
            "batch_id" : "batch" + randomInt(1, 10),
            "error_code" : uuid.v4(),
            "is_timeline" : "false",
            "is_rm_notify" : "false"
        }
        /**
         *
         */
        console.log("  USER IRID:", JSON.stringify(i))
        myBucket.upsert(recordingDoc._irid.toString(), recordingDoc, function (err, newIRID) {
            if (err) {
                console.log("ERR:", err.message);
                done(err,null);
                return;
            }
            if(newIRID){
                incnumber++;
                iridArray.push(recordingDoc._irid);
                if(incnumber==maxdocs){
                    done(null,iridArray.length);
                    return;
                }
            }
        });
    }
}
/**
 *
 * @param done
 */
function setStream(done) {
    var streamDoc = {
        jump_time: null,
        batch_id: Math.floor((Math.random() * 100) + 1),
        active_recordings: null,
        version: uuid.v4(),
        copy_count : "//get from iridArray",
        currentCount : 0
    }
    var curStream=streamMin;
    for (var i = streamMin; i < streamMax+1; i++) {
        console.log("  STREAM: ", i);
        myBucket.upsert("stream"+i, streamDoc, function (err, newStream) {
            if (err) {
                console.log("ERR:", err.message);
                done(err, null);
                return;
            } if (newStream) {
                curStream++;
                if(curStream==streamMax) {
                    done(null, streamMax);
                    return;
                }
            }
        });
    }
}

/**
 *
 * @param resultRecord
 */
function streamBurst(resultRecord) {
    console.log("  STREAM:BURST");
    function segBuilder(i) {
        console.log("  STREAM:BURST:",i);
        if (i < streamMax + 1) {
            buildSegment(i, function (err, segBuilt) {
                if (err) {
                    resultRecord(err, null);
                    return;
                }
                if (segBuilt) {
                    segnumber=0;
                    segBuilder(i + 1);
                }
            });
        }
        else {
            resultRecord(null,streamMax);
        }
    }
    segBuilder(streamMin);
}


/**
 *
 * @param streamID
 * @param done
 */
function buildSegment(streamID,done) {
    console.log("    SEGMENT:STREAM ",streamID,":",segments, " segments");
    for (var j=1; j <=segments; j++) {
        // Current Stream Document
        var currentStream = "stream" + streamID;

        // Create a Segment
        var segmentDoc = {
            segment_num: (randomInt(0, 18446744073709551615)),
            jump_time: null,
            stream_id: currentStream,
            segment: randomString(15) + "." + randomString(3),
            period_first: "na",
            period_current: "na",
            period_last: "na",
            rep_id: "1 Mbps",
            start_time: new Date(),
            duration_pts: 2,
            actual_copy_cnt: "//capture in streamDoc",
            is_archived: "false",
            batch_list: null
        }
        // Insert Segment
        myBucket.upsert(currentStream + "::" + j, segmentDoc, function (err, newSegment) {
            if (err) {
                console.log("ERR:", err.message);
                done(err, null);
                return;
            }
            if (newSegment) {
                segnumber++;
                if(segnumber==segments){
                    console.log("    SEGMENT:STREAM ",streamID,":",segments," built");
                    done(null,segments);
                    return;
                }
            }
        });
    }
}
/**
 *
 * @param hi
 * @returns {number}
 */
function randomNum(hi){
    return Math.floor(Math.random()*hi);
}
/**
 *
 * @returns {string}
 */
function randomChar(){
    return String.fromCharCode(randomNum(100));
}
/**
 *
 * @param length
 * @returns {string}
 */
function randomString(length){
    var str = "";
    for(var i = 0; i < length; ++i){
        str += randomChar();
    }
    return str;
}
/**
 *
 * @param mincount
 * @param maxcount
 * @returns {number}
 */
function randomInt (mincount, maxcount) {
    return Math.floor(Math.random() * (maxcount - mincount) + mincount);
}

app.listen(3000);

