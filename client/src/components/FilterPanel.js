import React, { useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { useDispatch, useSelector } from 'react-redux';
import { setCountries, setYearRange, setChartType,
  resetCountries, resetYearRange, resetChartType
 } from '../actions';

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
  const initialStartYear = yearRange[0];
  const initialEndYear = yearRange[1];
  const [sliderValue, setSliderValue] = React.useState([initialStartYear, initialEndYear]);
  const [resetKey, setResetKey] = useState(0); // State to trigger re-render

  useEffect(() => {
    if (selectedCountries.length === 0) {
      const defaultCountries = Object.values(countryCodeMapping);
       dispatch(setCountries(defaultCountries));
    }
  }, [dispatch, selectedCountries]);

  const handleReset = () => {
    dispatch(resetCountries());
    dispatch(resetYearRange());
    dispatch(resetChartType());

    setSliderValue([initialStartYear, initialEndYear]);
    setResetKey(prevKey => prevKey + 1); // Increment the key to force re-render
  };

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
    // dispatch(setCountries(defaultCountries));
    // dispatch(setYearRange(defaultYearRange));
  };

  const handleChange = (newRange) => {
    setSliderValue(newRange);
    dispatch(setYearRange(newRange));
  };

  return (
    <div className='container-filter'>
      <h2>Filters</h2>
      <div>
        <h3>Select Countries</h3>
        {Object.keys(countryCodeMapping).map(country => (
          <button
            key={country}
            onClick={() => handleCountryChange(country)}
            style={{ backgroundColor: selectedCountries.includes(countryCodeMapping[country]) ? '#efdacf' : 'white' }}
          >
            {country}
          </button>
        ))}
      </div>
      <div>
        <h3>Select Year Range</h3>
       
        <ReactSlider
         key={resetKey} // Use resetKey to ensure re-render
        className="horizontal-slider"
        thumbClassName="thumb"
        trackClassName="track"
        value={sliderValue}
        // defaultValue={[initialStartYear, initialEndYear]}
        ariaLabel={['Lower thumb', 'Upper thumb']}
        ariaValuetext={state => `Year ${state.valueNow}`}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        pearling
        minDistance={1}
        min={2010}
        max={2020}
        onChange={handleChange}
      />
      </div>
      <div>
        <h3>Select Chart Type</h3>
        <button
          onClick={() => handleChartTypeChange('pie')}
          style={{ backgroundColor: selectedChartType === 'pie' ? '#efdacf' : 'white' }}
        >
          Pie Chart
        </button>
        <button
          onClick={() => handleChartTypeChange('line')}
          style={{ backgroundColor: selectedChartType === 'line' ? '#efdacf' : 'white' }}
        >
          Line Chart
        </button>
        <button
          onClick={() => handleChartTypeChange('bar')}
          style={{ backgroundColor: selectedChartType === 'bar' ? '#efdacf' : 'white' }}
        >
          Bar Chart
        </button>
      </div>

      <div>
      <button className='reset-button'
      onClick={handleReset}
     
    >
      Reset Filters
    </button>
      </div>
      
    
      
      <datalist id="tickmarks">
        {[...Array(11)].map((_, i) => (
          <option key={i} value={2010 + i} label={2010 + i} />
        ))}
      </datalist>
    </div>
  );
};

export default FilterPanel;
