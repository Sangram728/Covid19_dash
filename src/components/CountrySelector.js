import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const CountrySelector = ({ onSelect }) => {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const sortedCountries = response.data
          .map(country => ({
            value: country.cca2.toLowerCase(),
            label: country.name.common,
            flag: country.flags.svg,
            search: `${country.name.common} ${country.name.official} ${country.cca2}`.toLowerCase()
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setCountries(sortedCountries);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load countries');
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      height: '48px',
      borderRadius: '24px',
      border: '1px solid #e5e7eb',
      boxShadow: 'none',
      backgroundColor: 'white',
      '&:hover': {
        border: '1px solid #e5e7eb',
      },
      padding: '0 8px'
    }),
    input: (base) => ({
      ...base,
      margin: '0',
      padding: '0'
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 8px'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af',
      fontSize: '14px'
    }),
    option: (base, state) => ({
      ...base,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      backgroundColor: state.isSelected ? '#f3f4f6' : state.isFocused ? '#f9fafb' : 'white',
      color: '#1a1a1a',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#f3f4f6'
      }
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: 1000
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#9ca3af',
      '&:hover': {
        color: '#9ca3af'
      }
    }),
    indicatorSeparator: () => ({
      display: 'none'
    })
  };

  const formatOptionLabel = ({ label, flag }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <img src={flag} alt={`${label} flag`} style={{ width: '20px', height: '15px', borderRadius: '2px' }} />
      <span style={{ fontSize: '14px' }}>{label}</span>
    </div>
  );

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <Select
        options={countries}
        isLoading={isLoading}
        onChange={(selected) => onSelect(selected.value)}
        placeholder="Search Country"
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        defaultValue={countries.find(c => c.value === 'us')}
        components={{
          DropdownIndicator: () => (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '16px' }}>
              <path d="M14.6667 14.6667L11.2667 11.2667M12.8889 7.44444C12.8889 10.4513 10.4513 12.8889 7.44444 12.8889C4.43756 12.8889 2 10.4513 2 7.44444C2 4.43756 4.43756 2 7.44444 2C10.4513 2 12.8889 4.43756 12.8889 7.44444Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        }}
      />
    </div>
  );
};

export default CountrySelector;
