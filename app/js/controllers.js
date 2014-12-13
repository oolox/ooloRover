'use strict';

/* Controllers */

angular.module('oobApp.controllers', ['ngTouch']).
  controller('driveCtrl', ['$scope', function($scope)  
  {
    $scope.clickX=0;
	$scope.clickY=0;
	$scope.status = oobStatus;
    $scope.sensors = oobSensors;
    $scope.motors = oobMotors;
    $scope.devices= oobDevice;
	$scope.hbCount=0;
	
	$scope.lastStatus={};

	$scope.scanR=0;
	$scope.clicked=false;
	$scope.pClicked=false;
	$scope.speedVector=0;
	$scope.lastStatus.motors=$scope.motors;
	$scope.lastStatus.sensors=$scope.sensors;
	$scope.lastStatus.devices=$scope.devices;
	$scope.lastSend={};
	$scope.beepVal=Math.floor(Math.random() * 1000);

	$scope.startHeartbeat=function()
	{
	  hbStart=true; 
	  $scope.sendDevices();

	  $scope.hbTimeout=setInterval(function() {
	  	$scope.procHb();
		$('#oobStatus').css('backgroundColor','#009900');
		$('#heartBeat').css('backgroundColor','black')

	  }, 50);
	}
/*
	$( "#compass" ).mousemove(function( event ) {
		var msg = "Handler for .mousemove() called at ";
		msg += event.offsetX + ", " + event.offsetY;
		console.log(msg);
		 $('#nav_point').attr('cx', event.offsetX);
		  $('#nav_point').attr('cy', event.offsetY);
	});
	*/
	
	$scope.sendDevices=function()
	{
		var oObj={};
		var oStr="";

		for(var i=0;i<3;i++)
		{
			if($scope.devices[i].val=='ON')
				{ oStr=oStr+"1"; }
			else
				{ oStr=oStr+"0"; }
		}
		oObj.name="devices";
		oObj.val=oStr;
		
		$scope.nodeSend(oObj);
	}
	
	$scope.toggleDevice=function(id)
	{
		if($scope.devices[id].val=='ON')
		{ $scope.devices[id].val='OFF'; }
		else
		{ $scope.devices[id].val='ON'; }
		$scope.sendDevices();
	}

	$scope.makeBeep=function()
	{
		$scope.beepVal=Math.floor(Math.random() * 999);
		var oObj={};
		oObj.name="beep";
		oObj.val=$scope.beepVal;
		
		$scope.nodeSend(oObj);

	}

	$scope.sendScan=function()
	{
		
		$scope.nodeSend({"name":"scan","val":"1"});

	}

	$scope.setSensors=function(sArray)
	{ //console.log("<<< setSensors <<< "+JSON.stringify(sArray)); 

	  for(var i=0;i<5;i++)
	  {
	  	$scope.sensors[i].val=sArray[i];
	  }
	  $scope.$apply();
	}
	
	$scope.procHb=function()
	{    
	    $scope.hbCount++;
		$('#heartBeat').html($scope.hbCount);

	  	if(($scope.hbCount % 2)==0)
		{ $scope.sendScan(); }

			

		for(var i=0;i<4;i++)
		{	if($scope.motors[i].val!=$scope.lastStatus.motors[i].val)
			{
			  $scope.nodeSend($scope.motors[i]);
			}   
	    }
	     $scope.lastStatus.motors = jQuery.extend(true, {}, $scope.motors);
	}
	
	$scope.nodeSend=function(mObj)
	{
		var oObj={};
		oObj.name=mObj.name;
		oObj.val=""+mObj.val;
		oObj.hb=""+$scope.hbCount;
		//console.log(">>> nodeSend >>> "+JSON.stringify(oObj));
		$scope.lastSend=oObj;
		socketSend(oObj);
	}
	
	
	$scope.setMotor=function(mId,mIn)
	{
		if(mIn>1) { mIn=1; }
		if(mIn<-1) { mIn=-1; }
		var mVal;
		
		
		if(mId==1 || mId==3)
			{ mVal=90-(mIn*($scope.motors[mId].range)); }
		else
			{ mVal=90+(mIn*($scope.motors[mId].range)); }
		if(mId==3)
		{
			mVal=mVal+10;
		}
		$scope.motors[mId].val=Math.floor(mVal);
		$scope.updateDisplays();

		return mVal;
	}

	$scope.updateDisplays=function(event)
	{

	  for(var mId=0;mId<4;mId++)
		  {
		  	if(mId==1 || mId==3)
		  	{ $scope.motors[mId].displayVal=( 90-$scope.motors[mId].val); }
		    else
		    { $scope.motors[mId].displayVal=( $scope.motors[mId].val)-90; }
			if(mId==3)
			{ $scope.motors[mId].displayVal+=10; }
				
		  }
	}

	$scope.stopMotors=function(event)
	{
	 	
		$scope.setMotor(0,0);
		  $scope.setMotor(1,0);
		  $('#nav_point').attr('cx', 150);
		  $('#nav_point').attr('cy', 150);
		  $scope.updateDisplays();
	}
	
	$scope.centerPanTilt=function(event)
	{
	 	
		  $scope.setMotor(2,0);
		  $scope.setMotor(3,0);
		  $('#nav_pantilt').attr('cx', 150);
		  $('#nav_pantilt').attr('cy', 150);
		  $scope.updateDisplays();
	}

	$scope.compassDown=function(event)
	{
		$scope.compassMove(event);
		$scope.clicked=true;
	}
	
	$scope.compassUp=function(event)
	{ $scope.compassMove(event);
	  $scope.clicked=false;
	}

	$scope.panTiltMove=function(event)
	{
	

	  if($scope.pClicked)
	  {
		$scope.axisX=event.offsetX-150;
		$scope.axisY=150-event.offsetY;
		$scope.posX=event.offsetX;
		$scope.posY=event.offsetY;
	
		//$scope.speedVector=Math.sqrt((($scope.axisX)*($scope.axisX)) + (($scope.axisY)*($scope.axisY)));
		

		if($scope.axisX<=140)
		{
		  $scope.setMotor(2,$scope.axisX/140);
		  $('#nav_pantilt').attr('cx', $scope.posX);
		}
		if($scope.speedVector<=135)
		{
		  $scope.setMotor(3,$scope.axisY/140);
		  $('#nav_pantilt').attr('cy', $scope.posY);
		}
		$scope.updateDisplays();
	  }

	}

	$scope.panTiltDown=function(event)
	{
		$scope.panTiltMove(event);
		$scope.pClicked=true;
	}
	
	$scope.panTiltUp=function(event)
	{ $scope.panTiltMove(event);
	  $scope.pClicked=false;
	}



	$scope.deviceStyle = function(dId) 
	{
			if($scope.devices[dId].val=='ON')
				{ return  { color:"white" , backgroundColor: "#aa0000" }; }
			else
			    { return  { color:"#660000" ,backgroundColor: "#110000" }; }
	}
	
	$scope.setTurnRange=function()
	{ 
		console.log("<setTurnRange>");

	}

	$scope.compassMove=function(event)
	{
	  if($scope.clicked)
	  {
		$scope.axisX=event.offsetX-150;
		$scope.axisY=150-event.offsetY;
		$scope.posX=event.offsetX;
		$scope.posY=event.offsetY;
		

		
		if(($scope.axisY>-15 && $scope.axisY<15) && ($scope.axisX>-15 && $scope.axisX<15))
			{ 
			  $scope.posX=150;  
			  $scope.axisX=0;
			  $scope.posY=150;
			  $scope.axisY=0;
			}
	   
		$scope.speedVector=Math.sqrt((($scope.axisX)*($scope.axisX)) + (($scope.axisY)*($scope.axisY)));
		
		if($scope.speedVector<=135)
		{
		  $scope.setMotor(0,$scope.axisY/130);
		  $scope.setMotor(1,$scope.axisX/130);
		  $('#nav_point').attr('cx', $scope.posX);
		  $('#nav_point').attr('cy', $scope.posY);
		  $scope.updateDisplays();
		}
	  }
	}
  }])
  .controller('statusCtrl', ['$scope', function($scope) 
  {
    $scope.status = oobStatus;
    $scope.sensors = oobSensors;
    $scope.motors = oobMotors;
    $scope.devices= oobDevice;
  }]);
  