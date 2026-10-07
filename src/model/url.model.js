const mongoose = require('mongoose');

//createing the model schema for the url shortener
const urlSchema = new mongoose.Schema({
  numericId: {
    type: Number,
    required: true,
    unique: true
  },
  originalUrl:{
        type:String,
        required:true,
        unique:true
    },
    shortCode:{
        type:String,
        required:true,
        unique:true
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
