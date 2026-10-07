module.exports = (err,req,res,next)=>{
  const status = err.statusCode || err.status || (err.name === 'ValidationError' ? 400 : err.code === 11000 ? 409 : 500);
  if (status >= 500) console.error(err);
  res.status(status).json({
    message : status === 409 ? 'A URL or short code already exists' : err.message
  })
}
