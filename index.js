const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const PORT = 3000;

app.get("/get-result/:hallticket", async (req, res) => {
  const hallticket = req.params.hallticket;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://results.eenadu.net/tg-inter-2025/tg-inter-1st-year-results-general.aspx", {
    waitUntil: "networkidle0",
  });

  // Fill the hallticket field and click Submit
  await page.type('#ctl00_ContentPlaceHolder1_txtHTNO', hallticket);
  await page.click('#ctl00_ContentPlaceHolder1_btnSubmit');

  // Wait for results to load
  await page.waitForSelector('#ctl00_ContentPlaceHolder1_lblName');

  const result = await page.evaluate(() => {
    return {
      name: document.querySelector('#ctl00_ContentPlaceHolder1_lblName')?.innerText,
      hallticket: document.querySelector('#ctl00_ContentPlaceHolder1_lblHTNO')?.innerText,
      total: document.querySelector('#ctl00_ContentPlaceHolder1_lblTotal')?.innerText,
    };
  });

  await browser.close();
  res.json(result);
});

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
