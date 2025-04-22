const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/fetch-result/:hallticket', async (req, res) => {
  const hallticket = req.params.hallticket;

  try {
    const url = `https://results.cgg.gov.in/ResultMemorandum.do?htno=${hallticket}`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Example parsing logic — must be updated after live results release
    const name = $('td:contains("Candidate Name")').next().text().trim();
    const fatherName = $('td:contains("Father\'s Name")').next().text().trim();
    const totalMarks = $('td:contains("Total Marks")').next().text().trim();

    res.json({
      hallticket,
      name,
      fatherName,
      totalMarks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch result' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
