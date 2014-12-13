'use strict';

console.log("<oobGlobals.js> init");
var hbStart=false;

var oobSensors= [ 
	{ "name":"IR Rear" 	, "val":"0" , "trigger":"200" }, 
	{ "name":"IR Front" , "val":"0" , "trigger":"200" },
	{ "name":"Sonar" 	, "val":"0" , "low":"0", "high":"255" },
	{ "name":"Heading" 	, "val":"0" , "low":"0", "high":"360" },
	{ "name":"Whisker Left" 	, "val":"0" , "low":"0", "high":"1" },
	{ "name":"Whisker Right" 	, "val":"0" , "low":"0", "high":"1" }
];

var oobMotors=[
	{ "name":"Speed" 	, "val":"90" , "range":"30" , "displayVal":"0" }, 
	{ "name":"Turn" 	, "val":"90" , "range":"30" , "displayVal":"0" },
	{ "name":"Pan" 		, "val":"90" , "range":"90" , "displayVal":"0" }, 
	{ "name":"Tilt" 	, "val":"90" , "range":"30" , "displayVal":"0" }	
	
	
];

var oobDevice=[
	{ "name":"Laser" 	, "val":"OFF" }, 
	{ "name":"Spot"		, "val":"OFF" },
	{ "name":"Scan" 	, "val":"ON" }
	
	
];

var oobStatus='startup';
