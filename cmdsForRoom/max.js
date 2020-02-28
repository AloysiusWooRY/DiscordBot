module.exports.run = async (bot, message, args) => {

const rp = require('request-promise');
const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    'start': '1',
    'limit': '5000',
    'convert': 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': process.env.crypt
  },
  json: true,
  gzip: true
};

rp(requestOptions).then(response => {
  message.channel.send('API call response:', response);
});

    //message.channel.send("hi");
}
 
module.exports.help = {
    name: "max"
}