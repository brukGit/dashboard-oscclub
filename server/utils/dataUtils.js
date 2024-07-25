const axios = require('axios');


const fetchDataFromAPI = async (countries, yearRange) => {
  try {
    const indicators = [
      { code: 'DT.DOD.DLXF.CD', source: 6 },
      { code: 'SE.XPD.TOTL.GB.ZS', source: 2 },
      { code: 'SP.POP.TOTL', source: 2 }
    ];
    const [startYear, endYear] = yearRange;

    const dataPromises = Object.entries(countries).map(async ([countryName, countryCode]) => {
      const countryData = {};
      for (const indicator of indicators) {
        const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator.code}?date=${startYear}:${endYear}&format=json`;
        try {
          const response = await axios.get(url);
          if (response.data[1]) {
            countryData[indicator.code] = response.data[1];
          } else {
            console.warn(`No data for ${countryName} (${countryCode}) and indicator ${indicator.code}`);
          }
        } catch (err) {
          console.warn(`Error fetching data for ${countryName} (${countryCode}) and indicator ${indicator.code}: ${err.message}`);
        }
      }
      // fetch country info
      const profileUrl = `https://api.worldbank.org/v2/country/${countryCode}?format=json`;
      // const profileUrl = `https://api.worldbank.org/v2/country?format=json`;
      try {
        const response = await axios.get(profileUrl);
        const data = response.data[1]; // Access the data directly
        console.log(data);
        if (response.data) {
          countryData['country_profile'] = response.data[1];
        } else {
          console.warn(`No profile data for ${countryName} (${countryCode})`);
        }
      } catch (err) {
        console.warn(`Error fetching profile data for ${countryName} (${countryCode}): ${err.message}`);
      }

      return { country: countryName, code: countryCode, data: countryData };
    });

    const data = await Promise.all(dataPromises);
    return data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error; // This will be caught by the outer try-catch in `fetchWorldBankData`
  }
};


module.exports = {
    fetchDataFromAPI,
};
