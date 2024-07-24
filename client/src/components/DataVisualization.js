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
 
  useEffect(() => {
    if (!data || data.length === 0) return;



    const debtData = data.map(country => {
      console.log('country..', country.code);
      const debtInfo = country.data['DT.DOD.DLXF.CD'] || [];
      return {
        country: country.country,
        code: country.code,
        values: debtInfo.map(d => d.value),
        years: debtInfo.map(d => d.date)
      };
    });


    const educationData = data.map(country => {
      const educationInfo = country.data['SE.XPD.TOTL.GB.ZS'] || [];
      return {
        country: country.country,
        code: country.code,
        values: educationInfo.map(d => d.value),
        years: educationInfo.map(d => d.date)
      };
    });

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

    setDebtLineChartData(
      debtData.map((country, index) => ({
        type: 'scatter',
        mode: 'lines+markers',
        name: country.code,
        x: country.years,
        y: country.values,
        line: { color: colors[index] },
        showlegend: true
      }))
    );

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
        name: 'Education Data',
        x: educationData[0].years, // Use years from the first country
        y: educationData.map(country => country.values.reduce((acc, val) => acc + val, 0)), // Sum values across countries
        line: { color: '#ff69b4' }, // Different color for the line
        yaxis: 'y2',
        showlegend: false
      }
    ]);

  }, [data]);

  const renderChart = () => {
    switch (selectedChartType) {
      case 'pie':
        return (
          <Plot
            data={pieChartData}
            layout={{
              title: {
                text: `External Debt Stock Long Term, relative comparison <br> Years ${yearRange[0]} to ${yearRange[1]}`,
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
                text:`Education Expenditure Per Government Expenditure <br> Years ${yearRange[0]} to ${yearRange[1]}`,
                font: 16,

              },
              xaxis: { title: 'Year' },
              yaxis: { title: 'Expenditure (% of Government Expenditure)' },
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
                text: `External Debt Stock Long Term, Education Expenditure Per Government Expenditure <br> Years ${yearRange[0]} to ${yearRange[1]}`,
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
              xaxis: { title: 'Year' },
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
      {renderChart()}
    </div>
  );
};

export default DataVisualization;
