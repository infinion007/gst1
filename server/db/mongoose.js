var mongoose=require('mongoose');

mongoose.Promise=global.Promise;


mongoose.connect('mongodb://localhost:27017/GST',{ useNewUrlParser: true });
//mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true });
//mongoose.connect("mongodb://biplab:Meriaama12@ds131971.mlab.com:31971/gst_db",{ useNewUrlParser: true });

module.exports={mongoose};
