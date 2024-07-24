import { combineReducers } from 'redux';

const initialState = {
  selectedCountries: [],
  yearRange: [2010, 2020],
  selectedChartType: 'pie',
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_COUNTRIES':
      return { ...state, selectedCountries: action.payload };
    case 'SET_YEAR_RANGE':
      return { ...state, yearRange: action.payload };
    case 'SET_CHART_TYPE':
      return {
        ...state,
        selectedChartType: action.payload
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  filters: filterReducer,
});

export default rootReducer;
