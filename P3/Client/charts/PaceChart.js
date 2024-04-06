const PaceChart = {
  name: 'PaceChart',
  props: ['chartData', 'options'],
  mounted() {
    this.createChart();
  },
  methods: {
    createChart() {
      console.log('ChartData:', this.chartData);
      console.log('Options:', this.options);

      // Create chart only if it does not exist, or explicitly destroy and recreate if needed
      if (this.chartInstance) {
        // Optionally check if data or options have changed before destroying
        this.chartInstance.destroy();
      }

      const ctx = this.$refs.canvas.getContext('2d');
      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: this.chartData,
        options: this.options,
      });
    },
    // Provide a method to explicitly update chart data
    updateChartData(newData, newOptions) {
      this.chartData = newData; // Assumes chartData is reactive
      this.options = newOptions; // Assumes options is reactive
      this.createChart(); // Re-create the chart with new data/options
    }
  },
  template: '<canvas ref="canvas"></canvas>',
  unmounted() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
};

// // Directly define the PaceChart component without using import/export
// const PaceChart = {
//   name: 'PaceChart',
//   props: ['chartData', 'options'],
//   mounted() {
//     this.createChart();
//   },
//   methods: {

//     createChart() {
//       console.log('ChartData:', this.chartData);
//       console.log('Options:', this.options);

//       // Ensure the Chart instance is destroyed when the component is re-mounted to prevent memory leaks
//       if (this.chartInstance) {
//         this.chartInstance.destroy();
//       }

//       const ctx = this.$refs.canvas.getContext('2d');
//       this.chartInstance = new Chart(ctx, {
//         type: 'line', // Assuming you want a line chart
//         data: this.chartData,
//         options: this.options,
//       });
//     },
//   },
//   watch: {
//     chartData: {
//       deep: true,
//       handler() {
//         this.createChart();
//       },
//     },
//     options: {
//       deep: true,
//       handler() {
//         this.createChart();
//       },
//     },
//   },
//   template: '<canvas ref="canvas"></canvas>',
//   unmounted() {
//     if (this.chartInstance) {
//       this.chartInstance.destroy();
//     }
//   },
// };
