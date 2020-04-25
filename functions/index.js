const functions = require('firebase-functions');

const axios = require('axios');
const Url = require('url-parse');

exports.importYASB = functions.https.onCall((data, context) => {
  // The YASB serialization format relies on IDs only in YASB, so it's fragile to implement standalone
  // For our usage, we can use https://github.com/zacharyp/yasb-xws
  // If that's dead or bad, people can just export XWS from YASB
  const rawYasbUrl = data.url;
  const converterService = 'https://squad2xws.herokuapp.com';
  const yasbUrl = new Url(rawYasbUrl);
  return axios.get(`${converterService}/${yasbUrl.query}`)
    .then(r => {
      const fullParseUrl = new Url(rawYasbUrl, null, true);
      return Object.assign({}, r.data, {
        // Extract squad name from the YASB url query string
        name: fullParseUrl.query.sn
      });
    })
    .catch(e => {
      console.error(e);
      return null;
    });
});
