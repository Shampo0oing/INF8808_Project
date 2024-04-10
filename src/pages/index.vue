<script setup lang="ts" generic="T extends any, O extends any">
import * as d3 from 'd3'
import stickyBits from 'stickybits'
import stackedData from '../../public/data/StackedBarplot.json'
import StackedBarplot from '~/components/StackedBarplot.vue'
import stackedBarplotConfig from '~/composables/stackedBarplot-mapper'
import BarChart from '~/components/BarChart.vue'
import Sankey from '~/components/Sankey.vue'

defineOptions({
  name: 'IndexPage',
})

const years = Array.from({ length: 12 }, (_, i) => i + 2011)

const sankeyRef = ref<InstanceType<typeof Sankey>>()
const barChartRef = ref<InstanceType<typeof BarChart>>()

const BASE_URL = import.meta.env.BASE_URL

let accidents: null | any = null
const isLoading = ref(true)
const isTopData: null | any = ref(true)
const configNo = ref(0)
const vizText: string[] = ['plus', 'moins']

async function refreshData() {
  configNo.value = (1 + configNo.value) % 3
  isTopData.value = configNo.value === stackedBarplotConfig[2] ? null : !isTopData.value
  await nextTick()
}

onMounted(async () => {
  // Load the data
  Promise.all(years.map(year => d3.csv(`${BASE_URL}data/Rapport_Accident_${year}.csv`)))
    .then(
      (onfulfilled) => {
        accidents = onfulfilled
        // Filter out the data for Montréal (06)
        for (let i = 0; i < accidents.length; i++)
          accidents[i] = accidents[i].filter((el: any) => Object.values(el)[8] !== 'Montréal (06)')

        // Data as been loaded
        isLoading.value = false

        nextTick(() => {
          let elements: HTMLElement[] = [];
          ['.viz'].forEach((selector) => {
            elements = elements.concat(Array.from(document.querySelectorAll(selector)))
          })
          stickyBits(elements, { stickyBitStickyOffset: 0 })

          // Initializes the scroller and the visualizations.
          Promise.all([
            sankeyRef.value!.initialize(),
            barChartRef.value!.initialize(),
          ]).then(([c1, c2]) => {
            scroller([c1, c2]).initialize()
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
              En réalité, lorsque la surface de la route est sèche, les conducteurs peuvent être enclins à adopter une vitesse plus élevée,
              à une distance de suivi plus courte et à une conduite plus agressive en général, ce qui accroît le risque d'accidents.
            </p>
          </section>
          <section>
            <p v-if="configNo < 2">
              Voici une visualisation des 4 états de surface de route causant le {{ vizText[configNo] }} d'accidents
            </p>
            <p v-else>
              Voici une visualisation qui compare les accidents causés par une chaussée sèche et
              par les autres états de surface de route. On observe que le nombre d'accidents et la gravité de ceux-ci
              sont quasiment le double lorsque la route est sèche.
            </p>
            <button
              style="border-radius: 4px; background-color:lightblue; margin:10px; padding: 0 10px; height: 25px;"
              @click="refreshData()"
            >
              Changer de vue
            </button>
          </section>
        </div>
        <StackedBarplot
          v-if="configNo === stackedBarplotConfig[0]"
          :data-mapped="stackedData.all" :is-top-data="isTopData" :config-no="configNo"
        />
        <StackedBarplot
          v-else-if="configNo === stackedBarplotConfig[1]"
          :data-mapped="stackedData.all" :is-top-data="isTopData" :config-no="configNo"
        />
        <StackedBarplot
          v-else
          :data-mapped="stackedData.regrouped" :is-top-data="isTopData" :config-no="configNo"
        />
      </section>
      <div v-if="!isLoading">
        <Sankey ref="sankeyRef" :accidents />
        <BarChart ref="barChartRef" :accidents />
      </div>
    </div>
  </div>
</template>

<style>
.intro {
  height: 100vh;
}
</style>
