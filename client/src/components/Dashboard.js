import React, {useEffect, useState} from 'react';

import { useSelector } from 'react-redux';
import DataVisualization from './DataVisualization'

import axios from 'axios';

const Dashboard = () => {
  const { selectedCountries, yearRange } = useSelector(state => state.filters);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:5000/api/data/fetch', {
        params: {
          countries: JSON.stringify(selectedCountries),
          yearRange: yearRange
        },
      });
      setData(response.data);
    };
    fetchData();
  }, [selectedCountries, yearRange]);


  return (
    <DataVisualization data={data} />
   );
    };
  
export default Dashboard;
