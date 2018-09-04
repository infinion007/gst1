let filePath,uname,old;
const express=                require('express'),
      passport=               require('passport'),
      bodyParser=             require('body-parser'),
      passportLocalMongoose=  require('passport-local-mongoose'),
      localStrategy=          require('passport-local'),
      mongoose=               require('./server/db/mongoose.js'),
      user=                   require('./server/models/user.js'),
	  route=require('./router.js'),

	  misc=require('./misc.js');
      _=require('lodash'),
      axios=require('axios'),
	  bcrypt=require('bcryptjs'),
	  qs = require('querystring');		

//const enAddressUrl='http://admin:admin@35.200.152.63/api/positions';
const enAddressUrl='http://admin:admin@35.200.152.63/api/devices/';


let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let http=require('http');
let csvtojson=require("csvtojson");
let fileUpload = require('express-fileupload');


let {school,child,parent,notification,feedback,bus,payment}= require('./server/models/schools.js');
let path = require("path");
let cors=require('cors');
let jsonexport = require('jsonexport');
let fs=require('fs');
let app=express();
let server=http.createServer(app);
let io=require('socket.io').listen(server);
let shortid = require('shortid');
let num;

/*app.use(function (req, res, next){
  if (req.headers['x-forwarded-proto'] === 'https') {
    res.redirect('http://' + req.hostname + req.url);
  } else {
    next();
  }
});*/

app.use(cors());
app.use(fileUpload());
app.use(require('express-session')({
 secret: "hey you,yes you!",
 store: new MongoStore({ url: 'mongodb://localhost/sessions' }),
 resave:true,
 saveUninitialized:true,
 cookie: {expires: new Date(253402300000000)}
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended:true, parameterLimit:50000}));
app.use(express.static(__dirname+'/public'));
app.set('viewengine','ejs');
app.use('/static',express.static(__dirname+'/pics'));



io.sockets.on('connection', function (socket) {
	 socket.on('getit',(data)=>{
	   notification.sendnotice(socket);
	 });
	 socket.on('feedit',(data)=>{
	   feedback.sendfeed(socket);
	 });
	 socket.on('payit',(data)=>{
	   payment.sendpay(socket);
	 });
 });

//------------
//Routes
//------------

function countDetails(req,res,next){
  let c=0,
      b=0,
      p=0,
      s=0,
      schoolchildnumber=[];
  school.find({service:'GST'},(err,schools)=>{
    ////console.log(schools);
    _.map(schools,function(school){
      school.parents.forEach((val,index)=>{
	      c+=val.children.length;
	  });
      b+=school.buses.length;
      p+=school.parents.length;
      s+=1;
    });
    let countRecord={children:c,buses:b,parents:p,schoolno:s};
    //console.log(countRecord);
	req.count=countRecord;
    next();
  });
};

function devicestates(req,res,next){
  let result=[];
  let result1=[];
  let livedevices=[];
  school.find({service:"GST"}).then((docs)=>{
    axios.get("http://admin:Girlneeds@@35.200.152.63/api/devices/").then((r1)=>{

	_.forEach(docs,function(school){
      _.forEach(school.buses,function(bus){
	    _.forEach(r1.data,(val)=>{
			   
			   if(val.name==bus.deviceName){
			         result.push({name:school.name,busno:bus.busNumber,deviceId:val.positionId,deviceName:val.name});
                     livedevices.push(val.name);			 
			   }else{
			         result.push({name:school.name,busno:bus.busNumber,deviceId:0,deviceName:bus.deviceName});			 
			   }
			   
			});
		});
      });
	  for(let i=0;i<r1.data.length;i++){
		    if(livedevices.indexOf(r1.data[i].name)==-1){
			   result1.push({name:null,busno:0,deviceId:r1.data[i].positionId,deviceName:r1.data[i].name});
			}
	  }
	  result1=_.uniqBy(result1,'deviceName');
	  result=_.uniqBy(result,'busno');
	  result=result.concat(result1);
	  //console.log(result);
	  req.result=result;
      next();
    });
  });
}
//---------------------------------------------------------
//middleware that returns the total schools array--
//----------------
function getSchools(req,res,next){
  school.find({service:'GST'},(err,schools)=>{
    req.schools=schools;
    next();
  });
};
//------------------------
//---middleware for school dashboard
//---------------



app.get('/',(req,res)=>{
     //console.log(req.session.admin);
     res.render('login.ejs');
});

app.get('/adminpage',getSchools,countDetails,devicestates,(req,res)=>{
 if(req.session.admin=="yes"){
      res.render('maindashboard.ejs',{schools:req.schools,children:req.count.children,buses:req.count.buses,parents:req.count.parents,schoolno:req.count.schoolno,result:req.result});
 }else{
    res.redirect("/");
 }
});

app.get('/schoolpage',(req,res)=>{
 if(req.session.admin=="yes" || req.session.admin=="" || req.session.admin==undefined){
     res.redirect("/");
 }else{
   let cnum=0;
   school.findOne({username:req.session.admin},(err,result)=>{
		  let id=new Array();
		  let names=new Array();
		  result.parents.forEach((val,index)=>{
		     cnum+=val.children.length;
		  });
		  let address1="http://"+result.emailAddress+":"+req.session.admin+"@35.200.152.63/api/devices/";
           axios.get(address1).then((response)=>{
              let allDevices=response.data;
			  ////console.log(allDevices);
              _.forEach(allDevices,function(device){
                  id.push(device.positionId);
				  names.push(device.name);
	        });
			//console.log(result);
	        res.render('schooldashboard.ejs',{school:result,ids:id,names:names,cnum:cnum});
         });
    });
 }
});

app.post('/loginnow',(req,res)=>{
   user.findByCredentials(req.body.username,req.body.password).then((user)=>{
      if(user!=0){
	      checkpass(req.body.username,user.password,req.body.password,0,res,req);
	  }else{
		 school.findByCredentials(req.body.username,req.body.password).then((user)=>{
		   if(user!=0){
		       checkpass(req.body.username,user.password,req.body.password,1,res,req);
		   }else{
		       res.send(JSON.stringify({status:"no"}));
		   }
         });
	  }
   });
});

function checkpass(username,hash,nohash,a,res,req){
  bcrypt.compare(nohash,hash,(err,result)=>{
	if (result){
          if(a==0){
		     req.session.admin="yes";
			 old="yes";
		   req.session.save(function(err) {
		      res.send(JSON.stringify({status:"OK1"}));
                   });
		  }else{
	             req.session.admin=req.body.username;
				 old=req.body.username;
		     req.session.save(function(err) {
		      res.send(JSON.stringify({status:"OK2"}));
                   });
		  }
        }else{
          res.send(JSON.stringify({status:"no"}));
        }
      });
}

app.post('/adminit',(req,res)=>{
   user.remove({},(err)=>{
     let users=new user({username:req.body.username,password:req.body.password});
     users.save().then((err,doc)=>{
	    res.redirect('/');
     });
   });
});



app.post('/adminsignup',(req,res)=>{
  let users=new user({username:req.body.username,password:req.body.password});
  users.save().then((err,doc)=>{
      res.send(JSON.stringify({status:"OK"}));
  });
});



<<<<<<< HEAD

=======
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
app.get('/logout',(req,res)=>{
  req.session.admin="";
  res.redirect('/');
});

/*function isLoggedIn(req,res,next){
  if (req.isAuthenticated()){
    return next();
  }else {
    res.redirect('/loginpage');
  }
};*/
//------------------
//middleware to count number of records in the database i.e number of children,schools,parents,buses
//-------------





// ROUTE to load the addschool page


app.post('/addSchool',(req,res)=>{
  let body=_.pick(req.body,['name','username','address','password','number','email']);
  let newSchool=new school({name:body.name,password:body.password,username:body.username,address:body.address,contactNumber:body.number,emailAddress:body.email,parents:[],buses:[]
});
newSchool.save((err,doc)=>{
  res.redirect('/');
});
});


//app routes
app.post('/signin',(req,res)=>{  //app signin
	   let data=req.body;
	   let a;
	   school.findOne({"parents.mobileNumber":parseFloat(data.numin)},(err,result)=>{
	       if(result==null){
		       res.send(JSON.stringify({status:"nomatch"}));
		   }else{
		      for(let i=0;i<result.parents.length;i++){
			     if(result.parents[i].mobileNumber==parseFloat(data.numin)){
				    a=result.parents[i];
					break;
				 }
			   }
			   bcrypt.compare(data.passin,a.password,(err,val)=>{
			      if(val){
				     res.send(JSON.stringify({status:"OK"}));
				  }else{
				     res.send(JSON.stringify({status:"nomatch"}));
				  }
			   });
			}
	   });
});

app.post('/signup',(req,res)=>{  //app signup
	   let a,name;
	   let data=req.body;
	   let pic=req.files.file;
	   let path=__dirname+'/pics/'+data["numup"]+'.jpg';
	   pic.mv(path,(err)=>{
          if(err){
		    res.send(JSON.stringify({status:"nOK"}));
		  }else{
			
	        school.findOne({"parents.mobileNumber":parseFloat(data.numup)},(err,result)=>{
			  if(result!=null){
				  name=result.name;
				  bcrypt.hash(data.passup,10,(err,hash)=>{ 
			        for(let i=0;i<result.parents.length;i++){
			        if(result.parents[i].mobileNumber==parseFloat(data.numup)){
				       a=result.parents[i];
					   break;
				    }
			       }
		           a.password=hash;
		           school.findOneAndUpdate({"parents.mobileNumber":parseFloat(data.numup)},{$pull:{parents:{mobileNumber:parseFloat(data.numup)}}},(err,result1)=>{
		                school.findOne({name:name}).then((doc1)=>{
			             doc1.parents.push(a);
                         school.findOneAndUpdate({name:name},doc1,(err,result)=>{
						   res.send(JSON.stringify({status:"OK"}));
                         });
                  });
		        });
	           });
			}else{
				  fs.unlink(path,()=>{
                     res.send(JSON.stringify({status:"nofound"}));
	              });
				}
			});
		  }
	   });
   });
   
   app.post('/picedit',(req,res)=>{ //picedit
      let pic=req.files.file;
	  let path=__dirname+'/pics/'+req.body["num"]+'.jpg';
	  fs.unlink(path,()=>{
	     pic.mv(path,(err)=>{
          if(err){
		    res.send(JSON.stringify({status:"nOK"}));
		  }else{
		    res.send(JSON.stringify({status:"OK"}));
		  }
	   });
	  });
   });
   
   app.post("/checknum",(req,res)=>{ //checknumber app
	  let a;
	  //req.body["phone"];
      school.findOne({"parents.mobileNumber":parseFloat(req.body.phone)},(err,result)=>{
		 if(result==null){
			res.send(JSON.stringify({status:"no"}));
		 }else{
		   for(let i=0;i<result.parents.length;i++){
			     if(result.parents[i].mobileNumber==parseFloat(req.body.phone)){
				    a=result.parents[i];
					break;
				 }
			}
			if(a.password==null){
			   res.send(JSON.stringify({status:"no"}));
			}else{
              res.send(JSON.stringify({status:"yes"}));
			}
		 }
	  });
   });
   
   app.post('/sendcode',(req,res)=>{ //send email
	  let a;
	  school.findOne({"parents.mobileNumber":parseFloat(req.body.num)},(err,result)=>{
		 for(let i=0;i<result.parents.length;i++){
			     if(result.parents[i].mobileNumber==parseFloat(req.body.num)){
				    a=result.parents[i];
					break;
				 }
			}
			misc.sendemail(a.emailAddress,res);
	  });
   });
   
   app.post('/passrecover',(req,res)=>{ //password recover
      let data={},name;
	  data["phone"]=req.body["num"];
	  data["password"]=req.body["password"];
	  //misc.hashit(data,res,2);
	  bcrypt.hash(data.password,10,(err,hash)=>{
	    school.findOne({"parents.mobileNumber":parseFloat(req.body.num)},(err,result)=>{
	      name=result.name;
		  for(let i=0;i<result.parents.length;i++){
			     if(result.parents[i].mobileNumber==parseFloat(req.body.num)){
				    a=result.parents[i];
					break;
				 }
			}
		
		 a.password=hash;
		 
		  school.findOneAndUpdate({"parents.mobileNumber":parseFloat(req.body.num)},{$pull:{parents:{mobileNumber:parseFloat(req.body.num)}}},(err,result1)=>{
		     school.findOne({name:name}).then((doc1)=>{
			  doc1.parents.push(a);
              school.findOneAndUpdate({name:name},doc1,(err,result)=>{
                res.send(JSON.stringify({status:"done"}));
             });
            }); 
		  });
	  });
	  });
   });
   
   
   app.post('/csvadd',(req,res)=>{ 
     let pic=req.files.file;
	 let path=__dirname+'/public/csvs/schoolcsv.csv';
	 pic.mv(path,(err)=>{
       csvtojson().fromFile(path).then((data)=>{
       
	    for(let i=0;i<data.length;i++){
		 try{  
		   
		   let post={};
		   post["name"]=data[i].username;
		   post["email"]=data[i].email;
		   post["password"]=data[i].username;
		   post["deviceLimit"]=-1;
		   axios({
			    method: 'POST',
                headers: { 'content-type': 'application/json' },
				data:JSON.stringify(post),
				url:"http://admin:Girlneeds@@35.200.152.63/api/users"

		   }).then((result)=>{
		      
			  let body=_.pick(req.body,['name','username','address','password','number','email']);
              let newSchool=new school({name:data[i].name,password:data[i].password,username:data[i].username,address:data[i].address,contactNumber:data[i].number,emailAddress:data[i].email,parents:[],buses:[]});
              newSchool.save((err,doc)=>{
                
				if(data.length-i==1){
				   fs.unlink(path,(err)=>{
				      res.send(JSON.stringify({status:"yes"}));
				   });
				}
				
			  });
		   
		   }).catch((err)=>{
			    fs.unlink(path,(err)=>{
		          res.send(JSON.stringify({status:"no"}));
				});
		   });
		  }catch(err){
		     fs.unlink(path,(err)=>{
					res.send(JSON.stringify({status:"no"}));
			});
		  }
		 }
	  });
	 });
   });
   
   app.post('/csvpadd',(req,res)=>{
     let pic=req.files.file;
	 let path=__dirname+'/public/csvs/parentcsv.csv';
	 pic.mv(path,(err)=>{
       csvtojson().fromFile(path).then((data)=>{
		 try{
		  for(let i=0;i<data.length;i++){			
			 let cnum=data[i].mobilenumber;
			 let findex=data.findIndex(item=>item.mobilenumber==cnum);
			 if(findex!=i){
			
			   if(typeof data[findex].childname!="object"){
			      data[findex].childname=data[findex].childname.split(",");
			   }
			   if(typeof data[findex].busnumber!="object"){
			      data[findex].busnumber=data[findex].busnumber.split(",");
			   }
			   data[findex].childname.push(data[i].childname);
			   data[findex].busnumber.push(data[i].busnumber);
			 }
		    }
		 }catch(err){
		    fs.unlink(path,(err)=>{
					res.send(JSON.stringify({status:"no"}));
			});
		 }
	    
	      data=_.uniqBy(data,'mobilenumber');
		  data.forEach((val,index)=>{
		     addpcsv(val,path,res);
		  });
	   
	   });
	 });
   });
   
   app.post('/csvpadd1',(req,res)=>{
     let pic=req.files.file;
	 let path=__dirname+'/public/csvs/parentcsv1.csv';
	 pic.mv(path,(err)=>{
       csvtojson().fromFile(path).then((data)=>{
		 try{
		  for(let i=0;i<data.length;i++){
			 let cnum=data[i].mobilenumber;
			 let findex=data.findIndex(item=>item.mobilenumber==cnum);
			 if(findex!=i){
			
			   if(typeof data[findex].childname!="object"){
			      data[findex].childname=data[findex].childname.split(",");
			   }
			   if(typeof data[findex].busnumber!="object"){
			      data[findex].busnumber=data[findex].busnumber.split(",");
			   }
			   if(typeof data[findex].busnumber1!="object"){
			      data[findex].busnumber1=data[findex].busnumber1.split(",");
			   }
			   data[findex].childname.push(data[i].childname);
			   data[findex].busnumber.push(data[i].busnumber);
			   data[findex].busnumber1.push(data[i].busnumber1);
			 }
		    }
		 }catch(err){
		    console.log(err);
		    fs.unlink(path,(err)=>{
					res.send(JSON.stringify({status:"no"}));
			});
		 }
	    
	      data=_.uniqBy(data,'mobilenumber');
		  data.forEach((val,index)=>{
		     val.from="school";
			 val.schoolname=req.body.schoolname;
			 addpcsv(val,path,res);
		  });
	   
	   });
	 });
   });
   
   
  function addpcsv(data,path,res){
  let childpush,buses;
  let body=_.pick(data,['mobilenumber','childname','parentname','schoolname','busnumber','busnumber1','address','email','from']);
  let newparent=new parent({mobileNumber:body.mobilenumber,parentName:body.parentname,address:body.address,emailAddress:body.email,children:[]});
  if(typeof body.childname=="object"){
	for(let i=0;i<body.childname.length;i++){
	   if(body.busnumber[i].length==0){
	      body.busnumber[i]="0";
	   }
	   if(body.busnumber1[i].length==0){
	      body.busnumber1[i]="0";
	   }
	   childpush=new child({busNumber:body.busnumber[i],busNumber1:body.busNumber1[i],childName:body.childname[i]});
       newparent.children.push(childpush);
	}
  }else{
	if(body.busnumber.length==0){
	      body.busnumber="0";
	}
	if(body.busnumber1.length==0){
	      body.busnumber="0";
	}
    childpush=new child({busNumber:body.busnumber,busNumber1:body.busNumber1,childName:body.childname});
    newparent.children.push(childpush);
  }
  school.findOne({name:body.schoolname},(err,doc)=>{
    if(err){
	  fs.unlink(path,(err)=>{
	    res.send(JSON.stringify({status:"nOK"}));
	  });
	}else if(!doc){
	  fs.unlink(path,(err)=>{
	    res.send(JSON.stringify({status:"nOK"}));
	  });
	}else{
	doc.parents.push(newparent);
    
	school.findOneAndUpdate({name:body.schoolname},doc,()=>{
       if(body.from=="school"){ 
		fs.unlink(path,(err)=>{ 
		 notification.add("The school named "+body.schoolname+" added a new parent with name "+body.parentname,new Date().toLocaleString(),res,0);
		});
	   }else{
		fs.unlink(path,(err)=>{
	      res.send(JSON.stringify({status:"OK"}));
		});
	   }
    });
	
	}  
  });
 }
<<<<<<< HEAD
 
 app.post('/generate',(req,res)=>{
    route.route(req,res);
 });
=======
>>>>>>> f5645ad785ec1202d747e6e0a5722411e51568d0
   
   app.post('/getstuds',(req,res)=>{  //get all students data and deviceIds
      //db.getstuds(req.body["num"],res);
      //req.body.num //req.body.time
	    let time=new Date(req.body.date);
		school.getstuds(parseFloat(req.body.num),time.getHours(),res);
   });
   
   app.post('/paid',(req,res)=>{
	  //req.body.number req.body.amount
     let a,name,m;
	  school.findOne({"parents.mobileNumber":parseFloat(req.body.number)},(err,result)=>{
		  name=result.name;
		  for(let i=0;i<result.parents.length;i++){
			     if(result.parents[i].mobileNumber==parseFloat(req.body.number)){
				    a=result.parents[i];
					break;
				 }
			}
			a.paid=req.body.amount;
			school.findOneAndUpdate({"parents.mobileNumber":parseFloat(req.body.number)},{$pull:{parents:{mobileNumber:parseFloat(req.body.number)}}},(err,result)=>{
			   school.findOneAndUpdate({name:name},{$push:{parents:a}},(err,result1)=>{
				  payment.add(a.parentName,req.body.number,req.body.amount,res); 
			   });
			});
	  });
   });
   
   app.post('/addfeed',(req,res)=>{ //feedback
      //req.body.feedback and req.body.number
	  let a,name,m;
	  school.findOne({"parents.mobileNumber":parseFloat(req.body.number)},(err,result)=>{
		  for(let i=0;i<result.parents.length;i++){
			     if(result.parents[i].mobileNumber==parseFloat(req.body.number)){
				    a=result.parents[i];
					break;
				 }
			}
			feedback.add(req.body.feedback,a.parentName,req.body.number,res);
	  });
   });
   
   app.post('/editname',(req,res)=>{
      let a,name,b;
	  school.findOne({"parents.mobileNumber":parseFloat(req.body.num)},(err,result)=>{
	      name=result.name;
		  for(let i=0;i<result.parents.length;i++){
			     if(result.parents[i].mobileNumber==parseFloat(req.body.num)){
				    a=result.parents[i];
					break;
				 }
			}
		 b=a.parentName;
		 a.parentName=req.body.name;
		  school.findOneAndUpdate({"parents.mobileNumber":parseFloat(req.body.num)},{$pull:{parents:{mobileNumber:parseFloat(req.body.num)}}},(err,result1)=>{
		     school.findOne({name:name}).then((doc1)=>{
			  doc1.parents.push(a);
              school.findOneAndUpdate({name:name},doc1,(err,result)=>{
               notification.add("The name of parent named "+b+" of school named "+name+" has been changed to "+a.parentName,new Date().toLocaleString(),res,0);
             });
            }); 
		  });
	  });
   });
 
 //app ends



app.post("/adminpass",(req,res)=>{
   uname=req.body.username;
   user.findOne({username:req.body.username}).then((doc)=>{
       if(doc==null){
	      school.findOne({username:req.body.username}).then((doc1)=>{
		     if(doc1==null){
			    res.send(JSON.stringify({status:"nOK"}));
			 }else{
			    misc.sendemail(doc1.emailAddress,res);
			 }
		  });
	   }else{
	      misc.sendemail("girlssafetytransport@gmail.com",res);
	   }
   });
});



app.post("/adminpasschange",(req,res)=>{
	 user.findOne({username:uname}).then((doc)=>{
       if(doc==null){
	      school.findOne({username:uname}).then((doc1)=>{
		     if(doc1==null){
			    res.send(JSON.stringify({status:"nOK"}));
			 }else{
			   bcrypt.hash(req.body.password,10,(err,hash)=>{
			      school.findOneAndUpdate({username:uname},{$set:{password:hash}},(err,result)=>{
				   if(result){
					 notification.add("The school named "+doc1.name+" changed their password",new Date().toLocaleString(),res,0);
				   }
				 });
			   });
			 }
		  });
	   }else{
	      bcrypt.hash(req.body.password,10,(err,hash)=>{
			    user.findOneAndUpdate({username:uname},{$set:{password:hash}},(err,result)=>{
				   if(result){
				      res.send(JSON.stringify({status:"OK"}));
				   }
				});
		   });
	   }
   });
});





app.post("/csv",(req,res)=>{
   filePath=__dirname+"/public/data/report.csv";
   jsonexport(JSON.parse(req.body["data"]),function(err, csv){
    fs.writeFile(filePath,csv, function (err) {
       res.send(JSON.stringify({status:"OK"}));
    });
  });
});



app.post('/addParent',(req,res)=>{
  let childpush,count,buses;
  let body=_.pick(req.body,['mobilenumber','childname','parentname','schoolname','busnumber','busnumber1','address','email','from']);
  let newparent=new parent({mobileNumber:body.mobilenumber,parentName:body.parentname,address:body.address,emailAddress:body.email,children:[]});
  if(typeof body.childname=="object"){
	for(let i=0;i<body.childname.length;i++){
	   if(body.busnumber[i].length==0){
	      body.busnumber[i]="0";
	   }
	   if(body.busnumber1[i].length==0){
	      body.busnumber1[i]="0";
	   }
	   childpush=new child({busNumber:body.busnumber[i],busNumber1:body.busnumber1[i],childName:body.childname[i]});
       newparent.children.push(childpush);
	}
  }else{
	if(body.busnumber.length==0){
	      body.busnumber="0";
	}
	if(body.busnumber1.length==0){
	      body.busnumber1="0";
	}
    childpush=new child({busNumber:body.busnumber,busNumber1:body.busnumber1,childName:body.childname});
    newparent.children.push(childpush);
  }
  
  school.findOne({name:body.schoolname},(err,doc)=>{
    doc.parents.push(newparent);
    school.findOneAndUpdate({name:body.schoolname},doc,()=>{
       if(body.from=="school"){ 
		 notification.add("The school named "+body.schoolname+" added a new parent with name "+body.parentname,new Date().toLocaleString(),res,1);
	   }else{
	     res.redirect('/');
	   }
    });
  });

});


app.post('/busNumberWithDevice',(req,res)=>{
  let a=false,index;
  let body=_.pick(req.body,['deviceName','busnumber','schoolname','from']);
  ////console.log(body);
  if(typeof from=="object"){
    from=from[0];
  }
  school.findOne({name:body.schoolname}).then((doc)=>{
	 
     for(let i=0;i<doc.buses.length;i++){
	   if(doc.buses[i].busNumber==body.busnumber){
	     a=true;
		 index=i;
		 break;
	   }
	 }		 

	if(a==true){
		
		school.findOneAndUpdate({name:body.schoolname},{$pull:{buses:{busNumber:body.busnumber}}},(err,result1)=>{
			school.findOne({name:body.schoolname}).then((doc1)=>{
              doc1.buses.push({busNumber:body.busnumber,deviceName:body.deviceName});
              school.findOneAndUpdate({name:body.schoolname},doc1,(err,result)=>{
				if(body.from=="school"){
				   notification.add("The device with name "+body.deviceName+" has been assigned to bus numbered "+body.busnumber+" of school named "+body.schoolname,new Date().toLocaleString(),res,1);
				}else{
				   res.redirect('/');
				}
             });
          }); 
		});			
	}else{
	   doc.buses.push({busNumber:body.busnumber,deviceName:body.deviceName});
       school.findOneAndUpdate({name:body.schoolname},doc,(err,result)=>{
		if(body.from=="school"){
			notification.add("The device with name "+body.deviceName+" has been assigned to bus numbered "+body.busnumber+" of school named "+body.schoolname,new Date().toLocaleString(),res,1);
		}else{
		    res.redirect('/');
		}
      });
	}
   
   });
});

app.post('/busupdate',(req,res)=>{
   let body=_.pick(req.body,['deviceName','busnumber','schoolname','oldbus']);
   if(typeof oldbus=="object"){
       body.oldbus=body.oldbus[0];
   }
   school.findOneAndUpdate({name:body.schoolname},{$pull:{buses:{busNumber:body.oldbus}}},(err,result)=>{
    school.findOne({name:body.schoolname}).then((doc)=>{
      doc.buses.push({busNumber:body.busnumber,deviceName:body.deviceName});
      school.findOneAndUpdate({name:body.schoolname},doc,(err,result)=>{
        res.redirect('/');
      });
     });
   });
   
});

app.post('/busdelete',(req,res)=>{
   let body=_.pick(req.body,['deviceName','busnumber','schoolname','from']);
   school.unassignbus(body.busnumber,body.schoolname,body.from,body,res);
});

app.get('/getAllDevicesState',(req,res)=>{
  let result=[];
  let livedevices=[];
  school.find({service:"GST"}).then((docs)=>{
    _.forEach(docs,function(school){
      _.forEach(school.buses,function(bus){
        result.push({name:school.name,busno:bus.busNumber,deviceId:bus.deviceId});
        livedevices.push(bus.deviceId);
      });
    });
    axios.get(enAddressUrl).then((response)=>{
      let allDevices=response.data;
      _.forEach(allDevices,function(device){
        if (!(_.includes(livedevices,device.positionId))) {
          result.push({name:null,busno:0,deviceId:device.positionId,deviceName:device.name});
        }
      });
      res.send(result);
    });
  });
});



app.post('/modifySchool',(req,res)=>{
  
  if(typeof req.body.oldname=="object"){
	    req.body.oldname=req.body.oldname[0];
   }
  
  if (req.body.password.length==0){
    let body=_.pick(req.body,['name','username','address','emailAddress','contactNumber','oldname','from']);
    school.findOne({name:body.oldname},(err,result)=>{
	    body.password=result.password;
	    school.deleteOne({name:body.oldname},(err,result1)=>{
		      let newSchool=new school({name:body.name,password:body.password,username:body.username,address:body.address,contactNumber:body.contactNumber,emailAddress:body.emailAddress,parents:[],buses:[]});
		      newSchool.save().then((err,doc)=>{
				 if(body.from=="school"){
					req.session.admin=body.username;
					if(body.name==body.oldname){
					   notification.add("The school named "+body.oldname+" changed their details",new Date().toLocaleString(),res,1);
					}else{
					   notification.add("The school named "+body.oldname+" changed their details along with their name to "+body.name,new Date().toLocaleString(),res,1);
					}
				 }else{
			       res.redirect('/');
				 }
			  });
		});
	});
  }else{
	  let body=_.pick(req.body,['name','password','username','address','emailAddress','contactNumber','oldname','from']);
	  school.findOne({name:body.oldname},(err,result)=>{
	    bcrypt.genSalt(10,(err,salt)=>{
          bcrypt.hash(body.password,salt,(err,hash)=>{
			  body.password=hash;
		      if (school.modifySchool(body.oldname,body)){
				 if(body.from=="school"){
				    req.session.admin=body.username;
					if(body.name==body.oldname){
					   notification.add("The school named "+body.oldname+" changed their details",new Date().toLocaleString(),res,1);
					}else{
					   notification.add("The school named "+body.oldname+" changed their details along with their name to "+body.name,new Date().toLocaleString(),res,1);
					}
				 }else{
                   res.redirect('/');
				 }
               }
		  });
		});
	});
  }
});

app.post('/addchild',(req,res)=>{
   school.addChild(req.body.schoolName,req.body.parentName,req.body.childName,req.body.from,res);
});

app.post('/editchild',(req,res)=>{
   if(typeof req.body.oldname=="object"){
      req.body.oldname=req.body.oldname[0];
   }
   school.editChild(req.body.schoolName,req.body.parentName,req.body.childName,req.body.oldname,req.body.from,res);
});

app.post('/deletechild',(req,res)=>{
    if(typeof req.body.oldname=="object"){
      req.body.oldname=req.body.oldname[0];
   }
   if(typeof req.body.parentName=="object"){
       req.body.parentName=req.body.parentName[0];
   }
   school.deleteChild(req.body.schoolName,req.body.parentName,req.body.childName,req.body.oldname,req.body.from,res);
});

app.post('/devicenotice',(req,res)=>{
  if(req.session.school){
	school.findOne({username:req.session.admin},(err,result)=>{
      notification.add("A device with name "+req.body.name+" and uniqueID "+req.body.uniqueId+" has been added to the list by school named "+result.name,new Date().toLocaleString(),res,0);
    });
  }else{
     res.send(JSON.stringify({status:"OK"}));
  }
});

app.post('/deletenotice',(req,res)=>{
  if(req.session.school){
	school.findOne({username:req.session.school},(err,result)=>{
      notification.add("A device with name "+req.body.name+" has been deleted by school named "+result.name,new Date().toLocaleString(),res,0);
    });
  }else{
     res.send(JSON.stringify({status:"OK"}));
  }
});

app.post('/deleteSchool',(req,res)=>{
  school.removeSchool(req.body.schoolname,res);
});

//--------for parents
app.post('/modifyParent',(req,res)=>{
  let a;
  let buses=new Array();
  let olds=new Array();
  let prev=new Array();
  let body=_.pick(req.body,['mobilenumber','parentname','address','email','childname','busnumber','busnumber1','schoolname','oldnumber','from']);
  //buses=new bus({busNumber:[],deviceId:[]});
  if(typeof body.oldnumber=="object"){
    body.oldnumber=body.oldnumber[0];
  }
  let newparent=new parent({mobileNumber:body.mobilenumber,parentName:body.parentname,address:body.address,emailAddress:body.email,children:[]});
  
  school.findOne({name:body.schoolname},(err,result)=>{
	for(let i=0;i<result.parents.length;i++){
	   if(result.parents[i].mobileNumber==parseFloat(body.oldnumber)){
			a=result.parents[i];
			break;
		}
	}
  let finalnumber;
  school.findOneAndUpdate({service:'GST'},{$pull:{parents:{mobileNumber:body.oldnumber}}},(err,doc)=>{
    if (_.isArray(body.childname)){
	
	for (i=0;i<body.childname.length;i++){
      let childpush=new child({busNumber:body.busnumber[i],busNumber1:body.busnumber1[i],childName:body.childname[i]});
      newparent.children.push(childpush);
     }
	}else{
      let childpush=new child({busNumber:body.busnumber,busNumber1:body.busnumber1,childName:body.childname});
      newparent.children.push(childpush);
    }

    
  }).then(()=>{
      school.findOneAndUpdate({service:'GST'},{$push:{parents:newparent}},(err,doc)=>{
		   
		if(body.from=="school"){
		   if(body.parentname==a.parentName){
		      notification.add("The information regarding the parent named "+a.parentName+" under school named "+body.schoolname+" has been updated",new Date().toLocaleString(),res,1);
		   }else{
		     notification.add("The information regarding the parent named "+a.parentName+" under school named "+body.schoolname+" has been updated and name has been set to "+body.parentname,new Date().toLocaleString(),res,1); 
		   }
        }else{
		  res.redirect("/");
		}
	  
   });
  });
 });
});



app.post('/unassign',(req,res)=>{
   let body=_.pick(req.body,['deviceName','schoolName','busNumber','from','r']);
   school.unassignbus(body.busNumber,body.schoolName,body.from,body,res);
});

app.post('/deletebus',(req,res)=>{
  let body=_.pick(req.body,['number','name','from']);
  school.deletebus(body.number,body.name,body.from,res);
});

app.post('/deleteParent',(req,res)=>{
  school.removeParent(req.body.mobilenumber,req.body.schoolname,req.body.from1,res);
});


app.get('*', function(req, res) {
    res.render('login.ejs');
});


server.listen(process.env.PORT ||8080,()=>{
  ////console.log("server is up");
});
