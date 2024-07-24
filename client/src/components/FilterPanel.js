import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCountries, setYearRange, setChartType } from '../actions';

import '../styles/filter-panel.css';
const countryCodeMapping = {
  'Algeria': 'DZA',
  'Argentina': 'ARG',
  'Ethiopia': 'ETH',
  'Tanzania': 'TZA',
  'Uzbekistan': 'UZB',
  'Viet Nam': 'VNM'
};

const FilterPanel = () => {
  const dispatch = useDispatch();
  const { selectedCountries, yearRange, selectedChartType } = useSelector(state => state.filters);
  const [startYear, setStartYear] = useState(yearRange[0]);
  const [endYear, setEndYear] = useState(yearRange[1]);

  useEffect(() => {
    if (selectedCountries.length === 0) {
      dispatch(setCountries(Object.values(countryCodeMapping)));
    }
  }, [dispatch, selectedCountries]);

  const handleCountryChange = (country) => {
    const countryCode = countryCodeMapping[country];
    const updatedCountries = selectedCountries.includes(countryCode)
      ? selectedCountries.filter(c => c !== countryCode)
      : [...selectedCountries, countryCode];
    dispatch(setCountries(updatedCountries));
  };

  const handleStartYearChange = (e) => {
    const newStartYear = parseInt(e.target.value, 10);
    setStartYear(newStartYear);
    dispatch(setYearRange([newStartYear, endYear]));
  };

  const handleEndYearChange = (e) => {
    const newEndYear = parseInt(e.target.value, 10);
    setEndYear(newEndYear);
    dispatch(setYearRange([startYear, newEndYear]));
  };

  const handleChartTypeChange = (type) => {
    dispatch(setChartType(type));
  };

  return (
    <div className='container-filter'>
      <div>
        <h3>Select Countries</h3>
        {Object.keys(countryCodeMapping).map(country => (
          <button
            key={country}
            onClick={() => handleCountryChange(country)}
            style={{ backgroundColor: selectedCountries.includes(countryCodeMapping[country]) ? 'orange' : 'white' }}
          >
            {country}
          </button>
        ))}
      </div>
      <div>
        <h3>Select Year Range</h3>
        <div>
          <label>
            Start Year:
            <input
              type="number"
              min="2000"
              max="2020"
              value={startYear}
              onChange={handleStartYearChange}
            />
          </label>
          <label>
            End Year:
            <input
              type="number"
              min="2000"
              max="2020"
              value={endYear}
              onChange={handleEndYearChange}
            />
          </label>
        </div>
      </div>
      <div>
        <h3>Select Chart Type</h3>
        <button
          onClick={() => handleChartTypeChange('pie')}
          style={{ backgroundColor: selectedChartType === 'pie' ? 'orange' : 'white' }}
        >
          Pie Chart
        </button>
        <button
          onClick={() => handleChartTypeChange('line')}
          style={{ backgroundColor: selectedChartType === 'line' ? 'orange' : 'white' }}
        >
          Line Chart
        </button>
        <button
          onClick={() => handleChartTypeChange('bar')}
          style={{ backgroundColor: selectedChartType === 'bar' ? 'orange' : 'white' }}
        >
          Bar Chart
        </button>
      </div>
      <datalist id="tickmarks">
        {[...Array(21)].map((_, i) => (
          <option key={i} value={2000 + i} label={2000 + i} />
        ))}
      </datalist>
    </div>
  );
};

export default FilterPanel;
