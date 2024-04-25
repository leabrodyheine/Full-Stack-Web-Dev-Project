export const generateChartData = (paceData) => {
  console.log("Original pace data:", paceData);  // Log the original data to see what is received

    // Filter out any entries that might be incomplete or invalid
    const validPaceData = paceData.filter(p => p.date && !isNaN(new Date(p.date).valueOf()) && p.pace && !isNaN(p.pace));

    console.log("Filtered valid pace data:", validPaceData);  // Log the filtered data

    return {
        labels: validPaceData.map(p => new Date(p.date).toLocaleDateString()),
        datasets: [{
            label: 'Pace over Time',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            data: validPaceData.map(p => p.pace),
            fill: false,
        }]
    };
};