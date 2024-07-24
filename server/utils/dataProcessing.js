const { Pool } = require('pg');
const pandas = require('pandas-js');
const pool = require('../db');

require('dotenv').config();

const processAndSaveData = async () => {
  try {
    // Load the data (replace this with your actual data fetching logic)
    const data = await pool.query('SELECT * FROM process.env.DB_TABLE_TEST');

    // Process data with pandas (example)
    const df = new pandas.DataFrame(data.rows);
    // Perform your processing here
    df = df.groupby('country').sum();

    // Save processed data back to the database
    const processedData = df.to_json();  // Convert to JSON or desired format
    await pool.query('INSERT INTO processed_data (data) VALUES ($1)', [processedData]);
  } catch (error) {
    console.error('Error processing data:', error);
    throw error;
  }
};

module.exports = {
  processAndSaveData,
};
