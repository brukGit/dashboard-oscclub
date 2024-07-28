export const setCountries = (countries) => ({
    type: 'SET_COUNTRIES',
    payload: countries,
  });
  
  export const setYearRange = (range) => ({
    type: 'SET_YEAR_RANGE',
    payload: range,
  });

  export const setChartType = (chartType) => ({
  type: 'SET_CHART_TYPE',
  payload: chartType,
});
  

export const resetCountries = () => ({
  type: 'RESET_COUNTRIES',
});

export const resetYearRange = () => ({
  type: 'RESET_YEAR_RANGE',
});

export const resetChartType = () => ({
  type: 'RESET_CHART_TYPE',
});
