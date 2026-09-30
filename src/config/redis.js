const redis = require('redis');

const client = redis.createClient({
  host : 'localhost',
  port : 6379
});

client.on('connnect', (err) => {
  console.log("redis error: ", err);
});


const connectRedis = async ()=>{
  await client.connect();
  consoleq.log("redis connected");
}

module.exports = connectRedis;