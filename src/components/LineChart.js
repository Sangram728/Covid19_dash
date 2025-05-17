import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const LineChart = ({ data, dateRange, onError }) => {
  const [chartData, setChartData] = useState(null);
  const [maxPoint, setMaxPoint] = useState(null);

  useEffect(() => {
    try {
      if (!data || !data.cases) {
        return;
      }

      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      // Get all available dates from the data
      const availableDates = Object.keys(data.cases).map(date => new Date(date));
      const latestAvailableDate = new Date(Math.max(...availableDates));
      const earliestAvailableDate = new Date(Math.min(...availableDates));

      // Adjust end date if it's beyond available data
      const effectiveEndDate = endDate > latestAvailableDate ? latestAvailableDate : endDate;
      const effectiveStartDate = startDate < earliestAvailableDate ? earliestAvailableDate : startDate;

      // Process the timeline data
      const processedData = {
        cases: [],
        deaths: [],
        recovered: [],
        dates: []
      };

      // Helper function to convert values to millions
      const toMillions = (value) => value / 1000000;

      // Get all dates and sort them
      const allDates = Object.keys(data.cases)
        .filter(date => {
          const currentDate = new Date(date);
          return currentDate >= effectiveStartDate && currentDate <= effectiveEndDate;
        })
        .sort((a, b) => new Date(a) - new Date(b));

      if (allDates.length === 0) {
        if (onError) {
          onError('No data available for the selected date range. Please select a different range.');
        }
        return;
      }

      // Process data for each date
      allDates.forEach(date => {
        processedData.dates.push(new Date(date));
        processedData.cases.push(toMillions(data.cases[date] || 0));
        processedData.deaths.push(toMillions(data.deaths[date] || 0));
        processedData.recovered.push(toMillions(data.recovered[date] || 0));
      });

      // Find max point for the indicator
      let maxCaseValue = Math.max(...processedData.cases);
      let maxIndex = processedData.cases.indexOf(maxCaseValue);
      
      // Calculate Y-axis max value for proper scaling
      const yAxisMax = Math.ceil(maxCaseValue * 1.2);
      const stepSize = yAxisMax > 1 ? 0.5 : 0.2;

      setMaxPoint({
        value: maxCaseValue.toFixed(1),
        date: processedData.dates[maxIndex],
        top: 20,
        right: 45
      });

      const newChartData = {
        labels: processedData.dates,
        datasets: [
          {
            label: 'Cases',
            data: processedData.cases,
            borderColor: '#818cf8',
            backgroundColor: '#e0e7ff',
            tension: 0.4,
            pointRadius: (ctx) => {
              return ctx.dataIndex === maxIndex ? 6 : 0;
            },
            pointBackgroundColor: '#818cf8',
            pointBorderColor: 'white',
            pointBorderWidth: 2,
            borderWidth: 2,
            fill: false
          },
          {
            label: 'Deaths',
            data: processedData.deaths,
            borderColor: '#f87171',
            backgroundColor: '#fee2e2',
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
            fill: false
          },
          {
            label: 'Recovered',
            data: processedData.recovered,
            borderColor: '#4ade80',
            backgroundColor: '#dcfce7',
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
            fill: false
          }
        ]
      };

      setChartData({ 
        data: newChartData, 
        yAxisMax, 
        stepSize,
        effectiveStartDate,
        effectiveEndDate 
      });
    } catch (error) {
      console.error('Error processing chart data:', error);
      if (onError) {
        onError('Error processing chart data. Please try a different date range.');
      }
    }
  }, [data, dateRange, onError]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (context) => {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          },
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}M`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: {
            month: 'MMM yyyy'
          },
          min: chartData?.effectiveStartDate || dateRange.start,
          max: chartData?.effectiveEndDate || dateRange.end
        },
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 8,
          font: {
            size: 12,
            weight: '400',
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          },
          color: '#6b7280',
          padding: 8
        },
        border: {
          display: false
        }
      },
      y: {
        min: 0,
        max: chartData?.yAxisMax || 1.0,
        ticks: {
          stepSize: chartData?.stepSize || 0.2,
          callback: function(value) {
            return value.toFixed(1);
          },
          font: {
            size: 12,
            weight: '400',
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          },
          color: '#6b7280',
          padding: 8
        },
        grid: {
          color: '#f3f4f6',
          drawBorder: false,
          lineWidth: 1
        },
        border: {
          display: false
        }
      }
    }
  };

  if (!chartData) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Line data={chartData.data} options={options} />
      {maxPoint && (
        <div
          style={{
            position: 'absolute',
            top: `${maxPoint.top}%`,
            right: `${maxPoint.right}%`,
            background: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            fontSize: '12px',
            color: '#1a1a1a',
            fontWeight: '500',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div>{maxPoint.value}M Cases</div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
            {maxPoint.date.getFullYear()}
          </div>
        </div>
      )}
    </div>
  );
};

export default LineChart;
