const chartData = [
    { value: 1048, name: '产品A' },
    { value: 735, name: '产品B' },
    { value: 580, name: '产品C' },
    { value: 484, name: '产品D' },
    { value: 300, name: '产品E' }
];

function initPieChart() {
    const chartDom = document.getElementById('pieChart');
    const myChart = echarts.init(chartDom);

    const option = {
        title: {
            text: '产品销售占比',
            subtext: '示例数据',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: chartData.map(item => item.name)
        },
        series: [
            {
                name: '销售额',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: chartData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    formatter: '{b}: {d}%'
                }
            }
        ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

document.addEventListener('DOMContentLoaded', initPieChart);
