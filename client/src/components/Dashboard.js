import React, {useEffect, useState, useCallback } from 'react';

import { useSelector } from 'react-redux';
import DataVisualization from './DataVisualization';
import { ReactComponent as LoadingAnimation } from '../svg/LoadingAnimation.svg';
import styled from 'styled-components';

import axios from 'axios';
import { debounce } from 'lodash';

import '../styles/dashboard.css';

// Function to fetch data with retries
const fetchDataWithRetries = async (url, params, retries = 3, delay = 2000) => {
  let attempt = 0;

  while (attempt < retries) {
    try {
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      attempt++;
      if (attempt >= retries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay * attempt)); // Exponential backoff
    }
  }
};

const apiUrl = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL_PROD 
  : process.env.REACT_APP_API_URL_DEV;

const Dashboard = () => {
  const { selectedCountries, yearRange } = useSelector(state => state.filters);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(true);
     

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
}, [selectedCountries, yearRange, debouncedFetchData]);



  return (
    <div className='container-dashboard'>
   {loading && !error && 
   <div className="loading-container">
   <LoadingAnimation className="loading-animation" />
 </div>
   }
   {error && <p className='error'>{error}</p>}


    {!error && 
     <DataVisualization data={data} />
    }
   
    </div>
   );
    };
  
export default Dashboard;
