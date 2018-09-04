let code;
setTimeout(window.history.forward(),0);

 if(localStorage.getItem("type")=="admin"){
    window.location.replace("/adminpage");
 }else if(localStorage.getItem("type")=="school"){
    window.location.replace("/schoolpage");
 }



$(document).keypress(function(e) {
    if(e.which == 13) {
        login();
    }
});

function login(){
	    if($("#uname").val().length==0||$("#pass").val().length==0){
		   $("#mm").text("Either of the inputs is invalid");
		}else{
		   $.post("/loginnow",{username:$("#uname").val(),password:$("#pass").val()}).then((res)=>{
		      let m=$.parseJSON(res);
			  if(m.status=="OK1"){
			      localStorage.setItem("type","admin");
			      window.location.replace("/adminpage");
			  }else if(m.status=="OK2"){
			       localStorage.setItem("type","school");
			       window.location.replace("/schoolpage");
			  }else{
			     $("#mm").text("No account with such credentials found.");
			  }
		   });
		}
}

function enteruser(){
	$("#mgl").hide();
    $("#passrecover").modal('show');
}

function submitit(){
  if($("#credname").val().length==0){
     $("#mgl").show();
  }else{
	$.post('/adminpass',{username:$("#credname").val()}).then((res)=>{
      let m=$.parseJSON(res);
	  if(m.status=="OK"){
	     code=m.code;
		 $("#passrecover").modal('hide');
		 $("#codeenter").modal('show');
	  }else{
		 $("#passrecover").modal('hide');
	     $("#nofound").modal('show');
	  }
    });
  }
}

function checksame(){
  if($("#code").val()==code){
	  $("#codeenter").modal('hide');
	  $("#pg1").hide();
      $("#passenter").modal('show');
  }else{
	 $("#ee").text("The code you entered didn't math with the one we emailed you");
	 $("#codeenter").modal('hide');
     $("#nofound").modal('show');
  }
}

function passchange(){
  if($("#pass1").val().length==0){
     $("#pg1").show();
  }else{
    $.post('/adminpasschange',{password:$("#pass1").val()}).then((res)=>{
      let m=$.parseJSON(res);
	  if(m.status=="OK"){
	     $("#ee").text("Your password has been successfully changed");
	     $("#passenter").modal('hide');
         $("#nofound").modal('show');
	  }else{
	     $("#ee").text("An error occurred. Please try again later.");
	     $("#passenter").modal('hide');
         $("#nofound").modal('show');
	  }
    });
  }
}


