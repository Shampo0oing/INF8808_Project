<script setup lang="ts" generic="T extends any, O extends any">
import * as d3 from 'd3'
import stickyBits from 'stickybits'
import type { StackedBarplotData } from '../models/types'
import stackedData from '../../public/data/StackedBarplot.json'

defineOptions({
  name: 'IndexPage',
})

const BASE_URL = import.meta.env.BASE_URL

const accidents: globalThis.Ref<null | any> = ref(null)

/// DATA ARRANGÉ DANS JSON ///
const stackedBarplotData: StackedBarplotData = stackedData.all
let isTopData: boolean = true

async function refreshData() {
  isTopData = !isTopData
  await nextTick()
}

onMounted(() => {
  // CHARGEMENT DES DONNÉES
  Promise.all([
    // d3.csv(BASE_URL + 'data/Rapport_Accident_2011.csv'),
    // d3.csv(BASE_URL + 'data/Rapport_Accident_2012.csv'),
    // d3.csv(BASE_URL + 'data/Rapport_Accident_2013.csv'),
    // d3.csv(BASE_URL + 'data/Rapport_Accident_2014.csv'),
    // d3.csv(BASE_URL + 'data/Rapport_Accident_2015.csv'),
    // d3.csv(BASE_URL + 'data/Rapport_Accident_2016.csv'),
    // d3.csv(BASE_URL + 'data/Rapport_Accident_2017.csv'),
    // d3.csv(BASE_URL + 'data/Rapport_Accident_2018.csv'),
    // d3.csv(BASE_URL + 'data/Rapport_Accident_2019.csv'),
    // d3.csv(BASE_URL + 'data/Rapport_Accident_2020.csv'),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2021.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2022.csv`),
  ]).then((files) => {
    accidents.value = files
    /// FONCTION UTILISÉ POUR MAPPER LES DATAS ///
    // console.log(processData(files))
  })

  const config = {
    height: 500,
    margin: {
      bottom: 100,
      left: 100,
      right: 100,
      top: 100,
    },
    width: 500,
  }
  const fullWidth = config.margin.left + config.width + config.margin.right
  const fullHeight = config.margin.top + config.height + config.margin.bottom

  const visContainer = d3.select('#viz')
  const svg = visContainer.append('svg')
    .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid')
  const g = svg.append('g')
    .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`)

  const initialize = async () => {
    const BASE_URL = import.meta.env.BASE_URL

    const data = await d3.csv(`${BASE_URL}data/data.csv`)
    const rect = g.append('rect')
      .attr('width', config.width)
      .attr('height', config.height)
      .style('fill', 'green')

    return data.map((d: d3.DSVRowString<string>) => () => {
      rect.transition()
        .duration(300)
        .style('fill', d.color)
    })
  }

  let elements: HTMLElement[] = [];
  ['.viz'].forEach((selector) => {
    elements = elements.concat(Array.from(document.querySelectorAll(selector)))
  })
  stickyBits(elements, { stickyBitStickyOffset: 0 })

  // Initializes the scroller and the visualizations.
  Promise.all([initialize()]).then(([callbacks]) => {
    scroller([callbacks])
      .initialize()
  })
})
</script>

<template>
  <!-- <div v-if="accidents">
    <VizTest :accidents />
  </div> -->
  <div>
    <div relative>
      <section class="intro text-section">
        <h1>Page title</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </section>
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
        <div id="viz" class="viz" />
      </section>

      <section class="viz-section">
        <div class="steps">
          <section>
            <h1>Title 1</h1>
            <p>Text of section 1...</p>
          </section>
          <section>
            <p>Title 2</p>
            <button style="background-color: blueviolet; height: 25px;" @click="refreshData()">
              {{ isTopData }}
            </button>
          </section>
        </div>
        <StackedBarplot :data-mapped="stackedBarplotData" :is-top-data="isTopData" :config-no="1" />
      </section>
      <section class="viz-section">
        <div class="steps">
          <section>
            <h1>Title 1</h1>
            <p>Text of section 1...</p>
          </section>
        </div>
        <StackedBarplot :data-mapped="stackedBarplotData" :is-top-data="!isTopData" :config-no="2" />
      </section>
      <section class="viz-section">
        <div class="steps">
          <section>
            <h1>Title 1</h1>
            <p>Text of section 1...</p>
          </section>
        </div>
        <StackedBarplot :data-mapped="stackedData.regrouped" :is-top-data="null" :config-no="3" />
      </section>
    </div>
  </div>
</template>
