  
  var socket = io.connect('http://10.0.0.2:8080');
   
  socket.on('startup', function (data) 
  {
     console.log("RECV 'startup' "+JSON.stringify(data));
     var scope = angular.element($("#viewDrive")).scope();
     scope.startHeartbeat();
  });
  
  socket.on('sensorAck', function (data) 
  {
    console.log("RECV 'sensorAck' "+JSON.stringify(data));
  });
  
  socket.on('sensor', function (data)
  { 
     var scope = angular.element($("#viewDrive")).scope();
     scope.setSensors(data.nodeStatus);
  });
  
  function reqSensor()
  {
    console.log("SEND 'reqSensor'\n");
    socket.emit('reqSensor',{ msgData: 'status' });
  }

  function socketSend(sObj)
  {
    socket.emit('cmd',sObj );
  }
