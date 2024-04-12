<script setup lang="ts" generic="T extends any, O extends any">
import * as d3 from 'd3'
import stickyBits from 'stickybits'
import BarChart from '~/components/BarChart.vue'
import type radarChart from '~/components/Radar.vue'
import Sankey from '~/components/Sankey.vue'
import StackedBarplot from '~/components/StackedBarplot.vue'
import TreeMap from '~/components/TreeMap.vue'

defineOptions({
  name: 'IndexPage',
})

const years = Array.from({ length: 12 }, (_, i) => i + 2011)

const sankeyRef = ref<InstanceType<typeof Sankey>>()
const barChartRef = ref<InstanceType<typeof BarChart>>()
const stackedBarplotRef = ref<InstanceType<typeof StackedBarplot>>()
const radarRef = ref<InstanceType<typeof radarChart>>()
const treeMapRef = ref<InstanceType<typeof TreeMap>>()

const BASE_URL = import.meta.env.BASE_URL

let accidents: null | any = null
const isLoading = ref(true)

onMounted(async () => {
  // Load the data
  Promise.all(
    years.map(year => d3.csv(`${BASE_URL}data/Rapport_Accident_${year}.csv`)),
  )
    .then(
      (onfulfilled) => {
        accidents = onfulfilled
        // Filter out the data for Montréal (06)
        for (let i = 0; i < accidents.length; i++) {
          accidents[i] = accidents[i].filter(
            (el: any) => Object.values(el)[8] === 'Montréal (06)',
          )
        }

        // Data as been loaded
        isLoading.value = false

        nextTick(() => {
          let elements: HTMLElement[] = [];
          ['.viz'].forEach((selector) => {
            elements = elements.concat(
              Array.from(document.querySelectorAll(selector)),
            )
          })
          stickyBits(elements, { stickyBitStickyOffset: 0 })

          // Initializes the scroller and the visualizations.
          Promise.all([
            treeMapRef.value!.initialize(),
            sankeyRef.value!.initialize(),
            barChartRef.value!.initialize(),
            radarRef.value!.initialize(),
            stackedBarplotRef.value!.initialize(),
          ]).then(([c1, c2, c3, c4, c5]) => {
            scroller([c1, c2, c3, c4, c5]).initialize()
          })
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
  <div>
    <div relative flex flex-col>
      <section class="intro text-section">
        <h1>Page title</h1>
        <p>
          La région métropolitaine de Montréal est confrontée chaque année à un
          défi majeur en matière de sécurité routière. Un nombre significatif de
          collisions impliquant des véhicules motorisés sont enregistrées
          annuellement, entraînant des conséquences allant de simples dommages
          matériels à des blessures graves, voire mortelles. Ces incidents
          perturbent non seulement la fluidité du trafic, mais mettent également
          en danger la sécurité des usagers de la route.

          Dans notre démarche pour renforcer la sécurité routière et déterminer
          les origines des accidents, nous nous engageons dans une analyse approfondie
          des incidents afin de repérer les éléments pouvant impacter la sécurité
          des routes. En améliorant notre compréhension des facteurs influençant
          le comportement des conducteurs à Montréal, nous visons à accroître leur
          sensibilisation pour rendre les routes de la ville plus sécurisées.
        </p>
      </section>
      <div v-if="!isLoading">
        <TreeMap ref="treeMapRef" />
        <Sankey ref="sankeyRef" :accidents />
        <BarChart ref="barChartRef" :accidents />
        <Radar ref="radarRef" :accidents />
        <StackedBarplot ref="stackedBarplotRef" />
      </div>
    </div>
  </div>
</template>

<style>
.intro {
  height: 100vh;
}
</style>
