const { until, By } = require('selenium-webdriver');
const url = require('url');
const { Scraper } = require('./Scraper');

class RightMoveScraper extends Scraper {
  getRent = async () => {
    const rentDiv = this.driver.wait(until.elementLocated(By.className('_1gfnqJ3Vtd1z40MlC0MzXu')));
    const rentSpan = await rentDiv.findElement(By.xpath('span'));
    const text = await rentSpan.getText();
    return text.replace(/\D/g, '');
  }

  getBaths = async () => {
    const div = this.driver.wait(until.elementLocated(By.xpath('//div[@class="tmJOVKTrHAB4bLpcMjzQ" and text()="BATHROOMS"]/../..//div[@class="_1fcftXUEbWfJOJzIUeIHKt"]')));
    const text = await div.getText();
    return text.replace(/\D/g, '');
  }

  getFurnished = async () => {
    return await this._getLettingDetails('Furnish type: ')
  }

  getAvailableFrom = async () => {
    try {
      return await this._getLettingDetails('Let available date: ')
    } catch (e) {
      return "N/A"
    }
  }

  scrapeLocation = async () => {
    const mapDiv = this.driver.wait(until.elementLocated(By.className('_1kck3jRw2PGQSOEy3Lihgp')));
    const mapImg = await mapDiv.findElement(By.xpath('img'));
    const _url = await mapImg.getAttribute('src');

    const queryData = url.parse(_url, true).query;
    return `${queryData.latitude},${queryData.longitude}`;
  }

  _getLettingDetails = async (selectionText) => {
    const div = this.driver.wait(until.elementLocated(By.xpath(`//dt[text()="${selectionText}"]/../dd`)), 5000);
    const text = await div.getText();
    return text;
  }
}

exports.RightMoveScraper = RightMoveScraper;
