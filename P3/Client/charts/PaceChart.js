import { Line, mixins } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

export default {
  extends: Line,
  mixins: [mixins.reactiveProp], // Use reactiveProp mixin to automatically react to changes in props
  props: ['chartData', 'options'], // Receive chartData and options as props
  mounted() {
    // Use this.chartData, which is provided as a prop and reactive
    this.renderChart(this.chartData, this.options);
  }
};