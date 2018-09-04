let bcrypt=require('bcryptjs');
let nodemailer=require('nodemailer');
let shortid = require('shortid');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'girlssafetytransport@gmail.com',
    pass: 'Kad@01072018'
  }
});

function sendemail(email,res){
  let code=shortid.generate();
  let mailOptions = {
    from: 'Girls Safety Transport',
    to: email,
    subject: 'Password recovery code',
    text: 'The password recovery code for your Girls Safety Transport account is '+code.toString()
  };
 
 transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    res.send(JSON.stringify({status:"nOK"}));
  }else{
	//console.log(code);
    res.send(JSON.stringify({status:"OK",code:code}));
  }
});

}

module.exports={
  sendemail:sendemail
}
