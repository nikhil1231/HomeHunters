const { until, By } = require('selenium-webdriver');
const url = require('url');
const { Scraper } = require('./Scraper');

class ZooplaScraper extends Scraper {
  getRent = async () => {
    const rent = this.driver.wait(until.elementLocated(By.className('c-jdOIsX')));
    const text = await rent.getText();
    return text.replace(/\D/g, '');
  }

  getBaths = async () => {
    return '-'
  }

  getFurnished = async () => {
    return '-'
  }

  getAvailableFrom = async () => {
    return '-'
  }

  scrapeLocation = async () => {
    const mapDiv = this.driver.wait(until.elementLocated(By.className('css-1yhkozb')));
    const mapImg = await mapDiv.findElement(By.xpath('img'));
    const _url = await mapImg.getAttribute('src');

    const queryData = url.parse(_url, true).query;
    return `${queryData.center}`;
  }
}

exports.ZooplaScraper = ZooplaScraper;
