const {mongoose,Schema} = require('mongoose');

//createing the model schema for the url shortener
const urlSchema = new Schema({
    OriginalUrl:{
        type:String,
        required:true,
        unique:true
    },
    short:{
        type:String,
        required:true
    },
    clicks:{
        type:Number,
        required:true,
        default:0
    }
},{
    timestamps:true
});

module.exports = mongoose.model('Url',urlSchema);