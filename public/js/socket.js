let text,text1,date,pname,sname;
let socket = io();
notification();
feedback();
payment();
setInterval(notification,5000);
setInterval(feedback,60000);
setInterval(payment,9000);

function notification(){
  socket.emit("getit","ok");
  socket.on("notification",(data)=>{
    if(data=="no"){
	   $(".notifi-dropdown").empty();
	   $(".notifi-dropdown").css({
	      "height":"70px",
	   });
	   $(".notifi-dropdown").append("<div class=\"notifi__item\"><div class=\"bg-c1 img-cir img-40\"><i class=\"zmdi zmdi-email-open\"></i></div><div class=\"content\"><p>No any notifications found</p></div></div>");
	 }else{
	   let m=$.parseJSON(data);
	   let text=m.text.reverse();
	   let date=m.date.reverse();
	   $(".notifi-dropdown").empty();
	   if(text.length<5){
	     $(".notifi-dropdown").css({
	      "height":(text.length*120).toString()+"px"
	     });
	   }else{
	    $(".notifi-dropdown").css({
	      "height":"500px"
	     });
	   }
	   text.forEach((val,index)=>{
		$(".notifi-dropdown").append("<div class=\"notifi__item\"><div class=\"bg-c1 img-cir img-40\"><i class=\"zmdi zmdi-email-open\"></i></div><div class=\"content\"><p style=\"letter-spacing:1px; font-style:Arial;\">"+val+"</p><span class=\"date\">"+date[index]+"</span></div></div>");
	   });
	}
  });
}

function feedback(){
  socket.emit("feedit","ok");
  socket.on("feeds",(data)=>{
    if(data=="no"){
		$(".feedb").empty();
		$(".feedb").html("<tr><td colspan=\"3\" style=\"padding-top:150px; padding-bottom:150px; border-style:hidden;\" class=\"text-center\">No any feedbacks found</td></tr>");
	 }else{
	     $(".feedb").empty();
		 let m=$.parseJSON(data);
		 let text1=m.text.reverse();
		 let pname=m.by.reverse();
		 let sname=m.school.reverse();
		 text1.forEach((val,index)=>{
		    $(".feedb").append("<tr><td style=\"padding-left:50px;\">"+val+"</td><td>"+pname[index]+"</td><td>"+sname[index]+"</td></tr>");
		 });
	}
  });
}

function payment(){
  socket.emit("payit","ok");
  socket.on("pays",(data)=>{
    if(data=="no"){
       $(".payb").empty();
	   $(".payb").html("<tr><td colspan=\"3\" style=\"padding-top:150px; padding-bottom:150px; border-style:hidden;\" class=\"text-center\">No any feedbacks found</td></tr>");	
	}else{
       $(".payb").empty();
	   let m=$.parseJSON(data);
	   let text1=m.name.reverse();
	   let pnum=m.number.reverse();
	   let amu=m.amount.reverse();
	   text1.forEach((val,index)=>{
		    $(".payb").append("<tr><td style=\"padding-left:50px;\">"+val+"</td><td>"+pnum[index]+"</td><td>"+amu[index]+"</td></tr>");
	   });
	}
  });
}