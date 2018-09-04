let time,inter,mj,marker1,flightPath,flightPath1,mlat,mlng,maps1,mlatln,mlatln1,act,ilu,coords,naam,memail,mname,names1,pids1,w,names,ids,pids,lats,longs,myLatLng,maps,marker,trafficLayer,busno,deviceId,adeviceId,name,cschool,cid,m,interval,bool,tt=1,mt=1,fg,lg,ids1,h,infowindow;

(function ($) {
	
    // USE STRICT
    "use strict";
    $(".animsition").animsition({
      inClass: 'fade-in',
      outClass: 'fade-out',
      inDuration: 900,
      outDuration: 900,
      linkElement: 'a:not([target="_blank"]):not([href^="#"]):not([class^="chosen-single"])',
      loading: true,
      loadingParentElement: 'html',
      loadingClass: 'page-loader',
      loadingInner: '<div class="page-loader__spin"></div>',
      timeout: false,
      timeoutCountdown: 5000,
      onLoadEvent: true,
      browser: ['animation-duration', '-webkit-animation-duration'],
      overlay: false,
      overlayClass: 'animsition-overlay-slide',
      overlayParentElement: 'html',
      transition: function (url) {
        window.location.href = url;
      }
    });
	ilu=0;
	time=1600;
	act=new Array();
     setTimeout(window.history.forward(),0);
	$(document).keydown(function(event) {
     if (event.keyCode == 27) {
             $(".btn-outline-danger").click();
      }
    });
	coords=new Array();
	busno=new Array();
	adeviceId=new Array();
	names=new Array();
	names1=new Array();
	pids1=new Array();
	let m=JSON.parse($(".invisible").html());
	let n=JSON.parse(JSON.stringify(m.buses));
	w=$(".invisible1").html().split(",");
    mname=JSON.parse($(".invisible").html()).username;
	memail=JSON.parse($(".invisible").html()).emailAddress;
	naam=JSON.parse($(".invisible").html()).name;
	let nt=$(".invisible2").html();
	
	nt.split(",").forEach((val)=>{
	  if(val.length!=0){
	   names.push(val);
	  }
	});
	n.forEach((val,index)=>{
	      busno.push(val.busNumber);
		if(val.deviceName!=0){
		  adeviceId.push(val.deviceName);
		}
	});	
	
	ids=new Array();
	pids=new Array();
	
	$.ajax({
       url:"http://35.200.152.63/api/positions",
	   crossDomain: true,
	   headers: {
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),

		  "Accept":"application/json"
       },
       type:"GET",
	   xhrFields: {
        withCredentials: true
       },
       success:(res)=>{
		    JSON.parse(JSON.stringify(res)).forEach((val)=>{
            let v=JSON.parse(JSON.stringify(val));
            ids.push(v.deviceId);
			pids.push(v.id);
		  });
		  $("#cid").empty();
		  $("#cid1").empty();
		   $.ajax({
             url:"http://35.200.152.63/api/devices",
	         crossDomain: true,
	         headers: {
               "Authorization": "Basic " + btoa("admin:Girlneeds@")

             },
             type:"GET",
	         xhrFields: {
              withCredentials: true
             },
             success:(res1)=>{
			    let n1=new Array();
				let p1=new Array()
			   JSON.parse(JSON.stringify(res1)).forEach((val)=>{
                 let v=JSON.parse(JSON.stringify(val));
                 n1.push(v.name);
				 p1.push(v.positionId);
			   });
		       if(adeviceId.length==0){
	            $("#cid").append("<option value=\"\">No any devices found </option>");
				$("#cid1").append("<option value=\"\">No any devices found </option>");
	          }else{
               adeviceId.forEach((val,index)=>{
			     let ry=ids[pids.indexOf(p1[n1.indexOf(val)])];
		          $("#cid").append("<option value=\""+ry+"\">"+val+"</option>");
				  $("#cid1").append("<option value=\""+ry+"\">"+val+"</option>");
	           });
           }
		},error:(err1)=>{
		}
	  })
	   },
	   error:(err)=>{
	  }
	});

    
	if(names.length==0){
	   $("#did").append("<option value=\"\">No any devices available for assigning</option>");
	}else{
	
	  for(let i=0;i<names.length;i++){
	    $("#did").append("<option value=\""+names[i]+"\">"+names[i]+"</option>");
	  }
	}
	//m=0;
	

  })(jQuery);

(function ($) {
  "use strict";
  try {
    var map = $('#map');
    if(map[0]) {
	$.ajax({
       url:"http://35.200.152.63/api/positions",
	   headers: {
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),

		  "Accept":"application/json"
       },
	   crossDomain: true,
       type:"GET",
	   xhrFields: {
        withCredentials: true
       },
       success:(res)=>{
		    JSON.parse(JSON.stringify(res)).forEach((val)=>{
            let v=JSON.parse(JSON.stringify(val));
        });
       },
	   error:(err)=>{
		  $("#cid").empty();
		  $("#cid").append("<option value=\"\">Server seems to be not working</option>");
	   }
	 });


	  if(busno.length!=0){
	   showmapnow();
	   mapagain();
	   mapit();
	   /*$(".schooln").change(()=>{
			mapit();
	   });
	   $(".busn").change(()=>{
			mapit();
	   });*/
	  }else{
	    map.empty();
	    map.html("<p style=\"margin-top:200px\">No any buses found for tracking</p>");
	  }
    }
  } catch (error) {
    console.log(error);
  }


})(jQuery);



function seeplayback(){
  let data="http://35.200.152.63/api/reports/route?"
  data+="deviceId="+$("#cid1").val()+"&";
  data+="from="+$("#date11").val().split("-").reverse().join("-")+"&";
  data+="to="+$("#date12").val().split("-").reverse().join("-");
  $('#cover').show();
  mlatln=new Array();
  mlatln1=new Array();
  mj=0;
  $.ajax({
       url:data,
	   crossDomain: true,
	   headers: {
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),

		  "Accept":"application/json"
       },
       type:"GET",
	   xhrFields: {
        withCredentials: true
       },
       success:(res)=>{
		  $('#cover').hide();
		  $("#myRange").val(1);
		  if(res.length==0){
		   $("#addy1").css("height","500px");

		   $("#erru11").css("display","block");
		  }else{
		   mlat=0;
		   mlng=0;
		   res.forEach((val)=>{    
			  let data={};
			  data["lat"]=parseFloat(val.latitude);
			  data["lng"]=parseFloat(val.longitude);
		      mlat+=data["lat"];
			  mlng+=data["lng"];
			  mlatln.push(data);
		   });
		   mlat=mlat/mlatln.length;
		   mlng=mlng/mlatln.length;
		   let lm=new Set(mlatln.map( e=>JSON.stringify(e)));
		   mlatln=Array.from(lm).map(e=>JSON.parse(e));
			redoit();
		   $(".selectors1").hide();
		   $(".controls").show();
		   $(".results1").show();
		   $("#mgg_but1").show();
		  }
	   },
	   error:(err)=>{
		  $("#cover").hide();
		  $("#addy1").css("height","500px");
		  $("#erru11").css("display","block");

	   }
  });
}

function redoit(){
  mlatln1=new Array();
  mj=0;
  if(marker1!=undefined){
     marker1.setMap(null);
  }
  if(inter!=undefined){
     clearTimeout(inter);
  }
  if(flightPath1!=undefined){
    flightPath1.setMap(null);
	flightPath1=null;
 }
 maps1 = new google.maps.Map(document.getElementById('map_canvas'), {

             zoom: 15,
             zoomControlOptions: {
               position: google.maps.ControlPosition.LEFT_CENTER
              },
               streetViewControl:false
  });
  
  $(".fa-play-circle").show();
  $(".fa-pause").hide();
  maps1.setCenter(new google.maps.LatLng(mlat, mlng));
  flightPath = new google.maps.Polyline({
             path: mlatln,
             geodesic: true,
             strokeColor: '#FF0000',
             strokeOpacity: 1.0,
             strokeWeight: 2
   });
   flightPath.setMap(maps1);
}

function changespeed(val){
  time=1600-100*val;
}

document.getElementById('myRange').addEventListener('mousemove', function(e) {
  hover(e);
});

function hover(e){

  let m=Math.floor(( e.clientX- e.target.clientWidth) / (parseInt(e.target.getAttribute('max'),10)+3));
  if(m==0){
    m=1;
  }
  $("#myRange").attr("title",m+"X");
}

function startsee(){
  $(".fa-pause").show();
  $(".fa-play-circle").hide();
  if(flightPath!=undefined){
    flightPath.setMap(null);
    flightPath=null;
  }
  mlatln1.push(mlatln[mj]);
  mj++;
  maps1.setCenter(mlatln1[mlatln1.length-1]);
  if(marker1!=undefined){
     marker1.setMap(null);
  }
  marker1 = new SlidingMarker({
	    position:mlatln1[mlatln1.length-1],
		icon:'/images/icon/bus.png'
  });
  marker1.setMap(maps1);
  if(mlatln.length==1){
    mc("The bus has been stationary within the provided date range"); 
  }else{
    moveit();
  }
}

function moveit(){
  mlatln1.push(mlatln[mj]);
  mj++;
  flightPath1 = new google.maps.Polyline({
             path: mlatln1,
             geodesic: true,
             strokeColor: '#FF0000',
             strokeOpacity: 1.0,
             strokeWeight: 2
   });
   flightPath1.setMap(maps1);
   marker1.setPosition(mlatln1[mlatln1.length-1]);
   maps1.setCenter(mlatln1[mlatln1.length-1]);
   if(mj!=mlatln.length-1){
	 inter=setTimeout(()=>{
	  moveit();
	 },time);
   }else{
     if(inter!=undefined){
       clearTimeout(inter);
     }
	  mc("Playback over");
   }
}

function mc(a){
  let infowindow1 = new google.maps.InfoWindow();
  infowindow1.setContent(a);
  infowindow1.open(maps1,marker1);
}

function stopsee(){
  $(".fa-play-circle").show();
  $(".fa-pause").hide();
  clearTimeout(inter);
  //mlatln1=new Array(); //later manage
}


function bgagain(){
   $(".results1").hide();
   $("#mgg_but1").hide();
   $(".controls").hide();
   $(".selectors1").show();
   $("#erru11").hide();
   $("#erru12").hide();
}


function downloadreport(){
    let data="http://35.200.152.63/api/reports/";
	data+=$("#rid").val()+"?";
	data+="deviceId="+$("#cid").val()+"&";
	data+="from="+$("#date").val().split("-").reverse().join("-")+"&";
	data+="to="+$("#date1").val().split("-").reverse().join("-");
 $('#cover').show();
  $.ajax({
       url:data,
	   crossDomain: true,
	   headers: {
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),

		  "Accept":"application/json"
       },
       type:"GET",
	   xhrFields: {
        withCredentials: true
       },
       success:(res)=>{
		   $('#cover').hide();
		   $("#erru").css("display","none");
		   if(res.length==0){
		     $("#erru1").show();
		   }else{
			 $("#erru1").hide();
		    $.post("/csv",{data:JSON.stringify(res)}).then((response)=>{
				window.location.href="/data/report.csv";
			});
		   }
	   },
	   error:(err)=>{
		   $("#cover").hide();
		  $("#addy").css("height","500px");
		  $("#erru").css("display","block");
	   }
	});
}

function sagain(){
  $("#erru").css("display","none");
  $(".selectors").show();
  $(".results").hide();
  $(".t1").empty();
  $(".t1").html("<i class=\"zmdi zmdi-map\"></i>Reports");
  $("#erru").hide();
  $("#erru1").hide();
}


function csvparent(){
   $("#csvpt").click();
}

$('#csvpt').change(function() {
	let fd=new FormData();
	fd.append("file",$('#csvpt')[0].files[0]);
	fd.append("schoolname",naam);
    $('#cover').show();
	$.ajax({
       url:"/csvpadd1",
       type:"POST",
       processData: false,
       cache: false,
       contentType: false,
       enctype: 'multipart/form-data',
       data:fd,
	   success:(res)=>{
		  $('#cover').hide();
	      let m= $.parseJSON(res);
		  if(m.status=="OK"){
		    window.location.reload();
		  }else{
			$("#mmc").text("Unable to import parents data.");
		    $(".errorma").modal('show');   
		  }
	   },
	   error:(err)=>{
		   $('#cover').hide();
	   }
	});
});

function seereport(){
  let type=$("#rid").val();
  let data="http://35.200.152.63/api/reports/";
    data+=$("#rid").val()+"?";
	data+="deviceId="+$("#cid").val()+"&";
	data+="from="+$("#date").val().split("-").reverse().join("-")+"&";
	data+="to="+$("#date1").val().split("-").reverse().join("-");
   $('#cover').show();
  $.ajax({
       url:data,
	   crossDomain: true, 
	   headers: {
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),

		  "Accept":"application/json"
       },
       type:"GET",
	   xhrFields: {
        withCredentials: true
       },
       success:(res)=>{
			$('#cover').hide();
			$("#erru").css("display","block");
			$(".selectors").hide();
			$(".results").show();
			$(".t1").empty();
			$(".t1").html("<i class=\"zmdi zmdi-map\"></i>"+type.charAt(0).toUpperCase()+type.slice(1)+" Result");
			$(".t1").append("<span style=\"float:right\" class=\"mgg\" ><button class=\"btn btn-primary pull-right\" onclick=\"sagain()\" id=\"mgg_but\" style=\"margin-right:30px;\">Go Back</button></span>")
			switch (type){
			  case "route":
			    $(".resulth").html("<td>Device Name</td><td>Valid</td><td>Time</td><td>Latitude</td><td>Longitude</td><td>Altitude</td><td>Speed</td><td>Address</td>");
			    if(res.length==0){
			      $(".resultd").html("<tr><td colspan=\"8\" align=\"center\" style=\"padding-top:150px; padding-bottom:150px; border-style:hidden;\" class=\"text-center\">No any data found under the selected duration under the type "+type+"</td></tr>");
			    }else{
				   $(".resultd").empty();
			       res.forEach((val,index)=>{
					   $(".resultd").append("<tr><td>"+$("#cid option:selected").text()+"</td><td>"+val.valid+"</td>\
					                       <td>"+new Date(val.serverTime).toLocaleString()+"</td><td>"+val.latitude+"<sup>0</sup></td>\
                         <td>"+val.longitude+"<sup>0</sup></td><td>"+(parseFloat(val.altitude)/1000).toString()+" km</td><td>"+(parseFloat(val.speed)*3.6).toString()+" kmph</td><td>"+val.address+"</td></tr>");
					  				   
				   });
			    }
			  break;
			  case "events":
			     $(".resulth").html("<td>Device Name</td><td>Time</td><td>Type</td><td>Geofence Id</td>");
				 if(res.length==0){
			      $(".resultd").html("<tr><td colspan=\"4\" align=\"center\" style=\"padding-top:150px; padding-bottom:150px; border-style:hidden;\" class=\"text-center\">No any data found under the selected duration under the type "+type+"</td></tr>");
			    }else{
			      $(".resultd").empty();
			       res.forEach((val)=>{
				      if(val.type="deviceOffline"){
					     val.type="Offline";
					  }else{
					     val.type="Online";
					  }
					  $(".resultd").append("<tr><td>"+$("#cid option:selected").text()+"</td><td>"+new Date(val.serverTime).toLocaleString()+"</td>\
					                       <td>"+val.type+"</td><td>"+val.geofenceId+"</td></tr>");
				   });
			    }
			  break;
			  case "trips":
			     $(".resulth").html("<td>Device Name</td><td>Start Time</td><td>Start Address</td><td>End Time</td><td>End Address</td><td>Distance</td><td>Average Speed</td><td>Maximum Speed</td><td>Duration</td><td>Spent Fuel</td><td>Driver</td>");
			     if(res.length==0){
			      $(".resultd").html("<tr><td colspan=\"11\" align=\"center\" style=\"padding-top:150px; padding-bottom:150px; border-style:hidden;\" class=\"text-center\">No any data found under the selected duration under the type "+type+"</td></tr>");
			     }else{
			        $(".resultd").empty();
			       res.forEach((val)=>{
				      $(".resultd").append("<tr><td>"+$("#cid option:selected").text()+"</td><td>"+new Date(val.startTime).toLocaleString()+"</td><td>"+val.startAddress+"</td>\
					    <td>"+new Date(val.endTime).toLocaleString()+"</td>\
					    <td>"+val.endAddress+"</td><td>"+(parseFloat(val.distance)/1000).toString()+" km</td>\
						<td>"+(parseFloat(val.averageSpeed)*3.6)+" kmph</td><td>"+(parseFloat(val.maxSpeed)*3.6).toString()+" kmph</td>\
						<td>"+(parseFloat(val.duration)/3600).toString()+" hr</td><td>"+val.spentFuel+"</td><td>"+val.driverName+"</td></tr>");
				   });
			     }
			  break;
			  case "stops":
			     $(".resulth").html("<td>Device Name</td><td>Address</td><td>End Time</td><td>Duration</td><td>Engine Hours</td><td>Spent Fuel</td>");
			     if(res.length==0){
			      $(".resultd").html("<tr><td colspan=\"6\" align=\"center\" style=\"padding-top:150px; padding-bottom:150px; border-style:hidden;\" class=\"text-center\">No any data found under the selected duration under the type "+type+"</td></tr>");
			     }else{
			       $(".resultd").empty();
			       res.forEach((val)=>{
				      $(".resultd").append("<tr><td>"+$("#cid option:selected").text()+"</td>\
					  <td>"+val.address+"</td><td>"+new Date(val.endTime).toLocaleString()+"</td><td>"+(parseFloat(val.duration)/3600).toString()+" hr</td>\
					  <td>"+val.engineHours+" hr</td><td>"+val.spentFuel+"</td></tr>");
				   });
			     }
			  break;
			  case "summary":
			     $(".resulth").html("<td>Device Name</td><td>Distance</td><td>Average Speed</td><td>Maximum Speed</td><td>Engine Hours</td><td>Spent Fuel</td>");
			     if(res.length==0){
			      $(".resultd").html("<tr><td colspan=\"6\" align=\"center\" style=\"padding-top:150px; padding-bottom:150px; border-style:hidden;\" class=\"text-center\">No any data found under the selected duration under the type "+type+"</td></tr>");
			    }else{
			       $(".resultd").empty();
			       res.forEach((val)=>{
				      $(".resultd").append("<tr><td>"+$("#cid option:selected").text()+"</td><td>"+(parseFloat(val.distance)/1000).toString()+" km</td>\
					  <td>"+(parseFloat(val.averageSpeed)*3.6).toString()+" kmph</td><td>"+(parseFloat(val.maxSpeed)*3.6).toString()+" kmph</td><td>"+val.engineHours+"</td><td>"+val.spentFuel+"</td></tr>");
				   });
			    }
			  break;
			}
	   },
	   error:(err)=>{
		  $('#cover').hide();
		  $("#addy").css("height","500px");
		  $("#erru").css("display","block");
	   }
	});
}

function waitmeplz(){
   $("#sform").submit((e)=>{
     e.preventDefault();
	 let data={},url;
	 data["name"]=$("#z2").val();
	 data["password"]=$("#z2").val();
	 data["email"]=$("#z6").val();
	 let index,data1;
	 $.ajax({
	   url:"http://35.200.152.63/api/users",
	   crossDomain: true,
	   headers: {
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),

		  "Accept":"application/json"
       },
       type:"GET",
	   xhrFields: {
        withCredentials: true
       },
       success:(res)=>{
		   res.forEach((val)=>{
			 if(val.name==mname){
			    index=val.id;
				data1=val;
			 }
		   });
		   data1["email"]=data["email"];
		   data1["name"]=data["name"];
		   data1["password"]=data["password"];
		   waitplz1(index,data1);   
	   },
	   error:(err)=>{
	   }
	  });
   });
}

function waitplz1(index,data){
   $.ajax({
	   url:"http://35.200.152.63/api/users/"+index,
	   crossDomain: true,
	   headers: {
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),

		  "Content-Type":"application/json"
       },
       type:"PUT",
	   data:JSON.stringify(data),
	   xhrFields: {
        withCredentials: true
       },
       success:(res)=>{
		      $("#sform").unbind('submit').submit();
	   },
	   error:(err)=>{
		   $("#errlu").show();
	   }
	  });
}



function mapit(){
	/*let d=false;
	name.forEach((val,index)=>{
	  if(val==$(".schooln :selected").text() && busno[index]==$(".busn :selected").text()){
	      m=index;
		  d=true;
	  }
	});
    if(d==false){*/
	m=0;
    if(interval){
		   clearInterval(interval);
	}else{
		  marker=new Array();
		  showmapnow();
		  h=0;
		  interval=setInterval(()=>{
		     mapagain();
	      },5000);
     }
}

function mapagain(){
	//names1=new Array();
	pids=new Array();
	ids=new Array();
    lats=new Array();
    longs=new Array();
	$.ajax({
       url:"http://35.200.152.63/api/positions",
	   headers: {
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),

		  "Accept":"application/json"
       },
	   crossDomain: true,
       type:"GET",
	   xhrFields: {
        withCredentials: true
       },
       success:(res)=>{
		    JSON.parse(JSON.stringify(res)).forEach((val)=>{
            let v=JSON.parse(JSON.stringify(val));
            ids.push(v.deviceId);
			pids.push(v.id);
            lats.push(v.latitude);
            longs.push(v.longitude);
        });
        //alert(ids.indexOf(adeviceId[0]));
        mapfinal();
	   },
	   error:(err)=>{
		  $('#map').html("<p class=\"text-center\" style=\"margin-top:150px;\">Sorry, Error in map data fetching!!! Please try again later!!!</p>");
	   }
	});

	//$('#map').html("<p class=\"text-center\" style=\"margin-top:150px;\">Sorry, Error in map data fetching!!! Please try again later!!!</p>");
}

function mapfinal(){
	pids=[...new Set(pids)];
	w.forEach((val,index)=>{
	   w[index]=Number(val);
	});
	pids1=new Array();
	names1=new Array();
	$.ajax({
              url:"http://35.200.152.63/api/devices",
	          headers: {
               "Authorization": "Basic " + btoa("admin:Girlneeds@"),

			   "Accept":"application/json"
              },
	          crossDomain: true,
              type:"GET",
	          xhrFields: {
               withCredentials: true
              },
              success:(res)=>{
		          JSON.parse(JSON.stringify(res)).forEach((val)=>{
                  let v=JSON.parse(JSON.stringify(val));
                  names1.push(val.name);
				  pids1.push(val.positionId);
               });
			   let indexis=new Array();
			   adeviceId.forEach((val,index)=>{
				  let yy=pids.indexOf(pids1[names1.indexOf(val)]);
				  if(yy!=-1){
				    indexis.push(yy);
				  }
			   });
			   
			   if(indexis.length==0){
			      mapindia();
			   }else{
			    map1(indexis);
			   }
           },error:(err)=>{
		   }
	});
	

}

function map1(index){
    let mc;
	let geocoder = new google.maps.Geocoder;
	let contentString;
	myLatLng=new Array();
	let locs=new Array();
    let infowindow = new google.maps.InfoWindow();
	
	index.forEach((val)=>{
	  if(val==-1){
	    mc=true;  
	  }else{
	    mc=false;
	  }
	});
	
	if(mc==true){
		 mapindia();
	}else{
	$('#maptext').hide();
	lats=lats.reverse();
	longs=longs.reverse();
	for(let i=0;i<index.length;i++){
	   myLatLng.push({
	      lat:parseFloat(lats[i]),
		  lng:parseFloat(longs[i])
	   });
	   if(!coords[i]){
	      coords[i]=new Array();
	   }
	   coords[i].push(myLatLng[i]);
	   if(coords[i].length>1){
	    let lm=new Set(coords[i].map(e=>JSON.stringify(e))); //see it
	    coords[i]=Array.from(lm).map(e=>JSON.parse(e));
	   }
	}
	
	
     let latsum=0;
	 let lngsum=0;
	 if(marker.length!=0){
	  for(let i=0;i<marker.length;i++){
	      marker[i].setMap(null);
	  }
	 }

	 for(let i=0;i<myLatLng.length;i++){
	    latsum+=myLatLng[i].lat;
		lngsum+=myLatLng[i].lng;
		marker[i]=new SlidingMarker({
        //position: new google.maps.LatLng(myLatLng[i].lat, myLatLng[i].lng),
		map: maps,
		icon:{
			url:'/images/icon/bus.png',
			labelOrigin: new google.maps.Point(myLatLng[i].lat,myLatLng[i].lng-90),
		},
		label:{
		   text:busno[i],
		   fontFamily:"Arial"
		}
      });
	 }
	 
	 
	 if(ilu==0){
	    maps.setCenter(new google.maps.LatLng(latsum/myLatLng.length, lngsum/myLatLng.length));
	    maps.setZoom(12);
		ilu=1;
	 }
    
	let pathu=new Array();
	
	for (let i = 0; i < myLatLng.length; i++) {
	  
	  marker[i].setPosition(new google.maps.LatLng(myLatLng[i].lat, myLatLng[i].lng));
	  geocoder.geocode({'location': myLatLng[i]}, function(results, status) {
	   if (status === 'OK') {
	     locs.push(results[0].formatted_address);
	   }
	  });  
	  
	   pathu[i]= new google.maps.Polyline({
          path: coords[i],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
       });
	   pathu[i].setMap(maps);
	  
	  
      google.maps.event.addListener(marker[i], 'click', (function(marker, i) {
        return function() {
	      $('.it1').text(busno[i]);
		  $('.it2').text(adeviceId[i]);
		  $('.it3').text(myLatLng[i].lat);
		  $('.it4').text(myLatLng[i].lng);
		  $('.it5').text(locs[i]);
		  $('.stats').show();
        }
      })(marker[i], i));
    
	}
  }
}

function mapindia(){
  $('#maptext').show();
  let geocoder = new google.maps.Geocoder;
  geocoder.geocode( { 'address': "india"}, function(results, status) {
    if (status == 'OK') {
	  let j=results[0].geometry.location;
	  maps.setZoom(5);
	  maps.setCenter(j);
	  $('#maptext').html("<p style=\"font-size:18px;\" class=\"text-center\" style=\"margin-top:20px;\">None of your tracking devices are available for tracking</p>");
	}else{
	  $('#map').html("<p class=\"text-center\" style=\"margin-top:150px;\">Sorry, Error in map data fetching!!! Please try again later!!!</p>");
	}
  });
}

function showmapnow(){
    maps = new google.maps.Map(document.getElementById('map'), {
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        streetViewControl:false
      });
}

(function ($) {
  // Use Strict
  "use strict";
  try {
    var progressbarSimple = $('.js-progressbar-simple');
    progressbarSimple.each(function () {
      var that = $(this);
      var executed = false;
      $(window).on('load', function () {

        that.waypoint(function () {
          if (!executed) {
            executed = true;
            /*progress bar*/
            that.progressbar({
              update: function (current_percentage, $this) {
                $this.find('.js-value').html(current_percentage + '%');
              }
            });
          }
        }, {
            offset: 'bottom-in-view'
          });

      });
    });
  } catch (err) {
    console.log(err);
  }
})(jQuery);
(function ($) {
  // USE STRICT
  "use strict";

  // Scroll Bar
  try {
    var jscr1 = $('.js-scrollbar1');
    if(jscr1[0]) {
      const ps1 = new PerfectScrollbar('.js-scrollbar1');
    }

    var jscr2 = $('.js-scrollbar2');
    if (jscr2[0]) {
      const ps2 = new PerfectScrollbar('.js-scrollbar2');

    }

  } catch (error) {
    console.log(error);
  }

})(jQuery);
(function ($) {
  // USE STRICT
  "use strict";

  // Select 2
  try {

    $(".js-select2").each(function () {
      $(this).select2({
        minimumResultsForSearch: 20,
        dropdownParent: $(this).next('.dropDownSelect2')
      });
    });

  } catch (error) {
    console.log(error);
  }


})(jQuery);
(function ($) {
  // USE STRICT
  "use strict";

  // Dropdown
  try {
    var menu = $('.js-item-menu');
    var sub_menu_is_showed = -1;

    for (var i = 0; i < menu.length; i++) {
      $(menu[i]).on('click', function (e) {
        e.preventDefault();
        $('.js-right-sidebar').removeClass("show-sidebar");
        if (jQuery.inArray(this, menu) == sub_menu_is_showed) {
          $(this).toggleClass('show-dropdown');
          sub_menu_is_showed = -1;
        }
        else {
          for (var i = 0; i < menu.length; i++) {
            $(menu[i]).removeClass("show-dropdown");
          }
          $(this).toggleClass('show-dropdown');
          sub_menu_is_showed = jQuery.inArray(this, menu);
        }
      });
    }
    $(".js-item-menu, .js-dropdown").click(function (event) {
      event.stopPropagation();
    });

    $("body,html").on("click", function () {
      for (var i = 0; i < menu.length; i++) {
        menu[i].classList.remove("show-dropdown");
      }
      sub_menu_is_showed = -1;
    });

  } catch (error) {
    console.log(error);
  }

  var wW = $(window).width();
    // Right Sidebar
    var right_sidebar = $('.js-right-sidebar');
    var sidebar_btn = $('.js-sidebar-btn');

    sidebar_btn.on('click', function (e) {
      e.preventDefault();
      for (var i = 0; i < menu.length; i++) {
        menu[i].classList.remove("show-dropdown");
      }
      sub_menu_is_showed = -1;
      right_sidebar.toggleClass("show-sidebar");
    });

    $(".js-right-sidebar, .js-sidebar-btn").click(function (event) {
      event.stopPropagation();
    });

    $("body,html").on("click", function () {
      right_sidebar.removeClass("show-sidebar");

    });


  // Sublist Sidebar
  try {
    var arrow = $('.js-arrow');
    arrow.each(function () {
      var that = $(this);
      that.on('click', function (e) {
        e.preventDefault();
        that.find(".arrow").toggleClass("up");
        that.toggleClass("open");
        that.parent().find('.js-sub-list').slideToggle("250");
      });
    });

  } catch (error) {
    console.log(error);
  }


  try {
    // Hamburger Menu
    $('.hamburger').on('click', function () {
      $(this).toggleClass('is-active');
      $('.navbar-mobile').slideToggle('500');
    });
    $('.navbar-mobile__list li.has-dropdown > a').on('click', function () {
      var dropdown = $(this).siblings('ul.navbar-mobile__dropdown');
      $(this).toggleClass('active');
      $(dropdown).slideToggle('500');
      return false;
    });
  } catch (error) {
    console.log(error);
  }
  show(0);
})(jQuery);




function assigndata(number,name,id){
   $("#isu").hide();
   $("#am").css("float","right");
   $("#amm").show();
   $("#dform").trigger('reset');
   if($("#did option[value='"+id+"']").length==0 && id!=0){
      $("#did").append("<option value=\""+id+"\">"+id+"</option>");
	  $("#did").val(id);
	  $("#ullu").text("Sorry no other empty devices found for assigning");
   }else{
	 $("#el").hide();
     $("#did").empty();
	 $("#did").empty();
   if(names.length==0){
	   $("#did").append("<option value=\"\">No any devices available for assigning</option>");
	}else{
	  for(let i=0;i<names.length;i++){
		  if(adeviceId.indexOf(names[i])==-1){
	        $("#did").append("<option value=\""+names[i]+"\">"+names[i]+"</option>");
		  }
	  }
	}
	 //$("#did").val(id);
	 $("#bid").removeAttr('disabled');
	 $("#am").removeAttr('disabled');
	 $("#amm").attr('disabled','disabled');
   }
   if(name!=null && id!=0){
	 
	 $("#did").css("pointer-events","none");
	 $("#sid").css("pointer-events","none");
     $("#sid").val(name);
	 $("#am").attr('disabled','disabled');
	 $("#amm").removeAttr('disabled');
   }
   if(number!=0){
	 $("#bid").attr("disabled","disabled");
     $("#bid").val(number);
   }
   $("#devicestates").modal('show');
}

function deassigndata(number,name,id){
  $("#confirm").modal('show');
  document.getElementById("yescon").addEventListener("click",()=>{
   $.post("/deletebus",{number:number,name:name,from:"school"}).then((res)=>{
	  let m=$.parseJSON(res);
	  if(m.status=="OK"){
	     window.location.reload();
	  }
   });
  });
}

function newassign(){
   $("#did").empty();
   let ww=new Array();
   names.forEach((val)=>{
     if(adeviceId.indexOf(val)==-1){
	     ww.push(val);
	 }
   });
   if(ww.length==0){
	   $("#did").append("<option value=\"\">No any devices available for assigning</option>");
	}else{
	  for(let i=0;i<names.length;i++){
		  if(adeviceId.indexOf(names[i])==-1){
	        $("#did").append("<option value=\""+names[i]+"\">"+names[i]+"</option>");
		  }
	  }
	}
   $("#amm").hide();
   $("#isu").hide();
   $("#am").css("float","center");
   $("#am").removeAttr("disabled");
   $("#dform").trigger('reset');
   $("#did").css("pointer-events","");
   $("#bid").removeAttr("disabled");
   //$("#dform").attr("action","/busNumberWithDevice");
   $("#el").show();
   $("#devicestates").modal('show');
}

function unassign(){
   if($("#did").val().length==0||$("#sid").val().length==0 || $("#bid").val().length==0 || $("#bid").val().indexOf(",")!=-1 || $("#bid").val().indexOf(".")!=-1){
      $("#isu").text("Please select or input proper values");
	  $("#isu").show();
   }
   else{
	   let data={};
	   data["deviceId"]=$("#did").val();
	   data["schoolName"]=$("#sid").val();
	   data["busNumber"]=$("#bid").val();
	   data["from"]="school";
	   
       $.post("/unassign",data).then((res)=>{
	     window.location.href="/";
	   });
   }
}

function newparent(){
   $("#pform").trigger('reset');
   $('#pform').attr('action','/addParent');
   $("#headip").text("Add New Parent");
   $("#addp").text("Add");
   $("#editParent").modal('show');
}

function peditdata(parentname,school,children,number,email,address){
   let length=JSON.parse(children).length;
   $("#pform").trigger('reset');
   $("#pform").attr("action","/modifyParent");
   $("#headip").text("Edit Parent Below");
    
   if(length>1){
     for(let i=1;i<length;i++){
	    let j=i+1;
		if(!$("#y5"+j).length){
			$("#tt").append("<input type=\"text\" id=\"y5"+j+"\" name=\"childname\" style=\"margin-top:20px; width:35%; float:left; margin-right:10px;\"  class=\"form-control\" placeholder=\"Enter childname\"><input type=\"text\" id=\"y7"+j+"\" name=\"busnumber\" style=\"margin-top:20px; width:58%\" class=\"form-control\" placeholder=\"Enter morning vehicle number (Keep empty if not fixed)\">\
		    <i class=\"fas fa-minus\" style=\"float:right; margin-left:5px; margin-top:-30px;\" id=\"i"+j+"\" onclick=\"fdexpand("+j+")\" style=\"width:10%;\"></i>\
		    <input type=\"text\" id=\"y8"+j+"\" name=\"busnumber1\" style=\"margin-top:20px; width:58%; float:right; margin-right:35px; margin-bottom:20px;\" class=\"form-control\" placeholder=\"Enter evening vehicle number (Keep empty if not fixed)\">");
		}
	 }
   }else{
     if($("#tt input").length>1){
	     $("#tt>input:gt(2)").remove();
		}
   }	   

   JSON.parse(children).forEach((val,index)=>{
	  let fg=val.childName;
	  let lg=val.busNumber;
	  let gg=val.busNumber1;
      let n=(index+1).toString();
      $("#y5"+n).val(fg);
	  if(lg!="0" && lg!=0 && lg.length!=0){
	     $("#y7"+n).val(lg);
	  }
	  if(gg!="0" && gg!=0 && gg.length!=0){
	     $("#y8"+n).val(gg);
	  }
   });
   $("#y1").val(parentname);
   $("#y2").val(number);
   $("#y3").val(address);
   $("#y4").val(email);
   $("#y6").val(school);
   $("#pform").append("<input type=\"hidden\"  name=\"oldnumber\" value=\""+number+"\">");
   $("#pform").append("<input type=\"hidden\" name=\"oldnum\" value=\""+length+"\>");
   $("#addp").text("Edit");
   $("#editParent").modal('show');
}

function pdeletedata(number,name){
   $("#confirm").modal('show');
   document.getElementById("yescon").addEventListener("click",()=>{
    $.post("/deleteParent",{mobilenumber:number,schoolname:name,from1:"school"}).then((res)=>{
	  window.location.reload();
	});
   });
}

function fexpand(){
	  tt++;
      $("#tt").append("<input type=\"text\" id=\"y5"+tt+"\" name=\"childname\" style=\"margin-top:0px; width:35%; float:left; margin-right:10px;\"  class=\"form-control\" placeholder=\"Enter childname\"><input type=\"text\" id=\"y7"+tt+"\" name=\"busnumber\" style=\"margin-top:20px; width:58%\" class=\"form-control\" placeholder=\"Enter morning vehicle number (Keep empty if not fixed)\"><i class=\"fas fa-minus\" style=\"float:right; margin-top:-30px;\" id=\"i"+tt+"\" onclick=\"fdexpand("+tt+")\" style=\"width:10%;\"></i><input type=\"text\" id=\"y8"+tt+"\" name=\"busnumber1\" style=\"width:58%; margin-top:20px; float:right; margin-right:35px; margin-bottom:20px;\" class=\"form-control\" placeholder=\"Enter evening vehicle number (Keep empty if not fixed)\">");
}


function fdexpand(a){
  $("#y5"+a).remove();
  $("#y7"+a).remove();
  $("#y8"+a).remove();
  $("#i"+a).remove();
}

function checksame(){
  let m=false;
  $("#dform").submit(function(e){
    e.preventDefault();
    if($("#bid").val().indexOf(",")!=-1 || $("#bid").val().indexOf(".")!=-1){
     $("#isu").text("Please select or input proper values");
	 $("#isu").show();
    }else if($("#bid").val().length==0){
     $("#isu").text("Please input vehicle number");
	 $("#isu").show();
  
   }else{
   busno.forEach((val,index)=>{
    if(val==$("#bid").val().toString() && name[index]==$("#sid").val().toString()){
       m=true;
    }
   });

   if(m==true){
    
		  $("#isu").text("The vehicle numbered "+$("#bid").val().toString()+" of school "+$("#sid").val().toString()+" has already been assigned by another device");
		  $("#isu").show();
       
   }else{
      $("#dform").unbind('submit').submit();
   }
  }
  });
}


function show(n){
  for(let i=0;i<$(".has-sub").length;i++){
     if(i==n){
	    $("#bar"+i).addClass('active');
	 }else{
	    $("#bar"+i).removeClass('active');
	 }
  }
  switch(n){
    case 0:  //home
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").show();
	 $(".school-data").hide();
	 $(".billing-data").hide();
	 $(".parent-data").hide();
	 $(".device-data").hide();
	 $(".report-data").hide();
	 $(".child-data").hide();
	 $(".bus-data").hide();
	 $(".playback-data").hide();
	 $(".js-right-sidebar").removeClass("show-sidebar");
	 break;
	 $(".js-right-sidebar").removeClass("show-sidebar");
	 break;
	case 1: //statistics
	 $(".user-data").show(); //user data is mean data
	 $(".map-data").hide();
	 $(".school-data").hide();
	 $(".billing-data").hide();
	 $(".parent-data").hide();
	 $(".device-data").hide();
	 $(".report-data").hide();
	 $(".child-data").hide();
	 $(".bus-data").hide();
	 $(".playback-data").hide();
	 $(".js-right-sidebar").removeClass("show-sidebar");
	  break;
	case 2: //parents
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").hide();
	 $(".school-data").hide();
	 $(".billing-data").hide();
	 $(".parent-data").show();
	 $(".device-data").hide();
	 $(".report-data").hide();
	 $(".child-data").hide();
	 $(".bus-data").hide();
	 $(".playback-data").hide();
	 $(".js-right-sidebar").removeClass("show-sidebar");
	  break;
	case 3: //chidren
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").hide();
	 $(".school-data").hide();
	 $(".billing-data").hide();
	 $(".parent-data").hide();
	 $(".device-data").hide();
	 $(".report-data").hide();
	 $(".child-data").show();
	 $(".bus-data").hide();
	 $(".playback-data").hide();
	 $(".js-right-sidebar").removeClass("show-sidebar");
	  break;
	case 4: //reports
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").hide();
	 $(".school-data").hide();
	 $(".billing-data").hide();
	 $(".parent-data").hide();
	 $(".device-data").hide();
	 $(".report-data").show();
	 $(".child-data").hide();
	 $(".bus-data").hide();
	 $(".playback-data").hide();
	 $(".js-right-sidebar").removeClass("show-sidebar");
	  break;
	case 5: //devices
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").hide();
	 $(".school-data").hide();
	 $(".billing-data").hide();
	 $(".parent-data").hide();
	 $(".device-data").show();
	 $(".report-data").hide();
	 $(".child-data").hide();
	 $(".bus-data").hide(); 
	 $(".playback-data").hide();
	 $(".js-right-sidebar").removeClass("show-sidebar");
	 break;
	case 6: //feedback
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").hide();
	 $(".school-data").hide();
	 $(".billing-data").hide();
	 $(".parent-data").hide();
	 $(".device-data").hide();
	 $(".report-data").hide();
	 $(".child-data").hide();
	 $(".bus-data").hide();  
	 $(".playback-data").show();
	 $(".js-right-sidebar").removeClass("show-sidebar");
	 break;
	
	/*case 7:
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").hide();
	 $(".school-data").hide();
	 $(".feedback-data").hide();
	 $(".billing-data").show();
	 $(".parent-data").hide();
	 $(".device-data").hide();
	 $(".report-data").hide();
	 $(".child-data").hide();
	 $(".bus-data").hide();
	 $(".js-right-sidebar").removeClass("show-sidebar");
	 break;*/
	
	case 8://settings
	 $("#edituserdata").modal('show');
	 $(".js-right-sidebar").removeClass("show-sidebar");
	 break;
	
	case 9: //signout
        localStorage.clear();
	window.location.replace("/logout");
	$(".js-right-sidebar").removeClass("show-sidebar");
	break;
	
  }
}

function addn(){
  if($("#d1").val().length==0){
	$("#yahoo").text("Please enter a valid device name");
    $('#yahoo').show();
  }else{
  $('#yahoo').hide();
  let data={};
  data["name"]=$("#d1").val();
  //data["uniqueId"]="86696803013"+Math.floor(Math.random()*9999+1000).toString();
  data["uniqueId"]=$("#imei").val();
  $.ajax({
       url:"http://35.200.152.63/api/devices",
	   crossDomain: true,
       type:"POST",
	   headers:{
		 "Authorization": "Basic " + btoa(memail+":"+mname),
	     'Content-Type': 'application/json'
	   },
	   data:JSON.stringify(data),
	   xhrFields: {
        withCredentials: true
       },
       success:(res)=>{
		  data["from1"]="school";
		  $.post("/devicenotice",data).then((res)=>{
		    let m=$.parseJSON(res);
			if(m.status=="OK"){
			   /*$("#yahoo").text("The device has been succesfully added.");
		       $('#yahoo').show();*/
			   window.location.reload();
			}
		  });
	   },
	   error:(err)=>{
		  $("#yahoo").text("An unexpected error arised. Please try again");
		  $('#yahoo').show();
	   }
	});
  }
}

function sadd(){
   $("#whatto").modal("show");
}

function donow(n){
  $("#whatto").modal("hide");
  if(n==1){
   $("#deform").trigger('reset');
   $("#yahoo").hide();
   $("#olla").modal("show");
  }
  if(n==2){
	if($(".invisible1").html().length==0){
       $("#noto").modal("show");
    }else{
        $("#yesto").modal("show");
    }
  }
}

function deleteplz(){
  let m=true;
  JSON.parse($(".invisible").html()).buses.forEach((val)=>{
     if(val.deviceName==$('#devicei').val()){
	   m=false;
	 }
  });
  if(m){
     deletnow();
  }else{
	 $("#yesto").modal("hide");
     $("#errorna").modal('show');
  }
}

function deletnow(){
$("#yesto").modal("hide");
$("#confirm").modal('show');
   document.getElementById("yescon").addEventListener("click",()=>{

   let index;
   
   
   $.ajax({
	   url:"http://35.200.152.63/api/devices/",
	   crossDomain: true,
	   headers: {
          "Authorization": "Basic " + btoa(memail+":"+mname),
		  "Accept":"application/json"
       },
       type:"GET",
	   xhrFields: {
        withCredentials: true
       },
       success:(res)=>{
			  for(let i=0;i<res.length;i++){
				 if(res[i].name==$('#devicei').val()){
				    index=res[i].id;
					break;
				 }
			  }
			  
			  
			  $.ajax({
	            url:"http://35.200.152.63/api/devices/"+index,
	            crossDomain: true,
	            headers: {
                  "Authorization": "Basic " + btoa(memail+":"+mname),
				  "Content-Type":"application/json"
                 },
                type:"DELETE",
	            xhrFields: {
                 withCredentials: true
                },
                success:(res1)=>{
				     window.location.reload();
	            },error:(err1)=>{
					//alert(JSON.stringify(err1));
				}
			  });
	   
	   },
	   error:(err)=>{
		   $("#errlu").show();
	   }
	  });
	  
   });
}



function childadd(){
   
   $("#cheform").trigger('reset');
   $("#cheform").attr("action","/addchild");
   $("#headisin").text("Add New Child");
   $("#ch21").css("width","90%");
   $("#i21").show();
   $("#childit").modal('show');
}

function fexpandok(){
	  mt++;
      $("#ttok").append("<input type=\"text\" id=\"ch2"+mt+"\" name=\"childName\" style=\"width:90%; float:left; margin-left:15px; margin-bottom:10px; margin-top:10px;\" class=\"form-control\" placeholder=\"Enter Child Name\" required/>");
      $("#ttok").append("<i class=\"fas fa-minus\" style=\"float:right; margin-left:5px; margin-top:-30px; width:10%;\" id=\"i2"+mt+"\" onclick=\"fexpandnok("+mt+")\"></i>")
}

function fexpandnok(a){
     $("#ch2"+a).remove();
	 $("#i2"+a).remove();
}

function ceditdata(childname,parentname){
   $("#cheform").trigger('reset');
   $("#cheform").attr("action","/editchild");
   $("#headisin").text("Edit Child Below");
   $("#i21").hide();
   $("#ch21").css("width","95%");
   $("#ch21").val(childname);
   $("#pd2").val(parentname);
   $("#pd2").css("pointer-events","none");
   $("#cheform").append("<input type=\"hidden\" name=\"oldname\" value=\""+childname+"\"</input>");
   if($("#ttok input").length>1){
       $("#ttok > input:gt(0)").remove();
   }
   $("#ttok .fas").hide();
   $("#childit").modal('show');
}

function cdeletedata(childname,parentname){
   $("#confirm").modal('show');
   document.getElementById("yescon").addEventListener("click",()=>{
    $("#cheform").trigger('reset');
    $("#cheform").attr("action","/deletechild");
    $("#ch21").val(childname);
	$("#cheform").append("<input type=\"hidden\" name=\"oldname\" value=\""+childname+"\"</input>");
	$("#cheform").append("<input type=\"hidden\" name=\"parentName\" value=\""+parentname+"\"</input>");
    if($("#ttok input").length>1){
       $("#ttok > input:gt(0)").remove();
    }
   $("#cheform").submit();
   });
}
