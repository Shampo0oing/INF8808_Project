<script setup>
import * as d3 from 'd3'
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'
import useColorPalette from '~/composables/color'
import chartData from '~/data/sankey/Sankey.json'

const color = useColorPalette()

const sankeyContainer = ref(null)

function initialize() {
  return new Promise((resolve) => {
    const svg = d3
      .select(sankeyContainer.value)
      .append('svg')
      .attr('width', 1200)
      .attr('height', 1100)

    const tooltip = svg
      .append('text')
      .style('opacity', 0)
      .attr('class', 'tooltip')

    const sankeyLayout = sankey()
      .nodeId(d => d.name)
      .nodeWidth(15)
      .nodePadding(50)
      .extent([
        [50, 150],
        [900, 800],
      ])

    // Create the data object from json file
    const data = chartData

    sankeyLayout(data)

    // Draw the nodes
    svg
      .append('g')
      .selectAll('rect')
      .data(data.nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', color.blue)

    // Add labels to the nodes
    svg
      .append('g')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .attr('x', d => (d.x0 + d.x1) / 2) // Position the label at the center of the node
      .attr('y', d => (d.y0 + d.y1) / 2) // Position the label at the center of the node
      .attr('dy', '0.35em') // Offset the text vertically for better alignment
      .text(d => d.name) // Set the text content to the node's name or value
      .attr('fill', 'black')
      .style('text-anchor', 'middle')

    // Add values below the labels
    svg
      .append('g')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .attr('x', d => (d.x0 + d.x1) / 2) // Position the text at the center of the node with xOffset
      .attr('y', d => (d.y0 + d.y1) / 2 + 20) // Position the text below the center of the node
      .attr('dy', '0.35em') // Offset the text vertically for better alignment
      .text(d => d.value) // Set the text content to the node value
      .attr('fill', 'black')
      .style('text-anchor', 'middle')

    // Draw the links
    svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.1)
      .selectAll('path')
      .data(data.links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', 'black')
      .attr('stroke-width', d => Math.max(2, d.width)) // Set the width of the link based on the value
      .on('mouseover', (event, d) => {
        d3.select(event.target).attr('stroke', color.green)
        tooltip
          .style('opacity', 1)
          .attr('x', (d.source.x1 + d.target.x0) / 2)
          .attr('y', (d.y0 + d.y1) / 2)
          .text(`${d.value}`)
      })
      .on('mouseout', (event) => {
        d3.select(event.target).attr('stroke', 'black')
        tooltip.style('opacity', 0)
      })

    resolve([
      () => console.warn(1),
      () => console.warn(2),
      () => console.warn(3),
      () => console.warn(4),
    ])
  })
}

defineExpose({ initialize })
</script>

<template>
  <section class="viz-section">
    <div class="steps">
      <section>
        <p>
          Ce diagramme Sankey représente l'ensemble des accidents répartis en
          trois catégories distinctes : la période de la journée, la gravité des
          accidents et le secteur de l'accident.
        </p>
      </section>
      <section>
        <h1>Période de la journée</h1>
        <p>
          Nous sommes en général inclinés à croire qu'il y a plus d'accidents la
          nuit à cause de la fatigue au volant et d'une visibilité réduite. Mais
          nous pouvons voir que la majorité des accidents se produisent durant
          le jour, probablement en raison du volume plus élevé de circulation.
        </p>
      </section>
      <section>
        <h1>Gravité des accidents</h1>
        <p>
          Il est remarquable que la grande majorité entraîne des dommages
          matériels. De plus, bien que le nombre d'accidents mortels ou graves
          soit à peu près équivalent tant le jour que la nuit, il y a environ
          trois fois plus d'accidents durant le jour. Ce contraste accentué,
          avec un nombre plus élevé d'accidents la journée, pourrait s'expliquer
          par la meilleure visibilité offerte par la lumière du jour, permettant
          ainsi aux conducteurs de ralentir et de mieux maîtriser leur véhicule.
        </p>
      </section>
      <section>
        <h1>Le secteur de l'accident</h1>
        <p>
          En ce qui concerne les accidents par secteur on remarque que les
          accidents mortels ou graves sont plus fréquents dans les secteurs
          résidentiels et commerciaux, tant de jour que de nuit, mais avec une
          légère prédominance la nuit. Pour les accidents légers et les
          accidents avec dommages matériels, le secteur le plus touché est
          également le secteur résidentiel suivi du secteur commercial. On voit
          en général, que le ratio de la gravité des accidents est environ le
          même dans tous les secteurs.
        </p>
      </section>
    </div>
    <div ref="sankeyContainer" class="viz sankey-container" />
    <!-- <div id="viz" class="viz" /> -->
  </section>
</template>

<style scoped>
.sankey-container {
  width: 100%;
  height: 500px;
}
</style>
