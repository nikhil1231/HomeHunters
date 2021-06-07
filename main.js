const {google} = require('googleapis');
const scrape = require('./scrape');
const keys = require('./keys.json');

REFRESH_RATE = 3 * 1000;

const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);
SHEET_ID = '1agYULqXgb_bO3NHd0SpY-m6n1rXXKNChAC1crUJ4l4I'

client.authorize((err, token) => {
  if (err) return console.log('Error authorising: ', err);

  console.log('connected');
});

const sheets = google.sheets({version: 'v4', auth: client});
const readNewOptions = {
  spreadsheetId: SHEET_ID,
  range: 'New!A1:A100',
};

const readExistingOptions = {
  spreadsheetId: SHEET_ID,
  range: 'Data!F1:F1000',
};

const writeOptions = {
  spreadsheetId: SHEET_ID,
  range: 'A1',
  valueInputOption: "USER_ENTERED",
  requestBody: {
    values: null,
  }
}

const deleteOptions = {
  spreadsheetId: SHEET_ID,
  range: 'New!A1:Z100',
}

async function run() {
  const data = await sheets.spreadsheets.values.get(readNewOptions);
  res = data.data.values;

  const existingReq = await sheets.spreadsheets.values.get(readExistingOptions);
  existing = existingReq.data.values;
  if (existing) {
    existing = existing.flat();
  }

  // Add each url
  if (res && res.length > 0) {
    urls = res.flat();
    for (const url of urls) {
      if (existing.includes(url)) continue;

      row = await scrape.scrape(url);
      append(row);
    }
  }

  // Clear the "New" sheet
  await sheets.spreadsheets.values.clear(deleteOptions);
}

async function append(row) {
  writeOptions.requestBody.values = [row]
  const res = await sheets.spreadsheets.values.append(writeOptions);
}

setInterval(() => {
  run();
}, REFRESH_RATE);
