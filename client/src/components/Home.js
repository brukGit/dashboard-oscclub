import React from "react";
import FilterPanel from './FilterPanel';
import Dashboard from './Dashboard';

import '../styles/home.css'


const Home = () => {
    return (
        <div className="container-home">
            <FilterPanel />
            <Dashboard />
        </div>
    )

}

export default Home;