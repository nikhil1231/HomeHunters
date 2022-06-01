const { until, By } = require('selenium-webdriver');
const { Scraper } = require('./Scraper');

class PrimeLocationScraper extends Scraper {
  getRent = async () => {
    const rentDiv = this.driver.wait(until.elementLocated(By.className('listing-details-price')));
    const rentSpan = await rentDiv.findElement(By.className('price'));
    let text = await rentSpan.getText();
    text = text.split(' ')[0];
    return text.replace(/\D/g, '');
  }

  getBaths = async () => {
    const div = this.driver.wait(until.elementLocated(By.className('num-beds')));
    const text = await div.getText();
    return text.replace(/\D/g, '');
  }

  getFurnished = async () => {
    return "-"
  }

  getAvailableFrom = async () => {
    return "-"
  }

  scrapeLocation = async () => {
    const titleElement = this.driver.wait(until.elementLocated(By.className('listing-details-h1')));
    const title = await titleElement.getText();

    return encodeURI(title.split('Flat to rent in ')[1]);
  }

  _getLettingDetails = async (selectionText) => {
    const div = this.driver.wait(until.elementLocated(By.xpath(`//dt[text()="${selectionText}"]/../dd`)), 5000);
    const text = await div.getText();
    return text;
  }
}

exports.PrimeLocationScraper = PrimeLocationScraper;
