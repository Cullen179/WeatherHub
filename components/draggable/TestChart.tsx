// components/TestChart.tsx
import 'chart.js/auto';
import { FC } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale
);

const TestChart: FC = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Temperature',
        data: [0, 10, 5, 2, 20, 30, 45],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ], // Chart data (labels and datasets are only for demonstration)
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Temperature: ${context.raw}°C`;
          },
        },
      },
    }, // Chart options (legend, tooltip, etc.)
  };

  return (
    <Line
      data={data}
      options={options}
    />
  );
};

export default TestChart;
