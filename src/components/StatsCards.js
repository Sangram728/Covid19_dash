import React from 'react';
import './StatsCards.css';

const StatsCards = ({ stats }) => {
  const formatNumber = (num) => {
    if (!num) return '0';
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num);
  };

  const calculatePercentage = (value, total) => {
    if (!value || !total) return '0.00%';
    return ((value / total) * 100).toFixed(2) + '%';
  };

  // If recovered is not available, estimate it as 97% of cases (typical recovery rate)
  const recoveredCount = stats.recovered || Math.round(stats.cases * 0.97);

  const cards = [
    {
      type: 'total',
      label: 'Total Cases',
      value: stats.cases,
      percentage: calculatePercentage(stats.cases, stats.population),
      percentageLabel: 'of Population'
    },
    {
      type: 'recovered',
      label: 'Recoveries',
      value: recoveredCount,
      percentage: calculatePercentage(recoveredCount, stats.cases),
      percentageLabel: 'Recovery Rate'
    },
    {
      type: 'deaths',
      label: 'Deaths',
      value: stats.deaths,
      percentage: calculatePercentage(stats.deaths, stats.cases),
      percentageLabel: 'Mortality Rate'
    }
  ];

  return (
    <div className="stats-container">
      {cards.map((card) => (
        <div key={card.type} className={`stats-card ${card.type}`}>
          <div className="card-content">
            <div className="value">{formatNumber(card.value)}</div>
            <div className="card-info">
              <div className="label">{card.label}</div>
              <div className="percentage">
                {card.percentage}
                <span style={{ marginLeft: '4px', fontSize: '12px', opacity: 0.8 }}>
                  {card.percentageLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
