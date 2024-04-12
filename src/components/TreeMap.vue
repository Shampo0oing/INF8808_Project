<script setup>
import * as d3 from 'd3'
import jsonDefaultData from '~/data/TreeMap/TreeMapDefault.json'
import jsonSeriousData from '~/data/TreeMap/TreeMapSerious.json'

const defaultData = jsonDefaultData
const seriousData = jsonSeriousData

function initialize() {
  return new Promise((resolve) => {
    // preProcess()
    createTreeMap(defaultData)

    resolve([
      () => {
        console.warn(1)
      },
      (direction) => {
        if (direction === 'up')
          refreshData(defaultData)
      },
      () => refreshData(seriousData),
    ])
  })
}

// const preProcess = (seriousAccident = false) => {
//   // Preprocess
//   let tempData = props.accidents.flat()
//   let totalValue = 0;

//   tempData = tempData.reduce((acc, curr) => {
//     if (curr.GRAVITE !== 'Mortel ou grave') return acc
//     const currentAccidentType = curr.CD_GENRE_ACCDN
//     const existingData = acc.find(item => item.name === currentAccidentType)
//     if (existingData) {
//       existingData.value += 1
//     }
//     else if (currentAccidentType) {
//       acc.push({
//         name: currentAccidentType,
//         parent: 'Origin',
//         value: 1,
//         color: color[currentAccidentType]
//       })
//     }

//     totalValue += 1;

//     return acc
//   }, [])

//   tempData.push({
//     name: 'Origin',
//     parent: '',
//     value: 0,
//   })

//   tempData = tempData.map((d) => {
//     const percentage = `${((d.value / totalValue) * 100).toFixed(2)}%`
//     return {
//       name: d.name,
//       parent: d.parent,
//       value: d.value,
//       color: d.color,
//       percentage,
//     }
//   })

//   data = tempData;
// }

// const formatData = (dataToFormat) => {
//   return dataToFormat.reduce((acc, curr) => {
//     const currentAccidentType = curr.CD_GENRE_ACCDN
//     const existingData = acc.find(item => item.name === currentAccidentType)
//     if (existingData) {
//       existingData.value += 1
//     }
//     else if (currentAccidentType) {
//       acc.push({
//         name: currentAccidentType,
//         parent: 'Origin',
//         value: 1,
//         color: color[currentAccidentType]
//       })
//     }
//     return acc
//   }, [])
// }

// const formatDataWithSeriousAccident = (dataToFormat) => {
//   return dataToFormat.reduce((acc, curr) => {
//     if (curr.GRAVITE !== 'Mortel ou grave') return acc
//     const currentAccidentType = curr.CD_GENRE_ACCDN
//     const existingData = acc.find(item => item.name === currentAccidentType)
//     if (existingData) {
//       existingData.value += 1
//     }
//     else if (currentAccidentType) {
//       acc.push({
//         name: currentAccidentType,
//         parent: 'Origin',
//         value: 1,
//         color: color[currentAccidentType]
//       })
//     }
//     return acc
//   }, [])
// }

function createTreeMap(data) {
  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 10, bottom: 10, left: 10 }
  const width = 445 - margin.left - margin.right
  const height = 445 - margin.top - margin.bottom

  // append the svg object to the body of the page
  const svg = d3.select('#treeMap')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${(width + margin.left + margin.right) / 2}, ${(height + margin.top + margin.bottom) / 2})`)

  // stratify the data: reformatting for d3.js
  const root = d3.stratify()
    .id((d) => { return d.name }) // Name of the entity (column name is name in csv)
    .parentId((d) => { return d.parent })(data) // Name of the parent (column name is parent in csv)
    .sum((d) => { return +d.value }) // Compute the numeric value for each entity

  // Then d3.treemap computes the position of each element of the hierarchy
  // The coordinates are added to the root object above
  d3.treemap()
    .size([width, height])
    .padding(4)(root)

  // use this information to add rectangles:
  svg
    .selectAll('rect')
    .data(root.leaves())
    .join('rect')
    .attr('x', (d) => { return d.x0 })
    .attr('y', (d) => { return d.y0 })
    .attr('width', (d) => { return d.x1 - d.x0 })
    .attr('height', (d) => { return d.y1 - d.y0 })
    .style('stroke', 'black')
    .style('fill', (d) => { return d.data.color })

  // and to add the text labels
  // svg
  //   .selectAll('text')
  //   .data(root.leaves())
  //   .join('text')
  //   .attr('x', (d) => { return d.x0 + 10 }) // +10 to adjust position (more right)
  //   .attr('y', (d) => { return d.y0 + 20 }) // +20 to adjust position (lower)
  //   .text((d) => { return `${d.data.name[0]} (${d.data.percentage})` })
  //   .attr('font-size', '15px')

  // Sort the data array by value
  const legendData = data.filter(d => d.value !== 0)
  legendData.sort((a, b) => b.value - a.value)

  // Create a legend g element
  const legend = svg.append('g')
    .attr('transform', `translate(${width + margin.right + 20}, ${margin.top})`)

  // Append rectangles for each color
  legend.selectAll('rect')
    .data(legendData)
    .join('rect')
    .attr('x', 0)
    .attr('y', (d, i) => i * 40) // 20 is the distance between each rectangle
    .attr('width', 20)
    .attr('height', 20)
    .style('fill', d => d.color)
    .style('stroke', 'black') // Add a black outline

  // Append text for each color
  legend.selectAll('text')
    .data(legendData)
    .join('text')
    .attr('x', 30) // 15 is the distance from the rectangle
    .attr('y', (d, i) => i * 40 + 15) // 9 is the vertical alignment of the text
    .text(d => `${d.name.charAt(0).toUpperCase() + d.name.slice(1)} (${d.percentage})`) // Show the value next to the key
    .attr('font-size', '16px')
}

async function refreshData(data) {
  d3.select('#treeMap svg').remove()

  await nextTick()

  // preProcess(data)

  createTreeMap(data)
}

defineExpose({ initialize })
</script>

<template>
  <section class="viz-section">
    <div class="steps">
      <section>
        <h1>Une variété d'accident.</h1>
        <p>Entre 2011 et 2022, Montréal a été le théâtre d'une série d'accidents routiers variés, avec une gamme d'incidents allant des collisions entre véhicules aux accidents impliquant des objets fixes et des animaux errants. Cette visualisation offre un regard unique sur ces événements, représentant chaque type d'accident par des rectangles de couleur dont la taille est proportionnelle à sa fréquence relative au cours de cette période.</p>
      </section>
      <section>
        <h1>Au cœur des rues montréalaises.</h1>
        <p>En scrutant la répartition des accidents, nous décelons des nuances révélatrices de la vie urbaine à Montréal. Les collisions entre véhicules prédominent, témoignant de l'intensité des déplacements dans une métropole animée. La présence relativement faible d'accidents impliquant des animaux reflète peut-être les caractéristiques urbaines de la ville, où les interactions avec la faune sauvage sont moins fréquentes qu'en milieu rural.</p>
      </section>
      <section>
        <h1>Impact des accidents graves.</h1>
        <p>En examinant spécifiquement les accidents mortels ou graves, on remarque des changements frappants par rapport à l'ensemble des accidents. Alors que les accidents impliquant des piétons et des cyclistes ont considérablement augmenté, la proportion d'accidents entre véhicules a diminué. Cette tendance souligne l'importance cruciale de la sécurité des usagers vulnérables de la route et la nécessité de mesures supplémentaires pour prévenir les accidents graves à Montréal.</p>
      </section>
    </div>
    <div id="treeMap" class="viz" />
  </section>
</template>
