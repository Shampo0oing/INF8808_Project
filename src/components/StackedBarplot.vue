<script setup lang="ts">
import * as d3 from 'd3'
import stackedDataJson from '~/data/stackedBarplot/StackedBarplot.json'

const isTopData: null | any = ref(true)
const configNo = ref(0)
const data = ref(getFilteredData(stackedDataJson.all, isTopData))

function initialize() {
  return new Promise((resolve) => {
    createBarplot(configNo.value)

    resolve([
      () => console.warn(1),
      () => console.warn(2),
      () => console.warn(3),
      () => {
        if (configNo.value === 1) {
          configNo.value = 2
          refreshData()
        }
      },
      () => {
        if (configNo.value === 0 || configNo.value === 2)
          refreshData()
      },
      () => {
        if (configNo.value === 1)
          refreshData()
      },
    ])
  })
}

async function refreshData() {
  // configNo.value = configParam
  configNo.value = (1 + configNo.value) % 3
  isTopData.value = configNo.value === 2 ? null : !isTopData.value
  if (configNo.value < 2)
    data.value = getFilteredData(stackedDataJson.all, isTopData.value)

  if (isTopData.value == null)
    data.value = stackedDataJson.regrouped

  await nextTick()
  const divToSearch = document.getElementById(`viz-6_${configNo.value}`)
  if (divToSearch != null)
    createBarplot(configNo.value)
}

function createBarplot(vizNum: number) {
  const margin = { top: 10, right: 10, bottom: 30, left: 80 }
  const width = 550 - margin.left - margin.right
  const height = 450 - margin.top - margin.bottom

  const svg = d3.select(`#stacked_barplot${vizNum}`)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const subgroups = Object.keys(data.value[Object.keys(data.value)[0]])
  const groups = Object.keys(data.value)

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
    .domain([0, d3.max(Object.values(data.value).map(d => d3.sum(Object.values(d))))!])
    .nice()
    .range([height, 0])
  svg.append('g')
    .call(d3.axisLeft(y))
    .selectAll('text')
    .style('font-size', '14px')

  const definedColors = [
    'rgb(224, 122, 95)',
    'rgb(242, 204, 143)',
    'rgb(95, 197, 224)',
    'rgb(133, 224, 95)',
  ]

  // Create a color scale
  const color = d3.scaleOrdinal<string>()
    .domain(subgroups)
    .range(definedColors)

  const stackedData = d3.stack().keys(subgroups)(Object.values(data.value))

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
  const tooltip = d3.select(`#viz-6_${vizNum}`)
    .insert('div', ':first-child')
    .attr('class', `tooltip${vizNum}`)

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

  function mousemove(event: any) {
    tooltip.style('left', `${event.pageX + 20}px`)
      .style('top', `${event.pageY + 20}px`)
  }

  function mouseleave() {
    tooltip.style('opacity', 0)
  }

  // ----------------
  // LEGEND
  // ----------------
  const legend = d3.select(`#legend${vizNum}`).append('svg').attr('width', '350px')

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
}

defineExpose({ initialize })
</script>

<template>
  <section class="viz-section">
    <div class="steps">
      <section>
        <h1>L'état de la route, la cause des accidents ?</h1>
        <p>
          Dans le domaine de la sécurité routière, l'état de la chaussée joue un rôle primordial, influençant le nombre d'accidents.
          Par exemple, lorsqu'elle est glissante en hiver, une route peut présenter des risques accrus de dérapage
          ou d'accident, notamment en raison d'une adhérence réduite des pneus sur la surface.
        </p>
      </section>
      <section>
        <p>
          Cependant, avec les données recueillies sur cette décennie dans la région montréalaise, on peut constater une incidence
          beaucoup plus élevée d'accidents lorsque la route est sèche par rapport à d'autres conditions météorologiques.
        </p>
      </section>
      <section>
        <p>
          En réalité, lorsque la surface de la route est sèche, les conducteurs peuvent être enclins à adopter une vitesse plus élevée,
          à une distance de suivi plus courte et à une conduite plus agressive en général, ce qui accroît le risque d'accidents.
        </p>
      </section>
      <section>
        <p>
          Voici une visualisation des 4 états de surface de route causant le plus d'accidents, ainsi que leur niveau de gravité
        </p>
      </section>
      <section>
        <p>
          Voici une visualisation des 4 états de surface de route causant le moins d'accidents, ainsi que leur niveau de gravité
        </p>
      </section>
      <section>
        <p>
          Voici une visualisation comparant les accidents survenus sur chaussée sèche à ceux survenus sur d'autres types
          de revêtements de route. On remarque que le nombre d'accidents ainsi que leur gravité sont presque deux fois plus élevés
          lorsque la chaussée est sèche.
        </p>
      </section>
    </div>
    <div v-if="configNo === 0" :id="`viz-6_${configNo}`" class="viz">
      <div :id="`stacked_barplot${configNo}`" />
      <div :id="`legend${configNo}`" />
    </div>
    <div v-else-if="configNo === 1" :id="`viz-6_${configNo}`" class="viz">
      <div :id="`stacked_barplot${configNo}`" />
      <div :id="`legend${configNo}`" />
    </div>
    <div v-else-if="configNo === 2" :id="`viz-6_${configNo}`" class="viz">
      <div :id="`stacked_barplot${configNo}`" />
      <div :id="`legend${configNo}`" />
    </div>
  </section>
</template>

<style>
div[id^='viz'] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
