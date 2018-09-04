const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
let bcrypt=require('bcryptjs');

var userSchema=new mongoose.Schema({
  username:String,
  password:String
});

userSchema.statics.findByCredentials=function(username,password){
  return this.findOne({username}).then((user)=>{
    if (!user){
      return 0;
    }else{
	  return user;
    }
  });
}

userSchema.methods.saveRecord=function(){
  var user=this;
return   user.save().then((doc)=>{
    return doc;
  },(err)=>{
    return err;
  });
};

userSchema.pre('save',function(next){  //this middleware runs prior to every save function of userSchema instance.
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


userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("user",userSchema);
