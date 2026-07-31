# ECharts Pie Chart

`pie-chart.js` exposes `initializePieChart(target, options)` for browser
integration. Load ECharts before the module, then pass either an element or
its id:

```html
<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
<script type="module">
  import { initializePieChart } from './features/echarts/pie-chart.js';

  const pie = initializePieChart('traffic-pie');
  document.querySelector('#refresh-pie').addEventListener('click', pie.refresh);
  window.addEventListener('resize', pie.resize);
</script>
```

The initializer returns the ECharts instance, the initial data, and
`refresh`, `resize`, and `dispose` lifecycle methods.
