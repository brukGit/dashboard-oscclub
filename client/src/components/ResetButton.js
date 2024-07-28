import React from 'react';
import { useDispatch } from 'react-redux';
import { resetCountries, resetYearRange, resetChartType } from '../actions';

import '../styles/reset-button.css';
const ResetButton = () => {
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(resetCountries());
    dispatch(resetYearRange());
    dispatch(resetChartType());
  };

  return (
    <button className='reset-button'
      onClick={handleReset}
     
    >
      Reset Filters
    </button>
  );
};

export default ResetButton;
