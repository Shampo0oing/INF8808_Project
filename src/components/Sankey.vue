<script setup>
import * as d3 from 'd3'
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'
import chartData from '~/data/sankey/Sankey.json'

/* const props = defineProps({
  accidents: {
    type: Array,
    required: true,
  },
}); */

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
        [50, 50],
        [1000 - 100, 700 - 10],
      ])
    /*
    const allData = props.accidents.flat();
    // Define the names of columns to check for emptiness
    const columnsToCheck = ["CD_ECLRM", "GRAVITE", "CD_ENVRN_ACCDN"];

    // Filter the data
    const filteredAccidents = allData.filter((accident) => {
      // Check if all specified columns have non-empty values
      return columnsToCheck.every((columnName) => {
        // Check if the value of the column is not empty
        return accident[columnName] !== "";
      });
    });

    // Filter accidents into day and night categories
    const dayAccident = filteredAccidents.filter((accident) => {
      return accident.CD_ECLRM === "1" || accident.CD_ECLRM === "2";
    });
    const nightAccident = filteredAccidents.filter((accident) => {
      return accident.CD_ECLRM === "3" || accident.CD_ECLRM === "4";
    });

    const accidentCounts = new Map();
    filteredAccidents.forEach((accident) => {
      // Determine if the accident is a day or night accident
      const isDayAccident =
        accident.CD_ECLRM === "1" || accident.CD_ECLRM === "2";
      const timeOfDay = isDayAccident ? "Jour" : "Nuit";

      // Key for time of the day and severity
      const keyDaySeverity = `${timeOfDay}-${accident.GRAVITE}`;

      // Mapping for CD_ENVRN_ACCDN to words
      const environmentMapping = {
        1: "Scolaire",
        2: "Résidentiel",
        3: "Commercial",
        4: "Industriel",
        5: "Rural",
        6: "Autre",
        9: "Autre",
      };

      // Key for severity and environment
      const keySeverityEnvironment = `${accident.GRAVITE}-${environmentMapping[accident.CD_ENVRN_ACCDN]}`;

      // Update counts for day/severity and severity/environment
      if (accidentCounts.has(keyDaySeverity)) {
        accidentCounts.set(
          keyDaySeverity,
          accidentCounts.get(keyDaySeverity) + 1
        );
      } else {
        accidentCounts.set(keyDaySeverity, 1);
      }
      if (accidentCounts.has(keySeverityEnvironment)) {
        accidentCounts.set(
          keySeverityEnvironment,
          accidentCounts.get(keySeverityEnvironment) + 1
        );
      } else {
        accidentCounts.set(keySeverityEnvironment, 1);
      }
    });

    // Dynamically generate links based on the counts
    const links = [];

    // Manually push first 2 links for day and night accidents
    links.push({
      source: "Accident",
      target: "Jour",
      value: dayAccident.length,
    });
    links.push({
      source: "Accident",
      target: "Nuit",
      value: nightAccident.length,
    });

    accidentCounts.forEach((value, key) => {
      const [part1, part2] = key.split("-");
      let source, target;

      // Determine source and target based on the key
      if (part1 === "1" || part1 === "2") {
        // This is a day/severity key
        source = part1 === "1" ? "Jour" : "Nuit";
        target = part2; // Severity
      } else {
        // This is a severity/environment key
        source = part1; // Severity
        target = part2; // Environment
      }

      // Generate the link
      if (source && target) links.push({ source, target, value });
    });

    // Create the nodes array based on unique names from the links
    const nodeNames = new Set();
    links.forEach((link) => {
      nodeNames.add(link.source);
      nodeNames.add(link.target);
    });
    const nodes = Array.from(nodeNames).map((name) => ({ name })); */

    // Create the data object from json file
    const data = chartData

    sankeyLayout(data)

    // Draw the nodes
    const node = svg
      .append('g')
      .selectAll('rect')
      .data(data.nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', 'lightblue')

    // Add hover effect to nodes
    node
      .on('mouseover', function () {
        d3.select(this).attr('fill', 'orange')
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', 'lightblue')
      })

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
      .attr('stroke-width', d => d.width)
      // .attr("transform", `translate(${xOffset}, 0)`)
      .on('mouseover', (event, d) => {
        d3.select(event.target).attr('stroke', 'red')
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
        <h1>Title 1</h1>
        <p>Text of section 1...</p>
      </section>
      <section>
        <p>Title 2</p>
      </section>
      <section>
        <p>Title 3</p>
      </section>
      <section>
        <h1>Title 4</h1>
        <p>Text of section 4...</p>
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
