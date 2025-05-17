import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CountrySelector from './components/CountrySelector';
import StatsCards from './components/StatsCards';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
import './App.css';

function App() {
  const [country, setCountry] = useState('us');
  const [stats, setStats] = useState({});
  const [history, setHistory] = useState({});
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    return {
      start: '2020-10-01',
      end: today.toISOString().split('T')[0]
    };
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = React.useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, historyRes] = await Promise.all([
        axios.get(`https://disease.sh/v3/covid-19/countries/${country}`),
        axios.get(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=1500`)
      ]);
      
      setStats(statsRes.data);
      setHistory(historyRes.data.timeline);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [country]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const handleDateRangeChange = (event) => {
    const { name, value } = event.target;
    const newDate = new Date(value);
    const today = new Date();
    
    // Validate date range
    if (name === 'start' && new Date(value) > new Date(dateRange.end)) {
      return; // Don't allow start date to be after end date
    }
    if (name === 'end' && new Date(value) < new Date(dateRange.start)) {
      return; // Don't allow end date to be before start date
    }
    if (newDate > today) {
      return; // Don't allow future dates
    }

    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const displayDateRange = `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;

  const handleBackToMain = () => {
    setError(null);
    setLoading(true);
    // Reset date range to default
    const today = new Date();
    setDateRange({
      start: '2020-10-01',
      end: today.toISOString().split('T')[0]
    });
    // Refetch data
    fetchData();
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-message">{error}</div>
          <button onClick={handleBackToMain} className="back-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>COVID-19 and Population Dashboard</h1>
        <div className="filters">
          <div className="country-selector">
            <CountrySelector onSelect={setCountry} />
          </div>
          <div className="date-filter" ref={datePickerRef}>
            <label>Filter by Date Range</label>
            <div className="date-filter-inputs" onClick={() => setShowDatePicker(!showDatePicker)}>
              <input
                type="text"
                readOnly
                value={displayDateRange}
              />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {showDatePicker && (
              <div className="date-picker-popup">
                <div className="date-inputs">
                  <div>
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="start"
                      value={dateRange.start}
                      min="2020-01-01"
                      max={dateRange.end}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                  <div>
                    <label>End Date</label>
                    <input
                      type="date"
                      name="end"
                      value={dateRange.end}
                      min={dateRange.start}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <StatsCards stats={stats} />
          <div className="charts-container">
            <div className="chart-section">
              <h3>Line Chart</h3>
              <LineChart 
                data={history} 
                dateRange={dateRange} 
                onError={(errorMsg) => {
                  setError(errorMsg);
                  setLoading(false);
                }} 
              />
            </div>
            <div className="chart-section">
              <h3>Pie Chart</h3>
              <PieChart data={stats} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
