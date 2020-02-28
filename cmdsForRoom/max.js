module.exports.run = async (bot, message, args) => {

const tok = process.env.crypt;
const rp = require('request-promise');
const requestOptions = {
  method: 'GET',
  uri: 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    'start': '1',
    'limit': '5000',
    'convert': 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': tok
  },
  json: true,
  gzip: true
};

rp(requestOptions).then(response => {
  console.log('API call response:', response);
}).catch((err) => {
  console.log('API call error:', err.message);
});

    //message.channel.send("hi");
}
 
module.exports.help = {
    name: "max"
}