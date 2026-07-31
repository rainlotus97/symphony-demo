/**
 * Create randomized data for the pie chart.
 * @param {string[]} [names]
 * @returns {{name: string, value: number}[]}
 */
export function createRandomPieData(names = ['Search', 'Direct', 'Email', 'Social', 'Referral']) {
    return names.map((name) => ({
        name,
        value: Math.floor(Math.random() * 900) + 100,
    }));
}

/**
 * Initialize an ECharts pie chart in a DOM element.
 *
 * The ECharts dependency can be passed explicitly for bundlers, or omitted
 * when ECharts is available as `window.echarts` from a script tag.
 *
 * @param {HTMLElement|string} target Element, or its id, to render into.
 * @param {{echarts?: object, names?: string[], title?: string, theme?: string}} [options]
 * @returns {{chart: object, data: {name: string, value: number}[], refresh: Function, resize: Function, dispose: Function}}
 */
export function initializePieChart(target, options = {}) {
    const container = resolveTarget(target);
    const echarts = options.echarts || globalThis.echarts;

    if (!container) {
        throw new Error('Pie chart target was not found.');
    }
    if (!echarts || typeof echarts.init !== 'function') {
        throw new Error('ECharts is required before initializing the pie chart.');
    }

    const chart = echarts.init(container, options.theme);
    let data = createRandomPieData(options.names);

    const getChartOption = () => ({
        tooltip: {
            trigger: 'item',
            valueFormatter: (value) => `${value}`,
        },
        legend: {
            bottom: 0,
            left: 'center',
        },
        series: [{
            name: options.title || 'Traffic sources',
            type: 'pie',
            radius: ['42%', '70%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: true,
            itemStyle: {
                borderRadius: 6,
                borderColor: '#ffffff',
                borderWidth: 2,
            },
            label: {
                show: true,
                formatter: '{b}: {d}%',
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold',
                },
            },
            data,
        }],
    });

    const refresh = () => {
        data = createRandomPieData(options.names);
        chart.setOption(getChartOption(), true);
        return data;
    };

    const resize = () => chart.resize();
    const dispose = () => chart.dispose();

    chart.setOption(getChartOption());
    return { chart, data, refresh, resize, dispose };
}

function resolveTarget(target) {
    if (typeof target === 'string') {
        return document.getElementById(target);
    }
    return target;
}

