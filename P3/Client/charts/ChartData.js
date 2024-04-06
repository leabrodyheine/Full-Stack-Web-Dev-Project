export const generateChartData = (paceData) => {
  return {
      labels: paceData.map(p => new Date(p.date).toLocaleDateString()),
      datasets: [{
          label: 'Pace over Time',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          data: paceData.map(p => p.pace),
          fill: false,
      }]
  };
};
