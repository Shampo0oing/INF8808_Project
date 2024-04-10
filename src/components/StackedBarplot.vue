<script setup lang="ts">
import * as d3 from 'd3'
import type { StackedBarplotData } from '../models/types'

const props = defineProps<{
  dataMapped: StackedBarplotData
  isTopData: boolean | null
  configNo: number
}>()

let data: StackedBarplotData = {}

/// POUR AFFICHER LES 4 ÉTATS DE SURFACE DE ROUTE AVEC LE PLUS D'ACCIDENTS ///
if (props.isTopData != null) {
  data = getFilteredData(props.dataMapped, props.isTopData)
}
else {
  /// COMPARAISON ÉTAT DE SURFACE DE SÈCHE VS TOUS LES AUTRES ///
  data = props.dataMapped
}

onMounted(() => {
  const margin = { top: 10, right: 10, bottom: 30, left: 80 }
  const width = 550 - margin.left - margin.right
  const height = 450 - margin.top - margin.bottom

  const svg = d3.select(`#stacked_barplot${props.configNo}`)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const subgroups = Object.keys(data[Object.keys(data)[0]])
  const groups = Object.keys(data)

  // X axis
  const x: any = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding(0.2)
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll('text')
    .style('font-size', '14px')

  // Y axis
  const y: any = d3.scaleLinear()
    .domain([0, d3.max(Object.values(data).map(d => d3.sum(Object.values(d))))!])
    .nice()
    .range([height, 0])
  svg.append('g')
    .call(d3.axisLeft(y))
    .selectAll('text')
    .style('font-size', '14px')

  const color = d3.scaleOrdinal<string>()
    .domain(subgroups)
    .range(Array.from({ length: subgroups.length }, (_, i) => d3.interpolateRainbow(i / subgroups.length)))

  // stack per subgroup
  const stackedData = d3.stack().keys(subgroups)(Object.values(data))

  // Show the bars
  svg.append('g')
    .selectAll('g')
    .data(stackedData)
    .join('g')
    .attr('fill', d => color(d.key))
    .selectAll('rect')
    .data(d => d)
    .join('rect')
    .attr('x', (d, i) => x(groups[i]))
    .attr('y', d => y(d[1]))
    .attr('height', d => y(d[0]) - y(d[1]))
    .attr('width', x.bandwidth())
    .attr('stroke', 'black')
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave)

  // ----------------
  // TOOLTIP
  // ----------------
  const tooltip = d3.select(`#viz-6_${props.configNo}`)
    .insert('div', ':first-child')
    .attr('class', `tooltip${props.configNo}`)

  // Function to show tooltip
  function mouseover(event: any, d: any) {
    const targetElement = (event.target as any).__data__
    let subgroupName = ''
    stackedData.forEach((subgroup) => {
      const foundElement = subgroup.find(d => d === targetElement)
      if (foundElement)
        subgroupName = subgroup.key
    })
    const subgroupValue = d.data[subgroupName]
    tooltip
      .html(`${subgroupName}: ${subgroupValue}`)
      .style('opacity', 1)
  }

  // Function to move tooltip
  function mousemove(event: any) {
    tooltip.style('left', `${event.pageX + 20}px`)
      .style('top', `${event.pageY + 20}px`)
  }

  // Function to hide tooltip
  function mouseleave() {
    tooltip.style('opacity', 0)
  }

  // ----------------
  // LEGEND
  // ----------------
  const legend = d3.select(`#legend${props.configNo}`).append('svg').attr('width', '350px')

  const legendItems = legend.selectAll('.legend-item')
    .data(subgroups)
    .enter()
    .append('g')
    .attr('class', 'legend-item')
    .attr('transform', (d, i) => `translate(0, ${i * 20 + 30})`)

  legendItems.append('rect')
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', color)

  legendItems.append('text')
    .attr('x', 20)
    .attr('y', 10)
    .text(d => d)
})
</script>

<template>
  <div :id="`viz-6_${props.configNo}`" class="viz">
    <div :id="`stacked_barplot${props.configNo}`" />
    <div :id="`legend${props.configNo}`" />
  </div>
</template>

<style>
  div[id^='viz'] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: sticky;
}
div[id^='legend'] {
  display: flex;
  align-items: center;
  width: 430px;
}
div[class^='tooltip'] {
  opacity: 0;
  background-color: white;
  border: 1px solid;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  align-items: center;
  width: fit-content;
  transform: translateY(-55%);
}
</style>
