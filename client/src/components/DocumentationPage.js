import React, { useState } from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import modelView from '../assets/images/model_view.jpg';

const DocContainer = styled.div`
  display: flex;
  height: calc(100vh - 60px);
`;

const Sidebar = styled.div`
  width: 200px;
  background-color: #f0e6e1;
  padding: 1rem;
`;

const ViewerSection = styled.div`
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const SectionButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: ${props => props.active ? '#C7672D' : 'transparent'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  text-align: left;
  cursor: pointer;
`;

const DataModel = styled.img`
  height: 400px;
  width: auto;
`;

const CodeBlock = styled(SyntaxHighlighter)`
  font-family: 'Fira Code', monospace;
`;

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('codebase');

  const sections = {
    techstack: {
      title: 'Tech Stack',
      content: (
        <>
          <h2>Tech stack</h2>
          <ul>
            <b>Client side</b>
            <li>React</li>
            <li>React Redux</li>
            <li>React Router</li>
            <li>Material UI</li>
            <li>Axios</li>
            <li>Styled Components</li>
          </ul>

          <ul>
            <b>Server side</b>
            <li>Node</li>
            <li>Express</li>
            <li>PostgreSQL</li>
            <li>Node Fetch</li>
            <li>dotenv</li>
            <li>cors</li>
            <li>pandas-js</li>
           
          </ul>

          <ul>
            <b>Dashboard</b>
            <li>plotly.js</li>
            <li>react-plotly.js</li>
          </ul>
         
        </>
      )
    },

    codebase: {
      title: 'Codebase',
      content: (
        <>
          <h2>Client side API request.</h2>
          <CodeBlock language="javascript" style={vscDarkPlus}>
            {`  
    // url for dev and production mode.
    const apiUrl = process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_URL_PROD 
    : process.env.REACT_APP_API_URL_DEV;

    // fetch data
            
    const fetchData = useCallback(async (countries, years) => {
    const cacheKey = JSON.stringify({ countries, years });
    if (cache[cacheKey]) {
      setData(cache[cacheKey]);
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get(apiUrl, {
        params: {
          countries: JSON.stringify(countries),
          yearRange: years
        },
      });
  
      setData(response.data);
      setCache(prevCache => ({ ...prevCache, [cacheKey]: response.data }));
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
        console.log('error...',error);
      } else {
        setError('An error occurred while fetching data');
      }
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  }, [cache]);

const debouncedFetchData = useCallback(
  debounce((countries, years) => fetchData(countries, years), 300),
  [fetchData]
);

useEffect(() => {
  debouncedFetchData(selectedCountries, yearRange);
}, [selectedCountries, yearRange, debouncedFetchData]);`}
          </CodeBlock>
          <h2>PostgreSQL Setup.</h2>
          <CodeBlock language="javascript" style = {vscDarkPlus}>
            {`
   
     const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

module.exports = pool;
`}
            </CodeBlock>

          <h2>Server side processing.</h2>
          <CodeBlock language="javascript" style = {vscDarkPlus}>
            {`
  exports.fetchWorldBankData = async (req, res) => {
  try {
    const countries = req.query.countries ? JSON.parse(req.query.countries) : { Ethiopia: 'ETH' };
    const yearRange = req.query.yearRange ? req.query.yearRange.map(Number) : [2010, 2020];

    const data = await fetchDataFromAPI(countries, yearRange);
    
    res.json(data);
  } catch (error) {
    console.error('Error in fetchWorldBankData:', error);
    res.status(500).json({ error: error.message });
  }
};

// Send request to World Bank API
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
        const url = 'https://api.worldbank.org/v2/country/$countryCode/indicator/$indicator.code?date=$startYear}:$endYear}&format=json';
        try {
          const response = await axios.get(url);
          if (response.data[1]) {
            countryData[indicator.code] = response.data[1];
          } else {
            console.warn('No data for '$countryName}' ($countryCode}) and indicator $indicator.code}');
          }
        } catch (err) {
          console.warn('Error fetching data for $countryName} ($countryCode}) and indicator $indicator.code}: $err.message}');
        }
      }
      // fetch country info
      const profileUrl = 'https://api.worldbank.org/v2/country/$countryCode}?format=json';
     
      try {
        const response = await axios.get(profileUrl);
        const data = response.data[1]; // Access the data directly
        console.log(data);
        if (response.data) {
          countryData['country_profile'] = response.data[1];
        } else {
          console.warn('No profile data for $countryName} ($countryCode})');
        }
      } catch (err) {
        console.warn('Error fetching profile data for $countryName} ($countryCode}): $err.message}');
      }

      return { country: countryName, code: countryCode, data: countryData };
    });

    const data = await Promise.all(dataPromises);
    return data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error; // This will be caught by the outer try-catch in 'fetchWorldBankData'
  }
};
`}
            </CodeBlock>

            <h2>Client side dashboard with plotly.</h2>
          <CodeBlock language="javascript" style = {vscDarkPlus}>
            {`
  return (
          <div className='container-plot'>
            <div>
            <Plot
              data={educationLineChartData}
              layout={{
                title: {
                  text: 'Education Expenditure Per Government Expenditure(%), <br>years $yearRange[0]} to $yearRange[1]}',
                  font: {
                    size: 16
                  }
                },
                xaxis: {
                  title: 'Year',
                  dtick: 1,
                  tickformat: 'd'
                },
                yaxis: {
                  title: {
                    text: 'Expenditure per Government Expenditure (%)',
                    font: { color: 'blue' }
                  },
                  tickfont: { color: 'blue' }
                },
                yaxis: { title: 'Year' },
                width: '100%',
                height: 400,
                annotations: [
                  {
                    text: 'Source: World Bank. WBI Indicator SE.XPD.TOTL.GB.ZS',
                    x: 0.5,
                    xref: 'paper',
                    y: 1.1,
                    yref: 'paper',
                    showarrow: false,
                    font: {
                      size: 12
                    }
                  }
                ],

              }}
              style={{ width: '80%', height: 400 }}
            />
            </div>

            <div className='container-card'>
              <h4>Average Education Expenditure Per Government Expenditure</h4>
              <p>{averageExpenditure}%</p>
            </div>
          </div>
        );
`}
            </CodeBlock>
            
        </>
      )
    },
   
    scalability: {
      title: 'Scalability considerations',
      content: (
        <>
          <ul>
            <li>Client Side: Implementing a range of easy to use country, indicator seletion and filtering tools.</li>
            <li>Database: Using PostgreSQL allows for handling large datasets and complex queries.</li>
            <li>Caching: Implementing caching both server-side and client-side will improve performance as data grows.</li>
            <li>API Design: Designing the API with pagination and filtering options allows for efficient data retrieval.</li>
            <li>Component Design: Creating reusable chart components allows for easy addition of new visualizations.</li>
            <li>Data Processing: Performing heavy computations server-side reduces client-side load.</li>
            <li>Virtualization: For future scalability, we should implement virtualization for long lists of countries or data points.</li>




          </ul>
        </>
      )
    }
  };

  return (
    <DocContainer>
      <Sidebar>
        {Object.entries(sections).map(([key, { title }]) => (
          <SectionButton
            key={key}
            active={activeSection === key}
            onClick={() => setActiveSection(key)}
          >
            {title}
          </SectionButton>
        ))}
      </Sidebar>
      <ViewerSection>
        {sections[activeSection].content}
      </ViewerSection>
    </DocContainer>
  );
};

export default DocumentationPage;
