import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  // If recovered is not available, estimate it as 97% of cases (typical recovery rate)
  const recoveredCount = data.recovered || Math.round(data.cases * 0.97);

  const chartData = {
    labels: ['Total Population', 'Cases', 'Recoveries', 'Deaths'],
    datasets: [
      {
        data: [
          data.population || 0,
          data.cases || 0,
          recoveredCount || 0,
          data.deaths || 0
        ],
        backgroundColor: [
          '#fef9c3',
          '#e0e7ff',
          '#dcfce7',
          '#fee2e2'
        ],
        borderColor: [
          '#facc15',
          '#818cf8',
          '#4ade80',
          '#f87171'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: `${label}: ${new Intl.NumberFormat().format(data.datasets[0].data[i])}`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].borderColor[i],
                lineWidth: 1,
                hidden: false,
                index: i,
                pointStyle: 'circle'
              }));
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat().format(context.parsed);
            }
            return label;
          }
        }
      }
    },
    cutout: '65%',
    layout: {
      padding: {
        right: 120 // Add padding for legend
      }
    }
  };

  return (
    <div style={{ height: '400px', position: 'relative' }}>
      <Doughnut data={chartData} options={options} />
      {data.population && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '25%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            zIndex: 10
          }}
        >
          <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
            Total Population
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
            {new Intl.NumberFormat().format(data.population)}
          </div>
        </div>
      )}
    </div>
  );
};

export default PieChart;
