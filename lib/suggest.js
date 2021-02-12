'use strict';

const request = require('./utils/request');
const R = require('ramda');

function suggest (getParseList, appData, opts) {
  return new Promise(function (resolve, reject) {
    if (!opts && !opts.term) {
      throw Error('term missing');
    }

    const lang = opts.lang || 'en';
    const country = opts.country || 'us';

    const term = encodeURIComponent(opts.term);
    const options = Object.assign({
      url: `https://market.android.com/suggest/SuggRequest?json=1&c=3&query=${term}&hl=${lang}&gl=${country}`,
      json: true,
      followAllRedirects: true
    }, opts.requestOptions);

    request(options, opts.throttle)
      .then(function (res) {
        const suggestions = R.pluck('s', res);
        resolve(suggestions);
      })
      .catch(reject)
      .then((results) => {
        if (opts.fullDetail) {
          // if full detail is wanted get it from the app module
          return Promise.all(results.map((app) => appData({ ...opts, appId: app.appId })));
        }
        return results;
      });
  });
}

module.exports = suggest;
