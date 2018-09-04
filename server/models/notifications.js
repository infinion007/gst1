const mongoose=require('mongoose');

let notifySchema=new mongoose.Schema({
  text:[String],
  status:[String],
  date:[String]
});

notifySchema.statics.add=function(text,status,date,res){
   this.update({},{$push:{text:text,status:status,date:date}},(err,result)=>{
      console.log(err);
	  console.log(result);
   });
}

module.exports=mongoose.model("notification",notifySchema);
