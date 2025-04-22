const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/fetch-result/:hallticket", async (req, res) => {
  const hallticket = req.params.hallticket;

  try {
    const formData = new URLSearchParams({
      ctl00$ContentPlaceHolder1$txtHTNO: hallticket,
      __EVENTTARGET: "",
      __EVENTARGUMENT: "",
      __VIEWSTATE: "<VIEWSTATE_HERE>",  // Optional: you can fetch this first if required
      __VIEWSTATEGENERATOR: "<GENERATOR_HERE>",  // Optional
      __ASYNCPOST: "true",
      ctl00$ContentPlaceHolder1$btnSubmit: "Submit"
    });

    const response = await axios.post(
  "https://results.eenadu.net/tg-inter-2025/tg-inter-1st-year-results-general.aspx",
  formData,
  {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135.0.0.0 Safari/537.36",
      "Referer": "https://results.eenadu.net/tg-inter-2025/tg-inter-1st-year-results-general.aspx",
      "Origin": "https://results.eenadu.net",
      "X-Requested-With": "XMLHttpRequest",
      "Cookie": "ASP.NET_SessionId=ztspxn4izspdplduqyjff525; __AP_SESSION__=xxx;", // Add actual session cookie here
    },
  }
);


    // Parse HTML using cheerio
    const $ = cheerio.load(response.data);

    const name = $("span#ctl00_ContentPlaceHolder1_lblName").text().trim();
    const hallTicketNo = $("span#ctl00_ContentPlaceHolder1_lblHTNO").text().trim();
    const totalMarks = $("span#ctl00_ContentPlaceHolder1_lblTotal").text().trim();

    res.json({
      hallTicketNo,
      name,
      totalMarks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch result." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
