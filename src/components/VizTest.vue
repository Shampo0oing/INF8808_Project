<script setup>
import * as d3 from 'd3'

const props = defineProps({
  accidents: {
    type: Array,
    required: true,
  },
})

onMounted(() => {
  const color = {
    'autre': '#f4f1de',
    'véhicule': '#e07a5f',
    'objet fixe': '#3d405b',
    'sans collision': '#81b29a',
    'piéton': '#f2cc8f',
    'cycliste': '#6c757d',
    'animal': '#adb5bd',
  }

  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 10, bottom: 10, left: 10 }
  const width = 445 - margin.left - margin.right
  const height = 445 - margin.top - margin.bottom

  // append the svg object to the body of the page
  const svg = d3.select('#my_dataviz')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  // Preprocess
  let data = props.accidents.flat()

  data = data.reduce((acc, curr) => {
    const currentAccidentType = curr.CD_GENRE_ACCDN
    const existingData = acc.find(item => item.name === currentAccidentType)
    if (existingData) {
      existingData.value += 1
    }
    else if (currentAccidentType) {
      acc.push({
        name: currentAccidentType,
        parent: 'Origin',
        value: 1,
        color: color[currentAccidentType],
      })
    }
    return acc
  }, [])

  data.push({
    name: 'Origin',
    parent: '',
    value: 0,
  })

  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0)

  data = data.map((d) => {
    const percentage = `${((d.value / totalValue) * 100).toFixed(2)}%`
    return {
      name: d.name,
      parent: d.parent,
      value: d.value,
      color: d.color,
      percentage,
    }
  })

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
  svg
    .selectAll('text')
    .data(root.leaves())
    .join('text')
    .attr('x', (d) => { return d.x0 + 10 }) // +10 to adjust position (more right)
    .attr('y', (d) => { return d.y0 + 20 }) // +20 to adjust position (lower)
    .text((d) => { return `${d.data.name[0]} (${d.data.percentage})` })
    .attr('font-size', '15px')
})
</script>

<template>
  <div id="my_dataviz" />
</template>
