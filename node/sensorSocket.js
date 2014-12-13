var devId='123';
var baud=9600;


var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app, { log: false })
  , fs = require('fs')
  
var serialStatus=false;  
io.set('log level', 1); // reduce logging
  
var SerialPort = require("serialport").SerialPort
  var serialPort = new SerialPort("COM8", {
    baudrate: baud
  });
  
  
 serialPort.on("open", function () 
 {  
    serialStatus=true;
 
    console.log('SER open '+baud);
    serialPort.on('data', function(data) 
    {
      buffRecv(data);
    });  
  
    serialPort.write("ls\n", function(err, results) 
    {
       console.log('READY');
    });  
});
  
app.listen(8080);

/*
	var iObj={ };
  
	iObj.inputId=inputId;
	iObj.inputVal=inputVal;
	
    tmpTxt=tmpTxt+iObj.inputId+"="+iObj.inputVal+"\n";
	sObj.inputData.push(iObj);
*/

var serIn=[];
var serValid=false;
var serOut="";
var sArray=[];

function buffRecv(data)
{
   for(var i=0;i<data.length;i++)
   {


		var cStr=String.fromCharCode(data[i]);
    if(cStr=='[')
      { serOut="[";
        serValid=true;
       }
    else
    if(cStr==']')
      { 
        serOut=serOut+']';
       
        sArray=eval(serOut);
        // console.log("<< "+JSON.stringify(sArray));
         staticSocket.emit('sensor', { nodeStatus: sArray });
       // staticSocket.emit('startup', { nodeStatus: 'ok' });
      }
    else
      { serOut=serOut+cStr; }    
    }
}



function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

var staticSocket;
var statusSocket=0;

function procCmd(data)
{
  
  var cmdStr="!";
  switch((data.name).toLowerCase())
  {
    case 'speed': { cmdStr=cmdStr+'s'; break; }
    case 'turn':  { cmdStr=cmdStr+'t'; break; }
    case 'pan':   { cmdStr=cmdStr+'p'; break; }
    case 'tilt':  { cmdStr=cmdStr+'l'; break; }
    case 'beep':  { cmdStr=cmdStr+'b'; break; }
    case 'devices': { cmdStr=cmdStr+'d'; break; }
    case 'scan': { cmdStr='.'; break; }
  }

  if((data.name).toLowerCase()=='scan')
  {
   

  }
  else
  if((data.name).toLowerCase()!='devices')
  {
    if(data.val<10) { cmdStr=cmdStr+"00"+data.val; }
    else if(data.val<100) { cmdStr=cmdStr+"0"+data.val; }
    else { cmdStr=cmdStr+data.val; }
  }
  else
    { cmdStr=cmdStr+data.val; }
  //console.log(" >> "+JSON.stringify(data)+"   "+cmdStr);
  if(serialStatus==true)
  { serialPort.write(cmdStr); }
  else
  { console.log("  NO SERIAL "); }
}

io.sockets.on('connection', function (socket) 
{
  staticSocket=socket;
  statusSocket=1;
  
  socket.emit('startup', { nodeStatus: 'ok' });
  
  socket.on('msg', function (data) 
  {
    console.log("SEND 'msg'\n"+data);
  });
  
  socket.on('cmd', function (data) 
  {
   	procCmd(data);
  });
  
 
  
  
});