const scrapeRightMove = require('./scrapeRightMove');
const scrapePrime = require('./scrapePrime');

async function scrape(url) {
  if (url.includes('rightmove')) {
    return scrapeRightMove.scrape(url);
  } else if (url.includes('primelocation')) {
    return scrapePrime.scrape(url);
  }
}

exports.scrape = scrape;
