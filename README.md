## Install

`npm install -g bluemix-iot-client`  
`bluemix-iot-client -h`

## Description

This is a client that represent generic iot device which sends data to bluemix.
It reads the standard input and sends it to the bluemix cloud.
The data is expected to be in JSON format. For example `"{\"temperature\": 31.59, \"airFlow\": 0}"`

It has 2 modes:  
1. send the data as is.  
2. checksum the data. In this case the data expected to be in the following format: `JSON_STRING|CHECKSUM`. In this mode, the data is being checked with the checksum and only the data part (JSON_STRING) is being sent to the cloud (exactly as in the first mode).  

The checksum algorithm (in javascript):
```javascript
function checksum (s) {
    var i, cs = 0;
    for (i = 0; i < s.length; i++) {
        cs += (s.charCodeAt(i) * (i + 1));
    }
    return cs;
}
```

## Command line argumets:

* `-p` or `--path` - config file path (required) - absolute path to config file of the device. check the format [here](https://docs.internetofthings.ibmcloud.com/nodejs/node-js_devices.html#/using-a-configuration-file#using-a-configuration-file)
* `-i` or `--interval` - interval between publishes. the default is 1000.
* `-c` or `--checksum` - checksum - mode 1 or 2 as explained above. the default is false.

## Usage

There are 2 main usages that this module can be helpful:

* Reading device data from serial port and uploading it to the bluemix cloud. For example, arduino client that reads sensor data and writes it as JSON to the serial port (in this case the client should send the data with the checksum).
In addition, there in a need to use the serialport module:
    - `npm install -g serialport`
    - `serialportlist` - lists the serial ports. Look for the the Arduino one.
    - `serialportterm -h`
    - `serialportterm -p /dev/cu.usbmodemfa131 --baud 115200 | bluemix-iot-client -p /Users/demo/Desktop/config/device.cfg --checksum`

* Reading data from the standard output of another program Running on the same computer. For example, device which connects to raspberrypi2 and has special libraries in different language (e.g. python). So in order not to implement the same client again in another laguange, its possible to output the device data in JSON format to the standard output.  
In this example, [node should be installed](https://learn.adafruit.com/node-embedded-development/installing-node-dot-js) on the raspberrypi2 and the bluemix-iot-client can read the data and send to bluemix cloud (no need to checksum):
`read_sensor_data_and_send_it_as_JSON_to_standard_output | bluemix-iot-client -p /Users/demo/Desktop/config/device.cfg`