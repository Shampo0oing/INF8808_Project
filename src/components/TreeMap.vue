<script setup>
import * as d3 from 'd3'
import jsonDefaultData from '~/data/TreeMap/TreeMapDefault.json'
import jsonSeriousData from '~/data/TreeMap/TreeMapSerious.json'

const defaultData = jsonDefaultData
const seriousData = jsonSeriousData

let div

const imageURL = {
  'véhicule': 'car-collision.svg',
  'objet fixe': 'car-fixed-object.svg',
  'piéton': 'pedestrian.svg',
  'cycliste': 'cyclist.svg',
}

function initialize() {
  return new Promise((resolve) => {
    resolve([
      (direction) => {
        if (direction === 'down') {
          div = null
          refreshData(defaultData)
        }
      },
      (direction) => {
        if (direction === 'up')
          refreshData(defaultData)
      },
      (direction) => {
        if (direction === 'down') {
          refreshData(seriousData)
        }
        else {
          div = null
          refreshData(seriousData)
        }
      },
    ])
  })
}

function createTreeMap(data) {
  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 10, bottom: 10, left: 10 }
  const width = 600 - margin.left - margin.right
  const height = 600 - margin.top - margin.bottom

  if (!div) {
    // append the div object to the body of the page
    div = d3
      .select('#treeMap')
      .selectAll('div')
      .data([data]) // Bind the data to the div
      .join('div') // Enter new divs or update existing ones
      .style('width', `${width + margin.left + margin.right}px`)
      .style('height', `${height + margin.top + margin.bottom}px`)
      .style('position', 'relative')
  }

  // stratify the data: reformatting for d3.js
  const root = d3
    .stratify()
    .id((d) => {
      return d.name
    }) // Name of the entity (column name is name in csv)
    .parentId((d) => {
      return d.parent
    })(data) // Name of the parent (column name is parent in csv)
    .sum((d) => {
      return +d.value
    }) // Compute the numeric value for each entity
    .sort((a, b) => (b.height - a.height || b.value - a.value))

  // Then d3.treemap computes the position of each element of the hierarchy
  // The coordinates are added to the root object above
  d3.treemap().size([width, height]).padding(4).round(true)(root)

  // use this information to add divs:
  const leaf = div
    .selectAll('div')
    .data(root.leaves(), d => d.data.name) // Add a key function here
    .join(
      enter => enter.append('div') // Enter new elements
        .attr('class', 'leaf')
        .style('left', d => `${d.x0}px`)
        .style('top', d => `${d.y0}px`)
        .style('width', d => `${d.x1 - d.x0}px`)
        .style('height', d => `${d.y1 - d.y0}px`)
        .style('background-color', d => `${d.data.color}`)
        .style('background-image', d => imageURL[d.data.name] ? `url(${imageURL[d.data.name]})` : 'none')
        .style('background-repeat', 'no-repeat')
        .style('background-position', 'center bottom')
        .style('background-size', d => (d.y1 - d.y0) > (d.x1 - d.x0) ? '100% auto' : 'auto 100%')
        .style('border', '1px solid black')
        .style('position', 'absolute')
        .style('opacity', 0)
        .call(enter => enter.transition() // Add a transition to the entering elements
          .duration(300)
          .delay((_, i) => i * 50)
          .ease(d3.easeQuadInOut).style('opacity', 1)),
      update => update // Update existing elements
        .call(update => update.transition() // Add a transition to the updating elements
          .duration(300)
          .ease(d3.easeQuadInOut)
          .style('left', d => `${d.x0}px`)
          .style('top', d => `${d.y0}px`)
          .style('width', d => `${d.x1 - d.x0}px`)
          .style('height', d => `${d.y1 - d.y0}px`)
          .style('opacity', 1)
          .style('background-size', d => (d.y1 - d.y0) > (d.x1 - d.x0) ? '100% auto' : 'auto 100%'),
        ),
      exit => exit // Exit old elements
        .call(exit => exit.transition() // Add a transition to the exiting elements
          .duration(300)
          .ease(d3.easeQuadInOut)
          .style('opacity', 0)
          .remove()),
    )

  // and to add the text labels
  leaf
    .append('div')
    .attr('class', 'leaf-label')
    .style('position', 'relative')
    .style('left', '2px')
    .style('top', '2px')
    .text(d => `${d.data.name} (${d.data.percentage})`)
    .style('font-size', '13px')
    .style('opacity', 0)
    .transition()
    .duration(300)
    .delay(300)
    .style('opacity', 1)
}

async function refreshData(data) {
  createTreeMap(data)
}

defineExpose({ initialize })
</script>

<template>
  <section class="viz-section">
    <div class="steps">
      <section>
        <h1>Une variété d'accident.</h1>
        <p>
          Entre 2011 et 2022, Montréal a été le théâtre d'une série d'accidents
          routiers variés, avec une gamme d'incidents allant des collisions
          entre véhicules aux accidents impliquant des objets fixes et des
          animaux errants. Cette visualisation offre un regard unique sur ces
          événements, représentant chaque type d'accident par des rectangles de
          couleur dont la taille est proportionnelle à sa fréquence relative au
          cours de cette période.
        </p>
      </section>
      <section>
        <h1>Au cœur des rues montréalaises.</h1>
        <p>
          En scrutant la répartition des accidents, nous décelons des nuances
          révélatrices de la vie urbaine à Montréal. Les collisions entre
          véhicules prédominent, témoignant de l'intensité des déplacements dans
          une métropole animée. La présence relativement faible d'accidents
          impliquant des animaux reflète peut-être les caractéristiques urbaines
          de la ville, où les interactions avec la faune sauvage sont moins
          fréquentes qu'en milieu rural.
        </p>
      </section>
      <section>
        <h1>Impact des accidents graves.</h1>
        <p>
          En examinant spécifiquement les accidents mortels ou graves, on
          remarque des changements frappants par rapport à l'ensemble des
          accidents. Alors que les accidents impliquant des piétons et des
          cyclistes ont considérablement augmenté, la proportion d'accidents
          entre véhicules a diminué. Cette tendance souligne l'importance
          cruciale de la sécurité des usagers vulnérables de la route et la
          nécessité de mesures supplémentaires pour prévenir les accidents
          graves à Montréal.
        </p>
      </section>
    </div>
    <div id="treeMap" class="viz flex items-center justify-center" />
  </section>
</template>
