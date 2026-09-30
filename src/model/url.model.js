const {mongoose} = require('mongoose');

//createing the model schema for the url shortener
const urlSchema = new mongoose.Schema({
  _id:Number,
    OriginalUrl:{
        type:String,
        required:true,
        unique:true
    },
    shortcode:{
        type:String,
        required:true
    },
    clickCount:{
        type:Number,
        required:true,
        default:0
    }
},{
    timestamps:true
});

module.exports = mongoose.model('Url',urlSchema);