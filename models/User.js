const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name :{
    type : String,
    required : true
  } , username :{
    type : String,
    required : true
  } ,  email :{
    type : String,
    required : true
  } , mobilenumber :{
    type : String,
    required : true
  } , password :{
    type : String,
    required : true
  } ,
   companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product" // <-- this is the key
  }, fromdate : {
    type:Date,
    default : Date.now
  }
});

const useer = mongoose.model('user',UserSchema);
module.exports = useer;
