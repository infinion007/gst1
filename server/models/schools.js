const mongoose=require('mongoose');
const _=require('lodash');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const passportLocalMongoose=require('passport-local-mongoose');

let busSchema=new mongoose.Schema({
  busNumber:{
    type:String,
	default:"0"
  },
  deviceName:{
    type:String
  }
});
let childSchema=new mongoose.Schema({
  childName:{
    type:String
  },
  busNumber:{ //morning
    type:String,
	default:"0"
  },
  busNumber1:{ //evening
    type:String,
	default:"0"
  }
});

let notifySchema=new mongoose.Schema({
  text:[String],
  date:[String]
});

let paySchema=new mongoose.Schema({
   name:[String],
   mobileNumber:[String],
   amount:[Number]
});

let feedSchema=new mongoose.Schema({
  text:[String],
  by:[String],
  school:[String]
});

let parentSchema=new mongoose.Schema({
  mobileNumber:{
    type:Number
  },
  parentName:{
    type:String
  },
  address:{
    type:String
  },
  emailAddress:{
    type:String
  },
  password:{
     type:String
  },
  paid:{
    type:Number,
	default:0
  },
  children:[childSchema]
});


let schoolSchema=new mongoose.Schema({
  name:{
    type:String
  },
  password:{
    type:String
  },
  username:{
    type:String
  },
  address:{
    type:String
  },
  emailAddress:{
    type:String
  },
  contactNumber:{
    type:Number
  },
  service:{
    type:String,
    default:"GST"
  },

  parents:[parentSchema],
  buses:[busSchema]
});


schoolSchema.methods.saveRecord=function(){
  let user=this;
return   user.save().then((doc)=>{
    return doc;
  },(err)=>{
    return err;
  });
};

schoolSchema.pre('save',function(next){  //this middleware runs prior to every save function of userSchema instance.
  if (this.isModified('password')){//only hashes the password if the password is modified ,for other operation
    //no hashing is done to avoid multiple hashing of passwords
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(this.password,salt,(err,hash)=>{
        this.password=hash;
		next();
      });
    });
  }else{
    next();
  }
});



schoolSchema.statics.findByCredentials=function(username,password){
  return this.findOne({username}).then((user)=>{
    if (!user){
      return 0;
    }else{
	  return user;
    }
  });
  
}

/*let notification=mongoose.model('notification',notificationSchema);
schoolSchema.methods.addParentNotice=function(text){
  let docs=this.parentnotification;
  docs.push({text,seen:false});
  this.set('parentnotification',docs);
  this.save();
};
schoolSchema.statics.addSchoolNotice=function(text,schools){
  let newnotification=new notification({text:text});
  let user=this;
  console.log(schools);
  _.forEach(schools,function(school){
   // console.log(school);
    user.findOneAndUpdate({name:school},{$push:{schoolnotification:newnotification}},(err,result)=>{

    });
  });
  return 1;
};

schoolSchema.statics.addParentNotice=function(text,schools){
  let newnotification=new notification({text:text});
  let user=this;
  console.log(schools);
  _.forEach(schools,function(school){
   // console.log(school);
    user.findOneAndUpdate({name:school},{$push:{parentnotification:newnotification}},(err,result)=>{

    });
  });
  return 1;
}*/
schoolSchema.statics.removeSchool=function(schoolName,res){
  this.findOneAndDelete({name:schoolName},(err,result)=>{
    res.send(JSON.stringify({status:"OK"}));
  });
}

schoolSchema.statics.modifySchool=function(schoolName,modifiedSchool){
  return this.findOneAndUpdate({name:schoolName},modifiedSchool,(err,result)=>{
    return 1;
  });
}

schoolSchema.statics.removeParent=function(mobileNumber,schoolName,from1,res){
  let a;
  this.findOne({name:schoolName},(err,result1)=>{
       for(let i=0;i<result1.parents.length;i++){
			     if(result1.parents[i].mobileNumber==parseFloat(mobileNumber)){
				    a=result1.parents[i];
					break;
				 }
			}
	  this.findOneAndUpdate({name:schoolName},{$pull:{parents:{mobileNumber}}},(err,result)=>{
          if(from1=="school"){
		     notification.add("The parent named "+a.parentName+" under school named "+schoolName+" has been deleted",new Date().toLocaleString(),res,0);
		  }else{
		   res.redirect("/");
		  }
      });
  });
};


schoolSchema.methods.genAuthToken=function(){
  let access='auth';
  let token=jwt.sign({_id:this._id.toHexString(),access},'abc123').toString();
  //this.tokens.push({access,token});// using ES6 syntax as opposed to access:access and token:token
  return this.save().then(()=>{
    return token
  });
};

schoolSchema.methods.removeToken=function(token){
  return this.update({
    $pull:{
      tokens:{token}
    }
  });
};

schoolSchema.statics.findByToken=function(token){
  let decoded;
  try{
    decoded=jwt.verify(token,'abc123');
  }catch(e){
     return Promise.reject();
  }
  return this.findOne({
    _id:decoded._id,
    'tokens.token':token,//if there is dot in between, you need to wrap in quotes
    'tokens.access':'auth'
  });
};


schoolSchema.statics.addChild=function(schoolname,parentname,childs,from1,res){
   let count=1;
   let busnum=new Array();
   let childname=new Array();
   if(typeof childs=="object"){
      for(let i=0;i<childs.length;i++){
	    busnum.push(0);
		childname.push(childs[i]);
		count++;
	  }
   }else{
      busnum.push(0);
	  childname.push(childs);
   }
   this.findOne({name:schoolname},(err,result)=>{
      result.parents.forEach((val,index)=>{
	     if(val.parentName==parentname){
		   let newparent=new parent({mobileNumber:val.mobileNumber,parentName:val.parentName,address:val.address,emailAddress:val.emailAddress,children:[]});
		   
		   val.children.forEach((value,index1)=>{
		       busnum.push(val.children[index1].busNumber);
			   childname.push(value.childName);
		   });
		   for(let i=0;i<childname.length;i++){
			    let newchild=new child({busNumber:busnum[i],childName:childname[i]});
				newparent.children.push(newchild);
			}
		   this.findOneAndUpdate({name:schoolname},{$pull:{parents:{parentName:val.parentName}}},(err,result1)=>{
		      this.findOneAndUpdate({name:schoolname},{$push:{parents:newparent}},(err,result2)=>{
				     if(from1=="school"){
					    notification.add("Children named "+childname.join(",")+" has been added under parent named "+parentname+" of school named "+schoolname,new Date().toLocaleString(),res,1);
					 }else{
					   res.redirect("/");
					 }					   
			  });
		   });
		 }
	  });
   });
}

schoolSchema.statics.editChild=function(schoolname,parentname,childs,oldchild,from1,res){
   let busnum=new Array();
   let childname=new Array();
   busnum.push(0);
   childname.push(childs);
   this.findOne({name:schoolname},(err,result)=>{
      result.parents.forEach((val,index)=>{
	     if(val.parentName==parentname){
		   let newparent=new parent({mobileNumber:val.mobileNumber,parentName:val.parentName,address:val.address,emailAddress:val.emailAddress,children:[]});
		   
		   val.children.forEach((value,index1)=>{
		       busnum.push(val.children[index1].busNumber);
			   if(value.childName!=oldchild){
			       childname.push(value.childName);
			   }
		   });
		   console.log(childname);
		   for(let i=0;i<childname.length;i++){
			    let newchild=new child({busNumber:busnum[i],childName:childname[i]});
				newparent.children.push(newchild);
			}
		   this.findOneAndUpdate({name:schoolname},{$pull:{parents:{parentName:val.parentName}}},(err,result1)=>{
		      this.findOneAndUpdate({name:schoolname},{$push:{parents:newparent}},(err,result2)=>{
				  if(from1=="school"){
					    notification.add("Child named "+oldchild+" under parent named "+parentname+" of school named "+schoolname+" has been modified to "+childs,new Date().toLocaleString(),res,1);
				  }else{
					 res.redirect("/");
				  }					 
			  });
		   });
		 }
	  });
   });
}

schoolSchema.statics.deleteChild=function(schoolname,parentname,childs,oldchild,from1,res){
   let busnum=new Array();
   let childname=new Array();
   this.findOne({name:schoolname},(err,result)=>{
	  result.parents.forEach((val,index)=>{
	     if(val.parentName==parentname){
		   let newparent=new parent({mobileNumber:val.mobileNumber,parentName:val.parentName,address:val.address,emailAddress:val.emailAddress,children:[]});
		   
		   val.children.forEach((value,index1)=>{
			   if(value.childName!=oldchild){
			       childname.push(value.childName);
				   busnum.push(val.children[index1].busNumber);
			   }
		   });
		   for(let i=0;i<childname.length;i++){
			    let newchild=new child({busNumber:busnum[i],childName:childname[i]});
				newparent.children.push(newchild);
			}
		   this.findOneAndUpdate({name:schoolname},{$pull:{parents:{parentName:val.parentName}}},(err,result1)=>{
		      this.findOneAndUpdate({name:schoolname},{$push:{parents:newparent}},(err,result2)=>{
				  if(from1=="school"){
					    notification.add("Child named "+oldchild+" under parent named "+parentname+" of school named "+schoolname+" has been deleted",new Date().toLocaleString(),res,1);
				  }else{
					 res.redirect("/");
				  }					 
			  });
		   });
		 }
	  });
   });
}

schoolSchema.statics.unassignbus=function(busNumber,schoolName,from1,details,res){
   let a;
   this.findOne({name:schoolName},(err,result)=>{
	  result.buses.forEach((val,index)=>{
	     if(val.busNumber==busNumber){
		   a=val;
		   result.buses.splice(index,1);
		 }
	  });
	  a.deviceName="0";
	  result.buses.push(a);
	  this.findOneAndUpdate({name:schoolName},{$set:{buses:result.buses}},(err,result1)=>{
	    if(from1=="school"){
		   notification.add("The device with name "+details.deviceName+" has been unassigned from bus numbered "+busNumber+" of school named "+schoolName,new Date().toLocaleString(),res,1);
	   }else{
	       res.redirect("/");
	   }
	  });
   });
}

schoolSchema.statics.deletebus=function(busNumber,schoolName,from1,res){
	this.findOneAndUpdate({name:schoolName},{$pull:{buses:{busNumber:busNumber}}},(err,result)=>{
	   if(from1=="school"){
          notification.add("The bus numbered "+busNumber+" of school named "+schoolName+" has been deleted",new Date().toLocaleString(),res,0);	      
	   }else{
	      res.redirect("/");
	   }
	});
}

schoolSchema.statics.getstuds=function(parentnum,time,res){
	  let students=new Array();
	  let devices=new Array();
	  let buses=new Array();
	  let a,name,address,scaddress,paid,email;

	  this.findOne({"parents.mobileNumber":parentnum},(err,result)=>{
		scaddress=result.address;
		for(let i=0;i<result.parents.length;i++){
		   if(result.parents[i].mobileNumber==parentnum){
				    a=result.parents[i];
					break;
			}
	     }
		 name=a.parentName;
		 address=a.address;
		 paid=a.paid;
		 email=a.emailAddress;
		 if(a.children.length==0){
		    res.send(JSON.stringify({status:"empty",name:result.parentName}));
		 }else{
		    a.children.forEach((val,index)=>{
			   students.push(val.childName);
			   if(time>=0 && time<12){
			     buses.push(val.busNumber);
			   }else{
			     buses.push(val.busNumber1);
			   }
			});
			 if(result.buses.length==0){
			   for(let i=0;i<buses.length;i++){
			      devices.push(0);
			   }
			 }else{
			 
             			 
			
			 for(let i=0;i<buses.length;i++){
			    result.buses.forEach((val,index)=>{    
					if(val.busNumber==buses[i]){
					    devices.push(val.deviceName);
					}
				});
			   }
			 
			 
			 }
			res.send(JSON.stringify({status:"nempty",students:students,name:name,deviceid:devices,address:address,scaddress:scaddress,paid:paid,email:email}));
		 }
	  });
}

notifySchema.statics.sendnotice=function(socket){
   this.find({},(err,result)=>{
      if(result.length==0){
	     socket.emit("notification","no")
	  }else{
	    socket.emit("notification",JSON.stringify({text:result[0].text,date:result[0].date}))
	  }
   });
}


notifySchema.statics.add=function(text,date,res,a){
   this.find({},(err,result)=>{
      if(result.length==0){
	     let notice=new notification({text:[text],date:[date]});
		 notice.save().then((err,doc)=>{
		  if(a==0){
		    res.send(JSON.stringify({status:"OK"}));
		  }else{
		    res.redirect('/');
		  }
		 });
	  }else{
	    this.update({},{$push:{text:text,date:date}},(err,result)=>{
		  if(a==0){
            res.send(JSON.stringify({status:"OK"}));
		  }else{
		    res.redirect('/');
		  }
        });
	  }
   });
}

feedSchema.statics.add=function(text,by,school,res){
   this.find({},(err,result)=>{
      if(result.length==0){
	     let feedbacks=new feedback({text:[text],by:[by],school:[school]});
		 feedbacks.save().then((err,doc)=>{
		    res.send(JSON.stringify({status:"OK"}));
		 });
	  }else{
	    this.update({},{$push:{text:text,by:by,school:school}},(err,result)=>{
            res.send(JSON.stringify({status:"OK"}));
        });
	  }
   });
}

feedSchema.statics.sendfeed=function(socket){
   this.find({},(err,result)=>{
      if(result.length==0){
	     socket.emit("feeds","no")
	  }else{
	     socket.emit("feeds",JSON.stringify({text:result[0].text,by:result[0].by,school:result[0].school}))
	  }
   });
}

paySchema.statics.add=function(name,number,amount,res){
   this.find({},(err,result)=>{
      if(result.length==0){
	     let payments=new payment({name:[name],mobileNumber:[number],amount:[amount]});
		 payments.save().then((err,doc)=>{
		    res.send(JSON.stringify({status:"OK"}));
		 });
	  }else{
	    this.update({},{$push:{name:name,mobileNumber:number,amount:amount}},(err,result)=>{
            res.send(JSON.stringify({status:"OK"}));
        });
	  }
   });
}

paySchema.statics.sendpay=function(socket){
   this.find({},(err,result)=>{
      if(result.length==0){
	     socket.emit("pays","no")
	  }else{
	     socket.emit("pays",JSON.stringify({name:result[0].name,number:result[0].mobileNumber,amount:result[0].amount}))
	  }
   });
}


schoolSchema.plugin(passportLocalMongoose);
let school=mongoose.model('school',schoolSchema);
let child=mongoose.model('child',childSchema);
let bus=mongoose.model('bus',busSchema);
let parent=mongoose.model('parent',parentSchema);
let notification=mongoose.model("notification",notifySchema);
let feedback=mongoose.model("feedback",feedSchema);
let payment=mongoose.model("payment",paySchema);

module.exports={school,child,parent,notification,feedback,bus,payment}
