var stream = require('stream');
var filter = require("through2-filter");
var split = require('split');
var IotfDevice = require("ibmiotf").IotfDevice;
var client;
var startTime;

var skip = function (interval) {
    return filter(function () {
        var currentTime = new Date();
        startTime = currentTime - startTime > interval ? currentTime : startTime;
        return startTime === currentTime;
    });
};

var publish = new stream.Writable() || require('readable-stream').Writable;
publish._write = function (buf, _, done) {
    client.publish("status", "json", JSON.stringify({
        d: JSON.parse(buf.toString()),
        ts: new Date().toISOString()
    }));
    done();
};

module.exports = function (path, config, interval) {

    if (path) {
        config = IotfDevice.parseConfigFile(path);
    }

    client = new IotfDevice(config);

    client.connect();

    client.on("connect", function () {

        startTime = new Date();
        process.stdin
            .pipe(split())
            .pipe(skip(interval))
            .pipe(publish);

    });

};