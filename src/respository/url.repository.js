const Url = require("../model/url.model");
const Counter = require("../model/url.counter.model");

//genreate the autoincrement numeric id

const getNextSequence = async () =>{
  const counter = await Counter.findOneAndUpdate(
    {name : "url_counter"},
    {$inc : {value : 1}},
    {new : true, upsert : true}
  )

  return counter.value;
}

exports.create = async (originalUrl) =>{
  const numericId = await getNextSequence();
  console.log("creating url in db..." , originalUrl);

  await Url.create({
    numericId : numericId,
    originalUrl : originalUrl
  })

  console.log("url created successfully");
  return numericId;
}

exports.updatedCode = async(id,code)=>{
  console.log("updating short code ");
  return Url.findByIdAndUpdate(id, {shortCode : code}, {new : true});
}

exports.findByCode = async (code) =>{
  console.log("finding url by code : ", code);
  return Url.findOne({shortCode : code});
}