const Url = require("../model/url.model");
const Counter = require("../model/url.counter.model");
const base62 = require("../utils/base62");

//genreate the autoincrement numeric id

exports.getNextSequence = async () =>{
  const counter = await Counter.findOneAndUpdate(
    {name : "url_counter"},
    {$inc : {value : 1}},
    {new : true, upsert : true}
  )

  return counter.value;
}

exports.create = async (numericId, originalUrl, shortCode) =>{
  console.log("creating url in db..." , originalUrl);

  await Url.create({
    numericId : numericId,
    originalUrl : originalUrl,
    shortCode: shortCode || base62.encode(numericId)
  })

  console.log("url created successfully");
  return numericId;
}

exports.findByCode = async (code) =>{
  console.log("finding url by code : ", code);
  return Url.findOne({shortCode : code});
}

exports.findByOriginalUrl = async (originalUrl) => {
  return Url.findOne({originalUrl});
}

exports.incrementClickCount = async (code) => {
  return Url.findOneAndUpdate(
    { shortCode: code },
    { $inc: { clickCount: 1 } },
    { new: true }
  );
};