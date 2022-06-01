const { RightMoveScraper } = require('./scraper/RightMoveScraper');
const { PrimeLocationScraper } = require('./scraper/PrimeLocationScraper');

async function scrape(url) {
  let scraper;
  if (url.includes('rightmove')) {
    scraper = new RightMoveScraper()
  } else if (url.includes('primelocation')) {
    scraper = new PrimeLocationScraper()
  }
  return scraper.scrape(url);
}

exports.scrape = scrape;
