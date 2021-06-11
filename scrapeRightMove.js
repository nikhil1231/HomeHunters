const path = require('path');
const { Builder, until, By } = require('selenium-webdriver');
const { ServiceBuilder } = require('selenium-webdriver/chrome');
const chrome = require('selenium-webdriver/chrome');
const url = require('url');
const got = require('got');
const keys = require('./keys.json');

const driverPath = path.join(__dirname, 'chromedriver.exe');
const serviceBuilder = new ServiceBuilder(driverPath);

const locationGS = "51.516421,-0.105012";
const locationBR = "51.515675,-0.086898";

async function scrape(url) {
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments('--headless'))
    .build();
  try {
    await driver.get(url);
    const rent = await getRent(driver);
    const travel = await getTravelInfo(driver);

    travel.unshift(rent)
    travel.push(url);
    return travel;
  } finally {
    await driver.quit();
  }
}

async function getRent(driver) {
  const rentDiv = driver.wait(until.elementLocated(By.className('_1gfnqJ3Vtd1z40MlC0MzXu')));
  const rentSpan = await rentDiv.findElement(By.xpath('span'));
  const text = await rentSpan.getText();
  return text.replace(/\D/g, '');
}

async function getTravelInfo(driver) {
  const flatLoc = await scrapeLocation(driver);

  const [ distGS, timeGS ] = await getRouteInfo(flatLoc, locationGS);
  const [ distBR, timeBR ] = await getRouteInfo(flatLoc, locationBR);

  return [distGS, distBR, timeGS, timeBR];
}

async function scrapeLocation(driver) {
  const mapDiv = driver.wait(until.elementLocated(By.className('_1kck3jRw2PGQSOEy3Lihgp')));
  const mapImg = await mapDiv.findElement(By.xpath('img'));
  const _url = await mapImg.getAttribute('src');

  const queryData = url.parse(_url, true).query;
  return `${queryData.latitude},${queryData.longitude}`;
}

async function getRouteInfo(wp1, wp2) {
  const req = `http://dev.virtualearth.net/REST/v1/Routes/Walking?wp.1=${wp1}&wp.2=${wp2}&distanceUnit=mi&key=${keys.bing_key}`
  const res = await got(req);
  obj = JSON.parse(res.body).resourceSets[0].resources[0];
  const distance = obj.travelDistance;
  const time = obj.travelDuration;
  return [distance, time / 60];
}

exports.scrape = scrape;
