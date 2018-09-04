let first,act,coords,unm,ids,pids,lats,longs,myLatLng,maps,marker,trafficLayer,busno,deviceId,adeviceName,adeviceId,name,cschool,cid,m,interval,bool,tt=1,mt=1,fg,lg,ids1,pids1,names1,h,infowindow,lo;

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
     setTimeout(window.history.forward(),0);
	$(document).keydown(function(event) {
     if (event.keyCode == 27) {
             $(".btn-outline-danger").click();
      }
    });
	//alert(document.getElementById("headings"));
	name=new Array();
	busno=new Array();
	adeviceName=new Array();
	adeviceId=new Array();
	act=0;
	lo=JSON.parse($(".invisible1").html());
	for(var i=0;i<$(".invisible").length;i++){
       
	   let m=JSON.parse($($(".invisible")[i]).html());
	  
	   if(m.name!=null && m.busno!=0){
	       adeviceName.push(m.deviceName);
		   adeviceId.push(m.deviceId);
	   }
	   if(m.name!=null){
	     name.push(m.name);
	   }
	   if(m.busno!=0){
	     busno.push(m.busno);
	   }
	}
    first=0;
	let data=JSON.parse($("#schoos").html());
	if(data.length!=0){
	for(var i=0;i<data.length;i++){
	     if(data[i].parents.length==0){
		      bool=true;
		 }else{
		     bool=false;
			 break;
		 }
	 }
	 if(bool==true){
	     $("#nops").show();
		 $("#nopi").hide();
	 }else{
	     $("#nops").hide();
		 $("#nopi").show();
	 }
	}
	if(busno.length!=0){
	   m=0;
	  $(".filters").css('display','block');
	  busno.forEach((val,index)=>{
		$(".busn").append("<option value=\"device\""+index+"\">"+val+"</option>");
	  });
	  var name1=[...new Set(name)];
	  name1.forEach((val,index)=>{
	    $(".schooln").append("<option value=\"bus\""+index+"\">"+name1[index]+"</option>");
	  });
	}else{
	   $(".filters").css('display','none');
	}

  })(jQuery);

(function ($) {
  "use strict";
  try {
    var map = $('#map');
    if(map[0]) {

	  ids1=new Array();
	  names1=new Array();
	  pids1=new Array(); 
	$.ajax({
       url:"http://35.200.152.63/api/devices",
	   headers: {
<<<<<<< HEAD
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),
=======
          "Authorization": "Basic " + btoa("admin:admin"),
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
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
		   if(v.positionId!=0){
			pids1.push(v.positionId);
			names1.push(v.name);
		   }
        });
          $.ajax({
            url:"http://35.200.152.63/api/positions",
	        headers: {
<<<<<<< HEAD
             "Authorization": "Basic " + btoa("admin:Girlneeds@"),
=======
             "Authorization": "Basic " + btoa("admin:admin"),
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
			 "Accept":"application/json"
            },
			crossDomain: true,
            type:"GET",
	        xhrFields: {
              withCredentials: true
            },
            success:(res1)=>{
				$("#cid").empty();
		        JSON.parse(JSON.stringify(res1)).forEach((val)=>{
                   let v1=JSON.parse(JSON.stringify(val));
				   ids1.push(v1.deviceId);
				});
		        names1.forEach((val,index)=>{
		          $("#cid").append("<option value=\""+ids1[index]+"\">"+val+"</option>");
	            });
			},error:(err)=>{
			  $("#cid").empty();
		      $("#cid").append("<option value=\"\">Could not fetch devices from server</option>");
			}
		  });
	   },
	   error:(err)=>{
		   //alert(JSON.stringify(err));
		  $("#cid").empty();
		  $("#cid").append("<option value=\"\">Could not fetch devices from server</option>");
	   }
	 });


	  if(busno.length!=0){
	   showmapnow();
	   mapagain();
	   mapit();
	   $(".schooln").change(()=>{
			mapit();
	   });
	   $(".busn").change(()=>{
			mapit();
	   });
	  }else{
	    map.empty();
	    map.html("<p style=\"margin-top:200px\">No any buses found for tracking</p>");
	  }
    }
  } catch (error) {
    console.log(error);
  }


})(jQuery);


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
<<<<<<< HEAD
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),
=======
          "Authorization": "Basic " + btoa("admin:admin"),
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
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
			       res.forEach((val)=>{
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

function sagain(){
  $("#erru").css("display","none");
  $(".selectors").show();
  $(".results").hide();
  $(".t1").empty();
  $(".t1").html("<i class=\"zmdi zmdi-map\"></i>Reports");
  $("#erru").hide();
  $("#erru1").hide();
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
<<<<<<< HEAD
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),
=======
          "Authorization": "Basic " + btoa("admin:admin"),
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
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
		  $('#cover').hide();
		  $("#addy").css("height","600px");
		  $("#erru").css("display","block");
	   }
	});
}


function mapit(){
	let d=false;
	coords=new Array();
	name.forEach((val,index)=>{
	  if(val==$(".schooln :selected").text() && busno[index]==$(".busn :selected").text()){
	      m=index;
		  d=true;
	  }
	});
    if(d==false){
		 if(interval){
		   clearInterval(interval);
		 }
	     mapindia(1);
	}else{
		  showmapnow();
		  maps.setZoom(14);
		  h=0;
		  interval=setInterval(()=>{
		   comagain();
	      },7000);
     }
}

let pids2,names2;


function comagain(){
  pids2=new Array();
  names2=new Array();
  $.ajax({
      url:"http://35.200.152.63/api/devices",
	   headers:{
<<<<<<< HEAD
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),
=======
          "Authorization": "Basic " + btoa("admin:admin"),
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
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
		   if(v.positionId!=0){
			pids2.push(v.positionId);
			names2.push(v.name);
		   }
        });
		mapagain();
	   },
	   error:(err)=>{
		   
	   }
  });
}

function mapagain(){
    pids=new Array();
	ids=new Array();
    lats=new Array();
    longs=new Array();
	$.ajax({
       url:"http://35.200.152.63/api/positions",
	   crossDomain: true,
	   headers: {
<<<<<<< HEAD
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),
=======
          "Authorization": "Basic " + btoa("admin:admin"),
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
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
            lats.push(v.latitude);
            longs.push(v.longitude);
        });
		if(names2){
		  names2.forEach((val,index)=>{
		    if(names2.indexOf(val)!=index){
			  names2.splice(index,1);
			  pids2.splice(index,1);
			}
		  });
		  mapfinal(pids.indexOf(pids2[names2.indexOf(adeviceName[m])]),m);
		}
	   },
	   error:(err)=>{
		  $('#map').html("<p class=\"text-center\" style=\"margin-top:150px;\">Sorry, Error in map data fetching!!! Please try again later!!!</p>");
	   }
	});
}

let mcg=0;

function mapfinal(g,m){
	if(g==-1){
	    mapindia();
	}else{
	$('#maptext').hide();
	let contentString;
	infowindow = new google.maps.InfoWindow();
    myLatLng={
        lat: parseFloat(lats[g]),
        lng: parseFloat(longs[g])
    };
	
	coords.push(myLatLng);
	
	if(coords.length>1){
	  let lm=new Set(coords.map( e=>JSON.stringify(e))); //see it
	  coords=Array.from(lm).map(e=>JSON.parse(e));
	}
	let geocoder = new google.maps.Geocoder;
	maps.setCenter(myLatLng);
	marker.setMap(maps);
    marker.setPosition(myLatLng);
    trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(maps);
	let pathu = new google.maps.Polyline({
          path: coords,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
    });
	pathu.setMap(maps);
	geocoder.geocode({'location': myLatLng}, function(results, status) {
	  if (status === 'OK') {
	     contentString=results[0].formatted_address;
       google.maps.event.addListener(marker, 'click', function() {
		 infowindow.setContent(contentString);
         infowindow.open(map,marker);
        });
	  }
	});
	}
}

function mapindia(a=0){
  $('#maptext').show();
  marker.setMap(null);
  let geocoder = new google.maps.Geocoder;
  geocoder.geocode( { 'address': "india"}, function(results, status) {
    if (status == 'OK') {
	  let j=results[0].geometry.location;
	  maps.setZoom(5);
	  maps.setCenter(j);
	 if(a==0){
	  if(adeviceName[m]!=0 && adeviceName[m]!="0" && adeviceName[m].length!=0){
	   $('#maptext').html("<p style=\"font-size:18px;\" class=\"text-center\">Device named "+adeviceName[m]+" assigned to the vehicle seems not configured!!! Please configure the device!!!</p>");
	  }else{
        $('#maptext').html("<p style=\"font-size:18px;\" class=\"text-center\">Please assign device to the vehicle of the school!!!</p>");	 
	  }
	 }else{
	    $('#maptext').html("<p style=\"font-size:18px;\" class=\"text-center\">Use proper combination of school and vehicle for tracking!!!</p>");  
	 }
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
	marker = new SlidingMarker({
		icon:'/images/icon/bus.png'
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


function deletedata(name,uname){
  let index;
  $("#confirm").modal('show');
   document.getElementById("yescon").addEventListener("click",()=>{
	  $.ajax({
       url:"http://35.200.152.63/api/users",
	   crossDomain: true,
	   headers: {
<<<<<<< HEAD
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),
=======
          "Authorization": "Basic " + btoa("admin:admin"),
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
          "Accept":"application/json"
	   },
       type:"GET",
	   xhrFields: {
        withCredentials: true
       },
       success:(res)=>{
		   res.forEach((val)=>{
			 if(val.name==uname){
			    index=val.id;
			 }
		   });
		   finallydo(index,name);   
	   },
	   error:(err)=>{
	   }
	  });
   });
}

function finallydo(index,name){
          $.ajax({
                  url:"http://35.200.152.63/api/users/"+index,
	              crossDomain: true,
	              headers: {
<<<<<<< HEAD
                    "Authorization": "Basic " + btoa("admin:Girlneeds@")
=======
                    "Authorization": "Basic " + btoa("admin:admin")
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
                  },
                 type:"DELETE",
	             xhrFields: {
                     withCredentials: true
                 },
				 success:(res)=>{
				    $.post("/deleteSchool",{schoolname:name}).then((res)=>{
	                  let m=$.parseJSON(res);
		              if(m.status=="OK"){
		                   window.location.reload();
		                }
	                });
				 },
				 error:(err)=>{
				 }
		  });
				 
				 
}

function editdata(name,uname,address,email,number){
   unm=uname;
   $("#errlu").hide();
   $("#sform").trigger('reset');
   $('#sform').attr('action','/modifySchool');
   $('#sform').append("<input type=\"hidden\" name=\"oldname\" value=\""+name+"\"/>");
   $("#z1").val(name);
   $("#z2").val(uname);
   $("#z3").attr("placeholder","Enter New School Password");
   $("#z4").val(number);
   $("#z4").attr("name","contactNumber");
   $("#z5").val(address);
   $("#z6").val(email);
   $("#z6").attr("name","emailAddress");
   $("#headis").text("Edit School Data Below");
   $("#adds").text("Edit");
   $("#editSchool").modal('show');
}

function newschool(){
   $("#errlu").hide();
   $("#sform").trigger('reset');
   $('#sform').attr('action','/addSchool');
   $("#headis").text("Add New School");
   $("#z3").attr("placeholder","Enter School Password");
   $("#z4").attr("name","number");
   $("#z6").attr("name","email");
   $("#adds").text("Add");
   $("#editSchool").modal('show');
}

function waitplz(){
	  $("#sform").submit(function(e){
          e.preventDefault();
		    let data={},url;
			data["name"]=$("#z2").val();
			data["password"]=$("#z2").val();
			data["email"]=$("#z6").val();
			data["deviceLimit"]=-1;
			let uname=data["name"];
			if($("#sform").attr('action')=="/modifySchool"){ //modify
			    waitplz1(data,uname);
			}else{
	     	$.ajax({
              url:"http://35.200.152.63/api/users",
	          crossDomain: true,
	          headers: {
<<<<<<< HEAD
               "Authorization": "Basic " + btoa("admin:Girlneeds@"),
=======
               "Authorization": "Basic " + btoa("admin:admin"),
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
			   "Content-Type":"application/json"
              },
              type:"POST",
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
	   });
}

function waitplz1(data,uname){
     let index,data1;
	 $.ajax({
	   url:"http://35.200.152.63/api/users",
	   crossDomain: true,
	   headers: {
<<<<<<< HEAD
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),
=======
          "Authorization": "Basic " + btoa("admin:admin"),
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
		  "Accept":"application/json"
       },
       type:"GET",
	   xhrFields: {
        withCredentials: true
       },
       success:(res)=>{
		   res.forEach((val)=>{
			 if(val.name==unm){
			    index=val.id;
				data1=val;
			 }
		   });
		   data1["email"]=data["email"];
		   data1["name"]=data["name"];
		   data1["password"]=data["password"];
		   waitplz2(index,data1);   
	   },
	   error:(err)=>{
	   }
	  });
}

function waitplz2(index,data){
  $.ajax({
	   url:"http://35.200.152.63/api/users/"+index,
	   crossDomain: true,
	   headers: {
<<<<<<< HEAD
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),
=======
          "Authorization": "Basic " + btoa("admin:admin"),
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
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

function csvschool(){
   $("#csvsch").click();
}

function csvparent(){
   $("#csvpt").click();
}

$('#csvpt').change(function() {
	let fd=new FormData();
	fd.append("file",$('#csvpt')[0].files[0]);
	$("#cover").show();
    $.ajax({
       url:"/csvpadd",
       type:"POST",
       processData: false,
       cache: false,
       contentType: false,
       enctype: 'multipart/form-data',
       data:fd,
	   success:(res)=>{
	      let m= $.parseJSON(res);
		   $("#cover").hide();
		  if(m.status=="OK"){
		    window.location.reload();
		  }else{
			$("#mmc").text("Unable to import parents data.");
		    $(".errorma").modal('show');   
		  }
	   },
	   error:(err)=>{
		    $("#cover").hide();
	   }
	});
});


$('#csvsch').change(function() {
	let fd=new FormData();
	fd.append("file",$('#csvsch')[0].files[0]);
	$("#cover").show();
    $.ajax({
       url:"/csvadd",
       type:"POST",
       processData: false,
       cache: false,
       contentType: false,
       enctype: 'multipart/form-data',
       data:fd,
	   success:(res)=>{
	      let m= $.parseJSON(res);
		  if(m.status=="yes"){
			$("#cover").hide();
		    window.location.reload();
		  }else{
			$("#mmc").text("Error adding school data. May be csv file is incorrect or some of the data might have repeated.");
		    $(".errorma").modal('show');
		  }
	   },
	   error:(err)=>{
		    $("#cover").hide();
	   }
	});
});

function assigndata(number,name,id){
   $("#isu").hide();
   $("#am").css("float","right");
   $("#amm").show();
   $("#dform").trigger('reset');
   if($("#did option[value='"+id+"']").length==0){
      $("#did").append("<option value=\""+id+"\">"+id+"</option>");
	  $("#did").val(id);
	  $("#did").css("pointer-events","none");
	  $("#sid").css("pointer-events","none");
	  $("#bid").attr("disabled","disabled");
	  $("#ullu").text("Sorry no other empty devices found for assigning");
	  $("#am").attr('disabled','disabled');
   }else{
	 $("#el").hide();
     $("#did").val(id);
	 $("#did").css("pointer-events","");
	 $("#sid").css("pointer-events","");
	 $("#bid").removeAttr('disabled');
	 $("#am").removeAttr('disabled');
   }
   if(name!=null){
     $("#sid").val(name);
   }
   if(number!=0){
     $("#bid").val(number);
   }
   if(number.length==0 || number=="0" || number==0 || name.length==0 || name=="0" || name==0){
     $("#amm").hide();
   }
   $("#devicestates").modal('show');
}

function deletedevice(busno,school,device){
  if(school.length!=0){
    $("#mmp").text("You must unassign the device before deleting it");
    $("#errormd").modal('show');
  }else{
  
  $("#confirm").modal('show');
   document.getElementById("yescon").addEventListener("click",()=>{

   let index;
   
   
   $.ajax({
	   url:"http://35.200.152.63/api/devices/",
	   crossDomain: true,
	   headers: {
<<<<<<< HEAD
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),
=======
          "Authorization": "Basic " + btoa("admin:admin"),
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
		  "Accept":"application/json"
       },
       type:"GET",
	   xhrFields: {
        withCredentials: true
       },
       success:(res)=>{
			  for(let i=0;i<res.length;i++){
				 if(res[i].name==device){
				    index=res[i].id;
					break;
				 }
			  }
			  
			  
			  $.ajax({
	            url:"http://35.200.152.63/api/devices/"+index,
	            crossDomain: true,
	            headers: {
<<<<<<< HEAD
                  "Authorization": "Basic " + btoa("admin:Girlneeds@"),
=======
                  "Authorization": "Basic " + btoa("admin:admin"),
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
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
}

function newassign(){
   $("#amm").hide();
   $("#isu").hide();
   $("#am").css("float","center");
   $("#dform").trigger('reset');
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
       $.post("/unassign",data);
	   window.location.reload();
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
   let buses=new Array();
   let buses1=new Array();
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
	     buses.push(lg);
		 $("#y7"+n).val(lg);
	  }
	  if(gg!="0" && gg!=0 && gg.length!=0){
	     buses1.push(gg);
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
     $.post("/deleteParent",{mobilenumber:number,schoolname:name}).then((res)=>{
	    let m=$.parseJSON(res);
		if(m.status=="OK"){
		  window.location.reload();
		}
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
  $("#i"+a).remove();
  $("#y8"+a).remove();
}

function checksame(){
  let m=false;
  if($("#bid").val().indexOf(",")!=-1 || $("#bid").val().indexOf(".")!=-1){
     $("#isu").text("Please select or input proper values");
	  $("#isu").show();
  }else{
  busno.forEach((val,index)=>{
   if(val==$("#bid").val().toString() && name[index]==$("#sid").val().toString() && adeviceId[index]!=0 && adeviceId[index].length!=0 && adeviceId[index]!="0"){
       m=true;
   }
  });

  if(m==true){
    $("#devicestates").submit(function(e){
          e.preventDefault();
		  $("#isu").text("The vehicle numbered "+$("#bid").val().toString()+" of school "+$("#sid").val().toString()+" has already been assigned by another device");
		  $("#isu").show();
       });
  }else{
      $("#devicestates").unbind('submit').submit();
   }
 }
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
	 $(".statistic").show();
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").hide();
	 $(".school-data").hide();
	 $(".feedback-data").hide();
	 $(".billing-data").hide();
	 $(".parent-data").hide();
	 $(".device-data").hide();
	 $(".report-data").hide();
	 $(".child-data").hide();
	 $(".bus-data").hide();
	 $(".js-right-sidebar").removeClass("show-sidebar");
	 break;
	case 1: //school
	 $(".statistic").hide();
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").hide();
	 $(".feedback-data").hide();
	 $(".billing-data").hide();
	 $(".school-data").show();
	 $(".parent-data").hide();
	 $(".device-data").hide();
	 $(".report-data").hide();
	 $(".child-data").hide();
	 $(".bus-data").hide();
	  $(".js-right-sidebar").removeClass("show-sidebar");
	  break;
	case 2: //buses
	 $(".statistic").hide();
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").hide();
	 $(".school-data").hide();
	 $(".feedback-data").hide();
	 $(".billing-data").hide();
	 $(".parent-data").hide();
	 $(".device-data").hide();
	 $(".report-data").hide();
	 $(".child-data").hide();
	 $(".bus-data").show();
	 $(".js-right-sidebar").removeClass("show-sidebar");
	  break;
	case 3: //parents
	 $(".statistic").hide();
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").hide();
	 $(".school-data").hide();
	 $(".feedback-data").hide();
	 $(".billing-data").hide();
	 $(".parent-data").show();
	 $(".device-data").hide();
	 $(".report-data").hide();
	 $(".child-data").hide();
	 $(".bus-data").hide();
	 $(".js-right-sidebar").removeClass("show-sidebar");
	  break;
	case 4: //chidren
	 $(".statistic").hide();
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").hide();
	 $(".school-data").hide();
	 $(".feedback-data").hide();
	 $(".billing-data").hide();
	 $(".parent-data").hide();
	 $(".device-data").hide();
	 $(".report-data").hide();
	 $(".child-data").show();
	 $(".bus-data").hide();
	 $(".js-right-sidebar").removeClass("show-sidebar");
	  break;
	case 5: //reports
     $(".statistic").hide();
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").hide();
	 $(".school-data").hide();
	 $(".feedback-data").hide();
	 $(".billing-data").hide();
	 $(".parent-data").hide();
	 $(".device-data").hide();
	 $(".report-data").show();
	 $(".child-data").hide();
	 $(".bus-data").hide();	  
	 $(".js-right-sidebar").removeClass("show-sidebar");
	  break;
	case 6: //devices
	 $(".statistic").hide();
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").hide();
	 $(".school-data").hide();
	 $(".feedback-data").hide();
	 $(".billing-data").hide();
	 $(".parent-data").hide();
	 $(".device-data").show();
	 $(".report-data").hide();
	 $(".child-data").hide();
	 $(".bus-data").hide();  
	 $(".js-right-sidebar").removeClass("show-sidebar");
	 break;
	case 7: //map
	 $(".statistic").hide();
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").show();
	 $(".school-data").hide();
	 $(".feedback-data").hide();
	 $(".billing-data").hide();
	 $(".parent-data").hide();
	 $(".device-data").hide();
	 $(".report-data").hide();
	 $(".child-data").hide();
	 $(".bus-data").hide();  
	 $(".js-right-sidebar").removeClass("show-sidebar");
	 break;
	case 8://feedback
	 $(".statistic").hide();
	 $(".user-data").hide(); //user data is mean data
	 $(".map-data").hide();
	 $(".school-data").hide();
	 $(".feedback-data").show();
	 $(".billing-data").hide();
	 $(".parent-data").hide();
	 $(".device-data").hide();
	 $(".report-data").hide();
	 $(".child-data").hide();
	 $(".bus-data").hide();
	 $(".js-right-sidebar").removeClass("show-sidebar");
	 break;
	
	case 9: //billings
	$(".statistic").hide();
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
	break;
	
    case 10://settings
    $("#edituserdata").modal('show');
    $(".js-right-sidebar").removeClass("show-sidebar");
	break;
	
	case 11://signout
	localStorage.clear();
	window.location.replace("/logout");
	$(".js-right-sidebar").removeClass("show-sidebar");
	break;
	
  }
}

function addn1(){
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
	   headers: {
<<<<<<< HEAD
          "Authorization": "Basic " + btoa("admin:Girlneeds@"),
=======
          "Authorization": "Basic " + btoa("admin:admin"),
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
		  "Content-Type":"application/json"
       },
	   data:JSON.stringify(data),
	   xhrFields: {
        withCredentials: true
       },
       success:(res)=>{
		  /*$("#yahoo").text("The device has been succesfully added. Please refresh the site to view it on list.");
		  $('#yahoo').show();*/
		  window.location.reload();
	   },
	   error:(err)=>{
		  $("#yahoo").text("An unexpected error arised. Please try again");
		  $('#yahoo').show();
	   }
	});
  }
}

function sadd(){
   $("#deform").trigger('reset');
   $("#yahoo").hide();
   $("#addit").modal("show");
}


//new ones
function busadd(){
   $("#beform").trigger('reset');
   $("#headil").text("Add New Vehicle");
   $("#addde1").text("Add");
   $("#beform").attr("action","/busNumberWithDevice");
   $("#busit").modal('show');
}

function addn(){
	if(busno.indexOf($("#bd1").val())!=-1){
	  $("#beform").submit(function(e){
          e.preventDefault();
	      $("#busya").show();
	  });
	}else{
	    $("#beform").unbind('submit').submit();
	}
}

function editbus(busnumber,schoolname){
  $("#beform").trigger('reset');
  $("#headil").text("Edit Vehicle Below");
  $("#addde1").text("Edit");
  $("#beform").attr("action","/busupdate");
  $("#bd1").val(busnumber);
  $("#sd1").val(schoolname);
  $("#beform").append("<input type=\"hidden\" name=\"oldbus\" value=\""+busnumber+"\"></input>")
  $("#busit").modal('show');
}

function deletebus(busnumber,schoolname){
   $("#confirm").modal('show');
   document.getElementById("yescon").addEventListener("click",()=>{
    $("#beform").trigger('reset');
    $("#beform").attr("action","/busdelete");
    $("#bd1").val(busnumber);
    $("#sd1").val(schoolname);
    $("#beform").submit();
   });
}

function childadd(){
   $("#cheform").trigger('reset');
   $("#cheform").attr("action","/addchild");
   $("#headisi").text("Add New Child");
   $("#ch21").css("width","90%");
   $("#i21").show();
   $("#childit").modal('show');
}

function showother(elem){
   
   for(let i=0;i<lo.length;i++){
      if(lo[i].name==elem.value){
		if(lo[i].parents.length==0){
		   $("#pd2c").append("<option value=\"\">No any parents found under this school</option>");
		   break;
		}else{
			$("#pd2c").append("<option value=\"\" selected>Choose Parent Here</option>");
	      for(let j=0;j<lo[i].parents.length;j++){
		      $("#pd2c").append("<option value=\""+lo[i].parents[j].parentName+"\">"+lo[i].parents[j].parentName+"</option>");
			  break;
		  }
		}
	  }
   }
   $("#pd2c").show();
   $("#ttok").show();
}

function fexpandok(){
	  mt++;
      $("#ttok").append("<input type=\"text\" id=\"ch2"+mt+"\" name=\"childName\" style=\"width:90%; float:left; margin-left:15px; margin-bottom:10px; margin-top:10px;\" class=\"form-control\" placeholder=\"Enter Child Name\" required/>");
      $("#ttok").append("<i class=\"fas fa-minus\" style=\"float:right; margin-right:0px; margin-top:-30px; width:10%;\" id=\"i2"+mt+"\" onclick=\"fexpandnok("+mt+")\"></i>")
}

function fexpandnok(a){
     $("#ch2"+a).remove();
	 $("#i2"+a).remove();
}

function ceditdata(childname,parentname,schoolname){
   $("#cheform").trigger('reset');
   $("#cheform").attr("action","/editchild");
    $("#headisi").text("Edit Child Below");
   $("#cheform").append("<input type=\"hidden\" name=\"oldname\" value=\""+childname+"\"</input>");
   $("#i21").hide();
   $("#ch21").css("width","95%");
   $("#ch21").val(childname);
   $("#s2c").val(schoolname);
   showother(document.getElementById("s2c"));
   $("#pd2c").val(parentname);
   $("#pd2c").css("pointer-events","none");
   $("#s2c").css("pointer-events","none");
   if($("#ttok input").length>1){
       $("#ttok > input:gt(0)").remove();
   }
   $("#ttok .fas").hide();
   $("#childit").modal('show');
}

function cdeletedata(childname,parentname,schoolname){
   $("#confirm").modal('show');
   document.getElementById("yescon").addEventListener("click",()=>{
    $("#cheform").trigger('reset');
    $("#cheform").attr("action","/deletechild");
	$("#cheform").append("<input type=\"hidden\" name=\"oldname\" value=\""+childname+"\"</input>")
    $("#ch21").val(childname);
    $("#s2c").val(schoolname);
    $("#cheform").append("<input type=\"hidden\" name=\"parentName\" value=\""+parentname+"\"</input>");
    if($("#ttok input").length>1){
       $("#ttok > input:gt(0)").remove();
    }
   $("#cheform").submit();
   });
}


