const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const keys = require('../keys.json');
const got = require('got');

class Scraper {
  locationGS = "51.516421,-0.105012";
  locationBR = "51.515675,-0.086898";

  scrape = async (url) => {
    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().addArguments('--headless'))
      .build();
    try {
      await this.driver.get(url);
      const rent = await this.getRent(this.driver);
      const travel = await this.getTravelInfo(this.driver);
      const baths = await this.getBaths(this.driver);
      const furnished = await this.getFurnished(this.driver);
      const date = await this.getAvailableFrom(this.driver)

      travel.unshift(rent)
      travel.push(furnished);
      travel.push(baths)
      travel.push(date);
      travel.push(url);
      return travel;
    } finally {
      await this.driver.quit();
    }
  }

  getRent = async () => { }
  getBaths = async () => { }
  getFurnished = async () => { }
  getAvailableFrom = async () => { }
  getLocation = async () => { }

  getTravelInfo = async () => {
    const flatLoc = await this.scrapeLocation();

    const [distGS, timeGS] = await this.getWalkingInfo(flatLoc, this.locationGS);
    const [distBR, timeBR] = await this.getWalkingInfo(flatLoc, this.locationBR);

    return [distGS, distBR, timeGS, timeBR];
  }

  getWalkingInfo = async (wp1, wp2) => {
    const req = `http://dev.virtualearth.net/REST/v1/Routes/Walking?wp.1=${wp1}&wp.2=${wp2}&distanceUnit=mi&key=${keys.bing_key}`
    const res = await got(req);
    const obj = JSON.parse(res.body).resourceSets[0].resources[0];
    const distance = obj.travelDistance;
    const time = obj.travelDuration;
    return [distance, time / 60];
  }
}

exports.Scraper = Scraper;
