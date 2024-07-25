import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Plot from 'react-plotly.js';

import '../styles/data-visualizer.css';


const DataVisualization = ({ data }) => {
  const { selectedChartType, yearRange } = useSelector(state => state.filters);
  const [pieChartData, setPieChartData] = useState([]);
  const [debtLineChartData, setDebtLineChartData] = useState([]);
  const [educationLineChartData, setEducationLineChartData] = useState([]);
  const [comboChartData, setComboChartData] = useState([]);
  const [mapChartData, setMapChartData] = useState([]);

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
    console.log('debt..', debtData);


    const educationData = data.map(country => {
      const educationInfo = country.data['SE.XPD.TOTL.GB.ZS'] || [];
      return {
        country: country.country,
        code: country.code,
        values: educationInfo.map(d => d.value),
        years: educationInfo.map(d => d.date)
      };
    });
    
    console.log('education..', educationData);

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

    const countryProfileData = data.map(country => {
      const latitude = parseFloat(country.latitude);
      const longitude = parseFloat(country.longitude);

      const values = country.data['country_profile'] || [];
      const latestValue = values.length > 0 ? values[values.length - 1].value : 0;

      return {
        country: country.name,
        code: country.iso2Code,
        latitude,
        longitude,
        latestValue
      };
    });

    console.log('countryProfileData:', countryProfileData); // Log the data to verify

    const chartData = [
      {
        type: 'choropleth',
        locationmode: 'country names',
        locations: countryProfileData.map(country => country.country),
        z: countryProfileData.map(country => country.latestValue),
        colorscale: 'Blues',
        colorbar: { title: 'Countries on the Map' }
      }
    ];

    console.log('mapChartData:', chartData); // Log the data to verify
    setMapChartData(chartData);

  }, [data]);




  const renderChart = () => {
    switch (selectedChartType) {
      case 'pie':
        return (
          <Plot
            data={pieChartData}
            layout={{
              title: {
                text: `External Debt Stock Long Term, relative comparison <br>years ${yearRange[0]} to ${yearRange[1]}`,
                font: 16

              },
              subtitle: 'External Debt Stock Long Term, WBI - DT.DOD.DLXF.CD',
              width: '100%',
              height: 400,
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
            style={{ width: '100%', height: 400 }}
          />
        );
      case 'line':
        return (
          <Plot
            data={educationLineChartData}
            layout={{
              title: {
                text: `Education Expenditure Per Government Expenditure(%), <br>years ${yearRange[0]} to ${yearRange[1]}`,
                font: {
                  size: 16
                }
              },
              xaxis: { title: 'Year',
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
            style={{ width: '100%', height: 400 }}
          />
        );

      
      case 'bar':
        return (
          <Plot
            data={comboChartData}
            layout={{
              title: {
                text: `External Debt Stock Long Term, Education Expenditure Per Government Expenditure, <br>years ${yearRange[0]} to ${yearRange[1]}`,
                font: {
                  size: 16
                },
                x: 0.5,
                xanchor: 'center',
                y: 0.95,
                yanchor: 'top',
                width: 400  // Limit the width of the title
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
              xaxis: { title: 'Year',
                dtick: 1,
                tickformat: 'd'
               },
              yaxis: {
                title: 'External Debt Stock Long Term ($US current)',
                titlefont: { color: 'blue' },
                tickfont: { color: 'blue' }
              },
              yaxis2: {

                title: {
                  text: 'Education Expenditure Per Government Expenditure (%)',
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
            style={{ width: '100%', height: 400 }}
          />

        );
      default:
        return <div>Select a chart type to view.</div>;
    }
  };

  return (
    <div className='container-visualizer'>

{/* <Plot
      data={mapChartData}
      layout={{
        title: 'Countries on Map',
        geo: {
          projection: { type: 'equirectangular' }
        },
        width: 800, // Use numeric values
        height: 600  // Use numeric values
      }}
      style={{ width: '100%', height: '600px' }} 
    /> */}
      {renderChart()}

    </div>
  );
};

export default DataVisualization;
