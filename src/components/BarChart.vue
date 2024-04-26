<script setup>
import * as d3 from 'd3'
import barchartJson from '~/data/barChart/barchart.json'

// create varialble data and get value from barchart.json
const jsonData = ref(barchartJson)

const activeTab = ref('all')
const showModal = ref(false)
const years = Array.from({ length: 12 }, (_, i) => i + 2011)

function initialize() {
  return new Promise((resolve) => {
    createBarChart()

    resolve([
      () => console.warn(1),
      () => console.warn(2),
      () => console.warn(3),
      () => console.warn(4),
    ])
  })
}

function changeTab(tab) {
  activeTab.value = tab
  if (tab === 'all') {
    document.getElementById('chartAllYear').style.display = 'block'
    document.getElementById('chartByYear').style.display = 'none'
  }
  else if (tab === 'byYear') {
    document.getElementById('chartAllYear').style.display = 'none'
    document.getElementById('chartByYear').style.display = 'block'
  }
}

function getDataForYear(year) {
  if (year === 'all') {
    const allYearsData = {}
    for (const yearData of Object.values(jsonData.value)) {
      for (const { type, count } of yearData)
        allYearsData[type] = (allYearsData[type] || 0) + count
    }
    return Object.entries(allYearsData).map(([type, count]) => ({
      type,
      count,
    }))
  }
  const yearData = Object.values(jsonData.value[year]) || []
  const formattedYearData = yearData.map(({ type, count }) => {
    return {
      type,
      count,
    }
  })
  return formattedYearData
}

function createBarChart() {
  // Create bar chart for all years
  const dataAllYears = getDataForYear('all')
  createBarChartForData(dataAllYears, '#chartAll')

  // Create bar chart for each year
  years.forEach((year) => {
    const dataForYear = getDataForYear(year)
    createBarChartForData(dataForYear, `#chart${year}`, year, 180, 180)
  })
}

function createBarChartForData(data, chartRef, year = '', maxwidth = 700, maxheight = 600) {
  const margin = { top: 60, right: 20, bottom: 60, left: 60 }
  const width = maxwidth - margin.left - margin.right
  const height = maxheight - margin.top - margin.bottom

  function useColorPalette() {
    return {
      orange: '#FFA482',
      blue: '#6FD0FF',
    }
  }

  const color = useColorPalette()

  const svg = d3.select(chartRef)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const x = d3.scaleBand()
    .domain(data.map(d => d.type))
    .range([0, width])
    .padding(0.2)

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([height, 0])

  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', d => x(d.type))
    .attr('y', d => y(d.count))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.count))
    .attr('fill', color.blue)
    .append('title')
    .text(d => `Type: ${d.type}\nNombre d'accidents: ${d.count}`)

  svg.selectAll('.label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', d => x(d.type) + x.bandwidth() / 2)
    .attr('y', d => y(d.count) - 10)
    .attr('dy', '.75em')
    .text(d => d.count)
    .attr('text-anchor', 'middle')
    .attr('font-size', '10px')
    .attr('fill', 'black')

  // Add x-axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('.tick text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end')
    .call(wrap, x.bandwidth())

  if (year !== '') {
    svg.selectAll('text')
      .style('font-size', '8px')

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 0 - (margin.top / 2))
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('text-decoration', 'underline')
      .text(year)
  }

  // Add y-axis
  svg.append('g')
    .call(d3.axisLeft(y))
}

function wrap(text, width) { // wrap labels on x-axis when too long
  text.each(function () {
    const text = d3.select(this)
    const words = text.text().split(/\s+/).reverse()
    let word = ''
    let line = []
    let lineNumber = 0
    const lineHeight = 1.1
    const y = text.attr('y')
    const dy = Number.parseFloat(text.attr('dy'))
    let tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', `${dy}em`)
    while (words.length > 0) {
      word = words.pop()
      line.push(word)
      tspan.text(line.join(' '))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(' '))
        line = [word]
        tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', `${++lineNumber * lineHeight + dy}em`).text(word)
      }
    }
  })
}

function showChart(chartId) {
  showModal.value = true
  nextTick(() => {
    const year = chartId.replace('chart', '')
    const dataForChart = getDataForYear(year)
    d3.select('#chartModalContent').selectAll('*').remove()
    createBarChartForData(dataForChart, '#chartModalContent', year, 700, 550)
  })
}

function closeModal() {
  showModal.value = false
}

defineExpose({ initialize })
</script>

<template>
  <section class="viz-section">
    <div class="steps" style="z-index: unset;">
      <section>
        <h1>La météo et les accidents : un éclairage surprenant </h1>
        <p>Une nette prédominance des accidents survient sous des conditions météorologiques claires, totalisant 210 524 incidents.</p>
      </section>
      <section>
        <p>En revanche, les accidents survenant sous des conditions météorologiques plus adverses, telles que la pluie (23 462), la neige ou la grêle (17 749), la poudrerie et le verglas (2752 et 1 090 respectivement), affichent des chiffres sensiblement inférieurs.</p>
      </section>
      <section>
        <p>L'examen des données annuelles révèle  une prédominance marquée des accidents se produit sous des conditions météorologiques claires, avec des chiffres variant légèrement d'une année à l'autre mais restant significativement élevés. </p>
      </section>
      <section>
        <p> Ces constatations soulignent l'importance de la prudence et de l'adaptation du comportement de conduite, quelle que soit la météo, pour garantir la sécurité sur nos routes.</p>
      </section>
    </div>
    <div class="viz">
      <div class="tabs">
        <button class="tab" :class="{ active: activeTab === 'all' }" @click="changeTab('all')">
          Vue générale
        </button>
        <button class="tab" :class="{ active: activeTab === 'byYear' }" @click="changeTab('byYear')">
          Vue par année
        </button>
      </div>
      <div v-if="showModal" class="modal-backdrop" @click="closeModal" />
      <div class="chart-container">
        <div id="chartAllYear" class="chart" style="padding-bottom: 80px;">
          <div class="chart-row">
            <div id="chartAll" />
          </div>
        </div>
        <div id="chartByYear" class="chart" style="display: none;">
          <div class="chart-row">
            <div id="chart2011" @click="showChart('chart2011')" />
            <div id="chart2012" @click="showChart('chart2012')" />
            <div id="chart2013" @click="showChart('chart2013')" />
            <div id="chart2014" @click="showChart('chart2014')" />
          </div>
          <div class="chart-row">
            <div id="chart2015" @click="showChart('chart2015')" />
            <div id="chart2016" @click="showChart('chart2016')" />
            <div id="chart2017" @click="showChart('chart2017')" />
            <div id="chart2018" @click="showChart('chart2018')" />
          </div>
          <div class="chart-row">
            <div id="chart2019" @click="showChart('chart2019')" />
            <div id="chart2020" @click="showChart('chart2020')" />
            <div id="chart2021" @click="showChart('chart2021')" />
            <div id="chart2022" @click="showChart('chart2022')" />
          </div>
        </div>
      </div>
      <div v-if="showModal" id="chartModal" class="modal" style="z-index: 9999;">
        <button class="close-button" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div id="chartModalContent" class="modal-content" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.viz {
  flex-direction: column;
}

.tab {
  display: inline-block;
  padding: 10px 20px;
  margin: 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.tabs {
  padding-top: 50px;
}

.tab:hover {
  background-color: #e0e0e0;
}

.tab.active {
  background-color: #ccc;
  color: #000;
}

.chart-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.chart {
  flex: 1 1 auto;
  min-width: 0; /* To ensure the chart can shrink below its base width */
  min-height: 0; /* To ensure the chart can shrink below its base height */
}
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: rgb(255, 255, 255);
}

.modal-content {
  padding-bottom: 20px;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>
