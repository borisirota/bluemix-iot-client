var stream = require('stream');
var filter = require("through2-filter");
var split = require('split');
var IotfDevice = require("ibmiotf").IotfDevice;
var client;
var startTime;

var checksum = function (s) {
    var i, cs = 0;
    for (i = 0; i < s.length; i++) {
        cs += (s.charCodeAt(i) * (i + 1));
    }
    return cs;
};

var skipIfDataCorrupted = filter(function (buf) {
    input = buf.toString().split('|');
    return checksum(input[0]).toString() === input[1];
});

var skipIfTooSoon = function (interval) {
    return filter(function () {
        var currentTime = new Date();
        startTime = currentTime - startTime > interval ? currentTime : startTime;
        return startTime === currentTime;
    });
};

var publishToBluemix = new stream.Writable() || require('readable-stream').Writable;
publishToBluemix._write = function (buf, _, done) {
    client.publish("status", "json", JSON.stringify({
        d: JSON.parse(buf.toString().split('|')[0]),
        ts: new Date().toISOString()
    }));
    done();
};

module.exports = function (path, interval, isChecksum) {

    client = new IotfDevice(IotfDevice.parseConfigFile(path));
    client.connect();
    client.on("connect", function () {
        startTime = new Date();
        var pipe = process.stdin
            .pipe(split());
        if (isChecksum) {
            pipe = pipe.pipe(skipIfDataCorrupted);
        }
        pipe.pipe(skipIfTooSoon(interval))
            .pipe(publishToBluemix);
    });

    process.on("SIGINT", function() {
        client.disconnect();
        process.exit();
    });

};