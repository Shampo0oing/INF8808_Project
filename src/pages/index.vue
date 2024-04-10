<script setup lang="ts" generic="T extends any, O extends any">
import * as d3 from 'd3'
import stickyBits from 'stickybits'
import stackedData from '../../public/data/StackedBarplot.json'
import StackedBarplot from '~/components/StackedBarplot.vue'
import stackedBarplotConfig from '~/composables/stackedBarplot-mapper'

defineOptions({
  name: 'IndexPage',
})

const BASE_URL = import.meta.env.BASE_URL

const accidents: null | any = ref(null)
const accidentsRadar: null | any = ref(null)
const yearsRadar: null | any = ref(null)
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
        accidentsRadar.value = [
          accidents.value[0],
          accidents.value[8],
          accidents.value[11],
        ]
        yearsRadar.value = ['2011']
        isLoading.value = false
        const initialize = async () => {
          return [
            () => {
              yearsRadar.value = ['2011']
            },
            () => {
              yearsRadar.value = ['2019']
            },
            () => {
              yearsRadar.value = ['2011', '2019']
            },
            () => {
              yearsRadar.value = ['2022']
            },
            () => {
              yearsRadar.value = ['2019', '2022']
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
            <div style="border-style:solid; border: 5px; border-color: black">
              <button
                type="button"
                style="background-color: orange; margin:10px; padding: 0 10px; height: 25px;"
                @click="refreshData()"
              >
                Changer de vue
              </button>
            </div>
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
    </div>
  </div>
</template>

<style>
.intro {
  height: 100vh;
}
</style>
