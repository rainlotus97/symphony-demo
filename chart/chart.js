/**
 * ECharts pie-chart module.
 *
 * The host page is responsible for loading ECharts before calling
 * initPieChart. Keeping the library external makes this module usable in
 * either a CDN-backed static page or an existing ECharts application.
 */

const DEFAULT_CATEGORIES = [
    'Product',
    'Marketing',
    'Operations',
    'Support',
    'Research'
];

export function generateRandomData(categories = DEFAULT_CATEGORIES) {
    return categories.map((name) => ({
        name,
        value: Math.floor(Math.random() * 80) + 20
    }));
}

export function initPieChart(target, {
    categories = DEFAULT_CATEGORIES,
    title = 'Budget allocation',
    data = generateRandomData(categories)
} = {}) {
    if (!window.echarts) {
        throw new Error('ECharts must be loaded before initPieChart is called.');
    }

    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) {
        throw new Error('A valid chart container is required.');
    }

    const chart = window.echarts.init(element);
    chart.setOption({
        color: ['#2563eb', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'],
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            bottom: 0,
            left: 'center',
            icon: 'circle'
        },
        series: [{
            name: title,
            type: 'pie',
            radius: ['42%', '70%'],
            center: ['50%', '44%'],
            avoidLabelOverlap: true,
            itemStyle: {
                borderColor: '#ffffff',
                borderWidth: 3
            },
            label: {
                formatter: '{b}\n{d}%',
                color: '#334155'
            },
            emphasis: {
                scale: true,
                scaleSize: 7,
                label: {
                    fontWeight: 'bold'
                }
            },
            data
        }]
    });

    const resize = () => chart.resize();
    window.addEventListener('resize', resize);

    return {
        chart,
        update(nextData = generateRandomData(categories)) {
            chart.setOption({ series: [{ data: nextData }] });
        },
        dispose() {
            window.removeEventListener('resize', resize);
            chart.dispose();
        }
    };
}

export { DEFAULT_CATEGORIES };
