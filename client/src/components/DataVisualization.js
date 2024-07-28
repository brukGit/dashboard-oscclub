import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Plot from 'react-plotly.js';

import '../styles/data-visualizer.css';

const mapLayout = {
  title: 'Countries on Map',
  geo: {
    projection: { type: 'equirectangular' }
  },
  margin: {
    l: 20, // Left margin
    r: 20, // Right margin
    t: 40, // Top margin (reduced)
    b: 20  // Bottom margin
  },
  width: 500, // Reduced width
  height: 200  // Reduced height
};


const DataVisualization = ({ data }) => {
  const { selectedChartType, yearRange } = useSelector(state => state.filters);
  const [pieChartData, setPieChartData] = useState([]);
  const [educationLineChartData, setEducationLineChartData] = useState([]);
  const [comboChartData, setComboChartData] = useState([]);
  const [mapChartData, setMapChartData] = useState([]);
  const [averageExpenditure, setAverageExpenditure] = useState(0);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const debtData = data.map(country => {
      // console.log('country..', country.code);
      const debtInfo = country.data['DT.DOD.DLXF.CD'] || [];
      return {
        country: country.country,
        code: country.code,
        values: debtInfo.map(d => d.value),
        years: debtInfo.map(d => d.date)
      };
    });
    // console.log('debt..', debtData);

    const calculateAverageExpenditure = (educationData) => {
      let totalExpenditure = 0;
      let count = 0;

      educationData.forEach(country => {
        country.values.forEach(value => {
          if (value !== null) {
            totalExpenditure += value;
            count += 1;
          }
        });
      });

      return count > 0 ? (totalExpenditure / count).toFixed(2) : 0;
    };
    const educationData = data.map(country => {
      const educationInfo = country.data['SE.XPD.TOTL.GB.ZS'] || [];
      return {
        country: country.country,
        code: country.code,
        values: educationInfo.map(d => d.value),
        years: educationInfo.map(d => d.date)
      };
    });

    const averageExpenditure = calculateAverageExpenditure(educationData);

    const countryProfileData = data.map(country => {
      const countryInfo = country.data['country_profile'] ? country.data['country_profile'][0] : {};

      const latitude = parseFloat(countryInfo.latitude);
      const longitude = parseFloat(countryInfo.longitude);
      const region = countryInfo.region ? countryInfo.region.value : '';
      const capitalCity = countryInfo.capitalCity;

      if (isNaN(latitude) || isNaN(longitude)) {
        console.error("Invalid latitude or longitude:", latitude, longitude);
        return null; // Skip invalid data
      }

      return {
        country: countryInfo.name,
        code: country.code,
        latitude,
        longitude,
        region,
        capitalCity,
        latestValue: country.latestValue || 0 // Assuming latestValue exists or default to 0
      };
    }).filter(country => country !== null); // Filter out invalid entries

    console.log('countryprofile..', countryProfileData);


    const mapData = [
      {
        type: 'choropleth',
        locations: countryProfileData.map(country => country.code),
        z: countryProfileData.map(country => country.latitude),
        text: countryProfileData.map(country => country.country),
        colorscale: 'Viridis', // Change this to a different colorscale
        colorbar: { title: 'Latitude' },
        locationmode: 'ISO-3',
        hovertemplate:
        '<b>%{text}</b><br>' +
        'Country Code: %{location}<br>' +        
        'Capital City: %{customdata[0]}<br>' +
        'Region: %{customdata[1]}<br>'+
        'Latitude: %{z}<br>'      
          ,
        customdata: countryProfileData.map(country => [country.capitalCity, country.region]) 
      }
    ];


    console.log('mapChartData:', mapData); // Log the data to verify
    setMapChartData(mapData);


  

    const pieData = debtData.map(country => ({
      label: country.code,
      value: country.values[country.values.length - 1] || 0
    }));



    // Define a fixed color scheme
    const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];

    setPieChartData([
      {
        type: 'pie',
        values: pieData.map(d => d.value),
        labels: pieData.map(d => d.label),
        marker: { colors: colors },
        name: 'Debt Data Pie Chart'
      }
    ]);


    setEducationLineChartData(
      educationData.map((country, index) => ({
        type: 'scatter',
        mode: 'lines+markers',
        name: country.code,
        x: country.years,
        y: country.values,
        line: { color: colors[index] },
        yaxis: 'y2',
        showlegend: true
      }))
    );

    setAverageExpenditure(averageExpenditure);

    setComboChartData([
      ...debtData.map((country, index) => ({
        type: 'bar',
        name: country.code,
        x: country.years,
        y: country.values,
        stackgroup: 'one',
        marker: { color: colors[index] }, // Use the same color for bars
        showlegend: true
      })),
      {
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Average Education Data',
        x: educationData[0].years, // Use years from the first country
        y: educationData[0].years.map(year => {
          const yearData = educationData.map(country =>
            country.values[country.years.indexOf(year)]
          ).filter(val => val !== undefined);
          return yearData.length > 0 ? yearData.reduce((sum, val) => sum + val, 0) / yearData.length : null;
        }),
        line: { color: 'red' }, // Different color for the line
        yaxis: 'y2',
        showlegend: false
      }
    ]);



  }, [data]);




  const renderChart = () => {
    switch (selectedChartType) {
      case 'pie':
        return (
          <div className='container-plot'>
            <Plot
            data={pieChartData}
            layout={{
              title: {
                text: `External Debt Stock Long Term, relative comparison <br>years ${yearRange[0]} to ${yearRange[1]}`,
                font: 16

              },
              subtitle: 'External Debt Stock Long Term, WBI - DT.DOD.DLXF.CD',
              width: '100%',
              height: 350,
              annotations: [
                {
                  text: 'Source: World Bank. DSI Indicator DT.DOD.DLXF.CD',
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
            style={{ width: '100%', height: 350 }}
          />
          </div>
        );
      case 'line':
        return (
          <div className='container-plot'>

            <div>

              <Plot
                data={educationLineChartData}
                layout={{
                  title: {
                    text: `Education Expenditure Per Government Expenditure(%), <br>years ${yearRange[0]} to ${yearRange[1]}`,
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
                  height: 350,
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
                style={{ width: '100%', height: 350 }}
              />
            </div>

            <div className='container-card'>
              <span>Average Education Expenditure Per Government Expenditure</span>
              <p>{averageExpenditure}%</p>
            </div>
          </div>
        );


      case 'bar':
        return (
          <div className='container-plot'>
            <Plot
            data={comboChartData}
            layout={{
              title: {
                text: `External Debt Stock Long Term, Education Expenditure <br>Per Government Expenditure, years ${yearRange[0]} to ${yearRange[1]}`,
                font: {
                  size: 16
                },
                x: 0.5,
                xanchor: 'center',
                y: 0.95,
                yanchor: 'top',
                width: 350  // Limit the width of the title
              },
              annotations: [
                {
                  text: 'Source: World Bank. DSI Indicator DT.DOD.DLXF.CD, WBI Indicator SE.XPD.TOTL.GB.ZS',
                  x: 0.5,
                  xref: 'paper',
                  y: 1.2,
                  yref: 'paper',
                  showarrow: false,
                  font: {
                    size: 12
                  }
                }
              ],
              xaxis: {
                title: 'Year',
                dtick: 1,
                tickformat: 'd'
              },
              yaxis: {
                title: 'External Debt Stock Long Term <br>($US current)',
                titlefont: { color: 'blue' },
                tickfont: { color: 'blue' }
              },
              yaxis2: {

                title: {
                  text: 'Education Expenditure Per Government <br>Expenditure(%)',
                  // font: {
                  //   size: 16
                  // },
                  x: 1,
                  xanchor: 'center',
                  // y: 0.95,
                  // yanchor: 'top',
                  width: 100
                },
                titlefont: { color: 'red' },
                tickfont: { color: 'red' },
                overlaying: 'y',
                side: 'right'
              },
              barmode: 'stack',
              legend: {
                orientation: 'h',
                x: 0.5,
                xanchor: 'center',
                y: -0.3
              },
              width: '100%',
              height: 400
            }}
            style={{ width: '100%', height: 350 }}
          />
          </div>

        );
      default:
        return <div>Select a chart type to view.</div>;
    }
  };

  return (
    <div className='container-visualizer'>

{renderChart()}


      <div className='container-map'>
      <Plot
        data={mapChartData}
        layout={mapLayout}
        style={{ width: '100%', height: '200px' }} // Adjusted height
      />

      </div>

      

     
    </div>
  );
};

export default DataVisualization;
