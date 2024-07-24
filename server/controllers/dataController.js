const pool = require('../app');
const { fetchDataFromAPI } = require('../utils/dataUtils');
// const { processAndSaveData } = require('../utils/dataProcessing');

require('dotenv').config();

exports.testData = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM ${process.env.DB_TABLE_TEST}`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchWorldBankData = async (req, res) => {
  try {
    console.log('Received request params:', req.query);

    const countries = req.query.countries ? JSON.parse(req.query.countries) : { Ethiopia: 'ETH' };
    const yearRange = req.query.yearRange ? req.query.yearRange.map(Number) : [2010, 2020];

    console.log('Processed params:', { countries, yearRange });

    const data = await fetchDataFromAPI(countries, yearRange);
    
    console.log('Fetched data:', JSON.stringify(data, null, 2));
    
    res.json(data);
  } catch (error) {
    console.error('Error in fetchWorldBankData:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};
