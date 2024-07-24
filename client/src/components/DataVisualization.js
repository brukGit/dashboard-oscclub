import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Plot from 'react-plotly.js';

const DataVisualization = ({ data }) => {
  const { selectedChartType } = useSelector(state => state.filters);
  const [pieChartData, setPieChartData] = useState([]);
  const [debtLineChartData, setDebtLineChartData] = useState([]);
  const [educationLineChartData, setEducationLineChartData] = useState([]);
  const [comboChartData, setComboChartData] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) return;
   
    

    const debtData = data.map(country => {
        console.log('country..',country.code);
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
        showlegend: true
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
              title: 'External Debt Stock Long Term, relative comparison (Latest Year)', 
              width: '100%', 
              height: 400 
            }}
            style={{ width: '100%', height: 400 }}
          />
        );
      case 'line':
        return (
          <Plot
            data={educationLineChartData}
            layout={{ 
              title: 'Education Expenditure Trend Over Time', 
              xaxis: { title: 'Year' }, 
              yaxis: { title: 'Expenditure (% of GDP)' }, 
              width: '100%', 
              height: 400 
            }}
            style={{ width: '100%', height: 400 }}
          />
        );
      case 'bar':
        return (
          <Plot
            data={comboChartData}
            layout={{ 
              title: 'Combined Debt and Education Data',
              xaxis: { title: 'Year' },
              yaxis: {
                title: 'Debt Stock',
                titlefont: { color: 'blue' },
                tickfont: { color: 'blue' }
              },
              yaxis2: {
                title: 'Education Expenditure (% of GDP)',
                titlefont: { color: 'red' },
                tickfont: { color: 'red' },
                overlaying: 'y',
                side: 'right'
              },
              barmode: 'stack',
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
    <div>
      {renderChart()}
    </div>
  );
};

export default DataVisualization;
