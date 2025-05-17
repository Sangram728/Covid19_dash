# COVID-19 Dashboard

A React.js-based dashboard that visualizes COVID-19 statistical data through interactive charts and statistics.

## Features

- Real-time COVID-19 statistics visualization
- Interactive charts (Line chart and Pie chart)
- Country-wise data filtering
- Responsive design for all devices
- Statistical cards showing key metrics
- Historical data visualization

## Technologies Used

- React.js
- Axios for API integration
- Chart.js/Recharts for data visualization
- Material-UI/Tailwind CSS for styling (you can choose)
- React Context/Redux for state management

## API Endpoints

The dashboard integrates with two main APIs:

1. COVID-19 Historical Data:
   - Endpoint: `https://disease.sh/v3/covid-19/historical/{country}?lastdays=1500`
   - Provides historical COVID-19 data for selected countries

2. Countries List:
   - Endpoint: `https://restcountries.com/v3.1/all`
   - Provides country information for the dropdown selection

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>

