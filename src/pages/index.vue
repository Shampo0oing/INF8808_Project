<script setup lang="ts" generic="T extends any, O extends any">
import * as d3 from 'd3'
import stickyBits from 'stickybits'

defineOptions({
  name: 'IndexPage',
})

const BASE_URL = import.meta.env.BASE_URL

const accidents: null | any = ref(null)
const accidentsRadar: null | any = ref(null)
const yearsRadar: null | any = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  // CHARGEMENT DES DONNÉES
  Promise.all([
    d3.csv(`${BASE_URL}data/Rapport_Accident_2011.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2012.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2013.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2014.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2015.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2016.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2017.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2018.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2019.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2020.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2021.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2022.csv`),
  ])
    .then(
      (onfulfilled) => {
        accidents.value = onfulfilled
        isLoading.value = false
        const initialize = async () => {
          const dataCopy = accidents
          return [
            () => {
              accidentsRadar.value = [dataCopy.value[0]]
              yearsRadar.value = ['2011']
            },
            () => {
              accidentsRadar.value = [dataCopy.value[8]]
              yearsRadar.value = ['2019']
            },
            () => {
              accidentsRadar.value = [dataCopy.value[0], dataCopy.value[8]]
              yearsRadar.value = ['2011', '2019']
            },
          ]
        }

        let elements: HTMLElement[] = [];
        ['.viz'].forEach((selector) => {
          elements = elements.concat(
            Array.from(document.querySelectorAll(selector)),
          )
        })
        stickyBits(elements, { stickyBitStickyOffset: 0 })

        // Initializes the scroller and the visualizations.
        Promise.all([initialize()]).then(([callbacks]) => {
          scroller([callbacks]).initialize()
        })
      },
      (onrejected) => {
        console.error(onrejected)
      },
    )
    .catch((err) => {
      console.error(err)
    })
})
</script>

<template>
  <!-- <div v-if="!isLoading"> -->
  <!-- <VizTest :accidents /> -->
  <!-- </div> -->
  <div>
    <div relative>
      <section class="intro text-section">
        <h1>Page title</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </section>
      <section class="viz-section">
        <div class="steps">
          <section>
            <p>Title 1</p>
          </section>
          <section>
            <p>Title 2</p>
          </section>
          <section>
            <p>Title 3</p>
          </section>
        </div>
        <Radar v-if="!isLoading" class="viz" :accidents-radar="accidentsRadar" :years-radar="yearsRadar" />
      </section>
    </div>
  </div>
</template>

<style>
.intro {
  height: 100vh;
}
</style>
