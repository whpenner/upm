/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/*
 * Author: Jon Trulson <jtrulson@ics.com>
 * Copyright (c) 2016 Intel Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


var sensorObj = require('jsupm_tb7300');


/************** Main code **************/

// You will need to edit this example to conform to your site and your
// devices, specifically the Device Object Instance ID passed to the
// constructor, and the arguments to initMaster() that are
// appropriate for your BACnet network.

var defaultDev = "/dev/ttyUSB0";

// if an argument was specified, use it as the device instead
if (process.argv.length > 2)
{
    defaultDev = process.argv[2];
}

console.log("Using device " + defaultDev);
console.log("Initializing...");

// Instantiate an TB7300 object for an TB7300 device that has 73001
// as it's unique Device Object Instance ID.  NOTE: You will
// certainly want to change this to the correct value for your
// device(s).
var sensor = new sensorObj.TB7300(73001);

// Initialize our BACnet master, if it has not already been
// initialized, with the device and baudrate, choosing 1000001 as
// our unique Device Object Instance ID, 2 as our MAC address and
// using default values for maxMaster and maxInfoFrames
sensor.initMaster(defaultDev, 38400, 1000001, 2);

// Uncomment to enable debugging output
// sensor.setDebug(true);

console.log("");
console.log("Device Name:", sensor.getDeviceName());
console.log("Device Description:", sensor.getDeviceDescription());
console.log("Device Location:", sensor.getDeviceLocation());
console.log("");

console.log("Fan Mode:",
            sensor.getMultiStateValueText(sensorObj.TB7300.MV_Fan_Mode));
console.log("Fan Status:",
             sensor.getMultiStateValueText(sensorObj.TB7300.MV_Fan_Status));
console.log("System Mode:",
            sensor.getMultiStateValueText(sensorObj.TB7300.MV_System_Mode));
console.log("Service Alarm:",
            sensor.getBinaryInputText(sensorObj.TB7300.BI_Service_Alarm));
console.log("");

// update and print the room temperature every 5 seconds
setInterval(function()
{
    // update our values
    sensor.update();

    // we show both C and F for temperature
    console.log("Temperature:", sensor.getTemperature(),
                "C /", sensor.getTemperature(true), "F");
    console.log("");

}, 5000);


process.on('SIGINT', function()
{
    sensor = null;
    sensorObj.cleanUp();
    sensorObj = null;
    console.log("Exiting...");
    process.exit(0);
});
