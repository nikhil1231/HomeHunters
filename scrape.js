const { RightMoveScraper } = require('./scraper/RightMoveScraper');
const { PrimeLocationScraper } = require('./scraper/PrimeLocationScraper');
const { ZooplaScraper } = require('./scraper/ZooplaScraper');

async function scrape(url) {
  let scraper;
  if (url.includes('rightmove')) {
    scraper = new RightMoveScraper()
  } else if (url.includes('primelocation')) {
    scraper = new PrimeLocationScraper()
  } else if (url.includes('zoopla')) {
    scraper = new ZooplaScraper()
  }
  return scraper.scrape(url);
}

exports.scrape = scrape;
