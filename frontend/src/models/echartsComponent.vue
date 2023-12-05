<template>
    <div :id="props.containerId" class="echarts-component">

    </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import * as echarts from "echarts";
import type {EChartsType} from "echarts";

const chartData = ref([]);
onMounted(() => {
    const chart = echarts.init(document.getElementById(<string>props.containerId));
    window.addEventListener('resize', function () {
        chart.resize();
    });
    drawChart(chart)
    watch(chartData, () => drawChart(chart),{immediate:true,deep:true})
})

const props = defineProps({
    containerId: {
        type: String
    },
    name: {
        type: String
    }
})

function drawChart(chart: EChartsType) {
    let option = {
        tooltip: [
            {
                show: true
            }
        ],
        visualMap: [
            {
                show: false,
                type: 'continuous',
            }
        ],
        xAxis: {
            type: "time",
            axisLabel:{
                formatter: '{mm}:{ss}'
            },
        },
        yAxis: {
            type: "value",
            name: props.name,
        },
        series: [
            {
                name: props.name,
                type: "line",
                smooth: true,
                symbol: "circle",
                data: chartData.value
            }
        ]
    }

    option && chart.setOption(option);
}

defineExpose({
    chartData
})
</script>

<style scoped>
.echarts-component {
    width: 100%;
    height: 100%;
}
</style>
