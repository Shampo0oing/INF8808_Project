<script setup lang="ts" generic="T extends any, O extends any">
import stickyBits from 'stickybits'
import BarChart from '~/components/BarChart.vue'
import Radar from '~/components/Radar.vue'
import Sankey from '~/components/Sankey.vue'
import StackedBarplot from '~/components/StackedBarplot.vue'
import TreeMap from '~/components/TreeMap.vue'
import Waffle from '~/components/Waffle.vue'

defineOptions({
  name: 'IndexPage',
})

const barChartRef = ref<InstanceType<typeof BarChart>>()
const treeMapRef = ref<InstanceType<typeof TreeMap>>()
const radarRef = ref<InstanceType<typeof Radar>>()
const waffleRef = ref<InstanceType<typeof Waffle>>()
const stackedBarplotRef = ref<InstanceType<typeof StackedBarplot>>()
const sankeyRef = ref<InstanceType<typeof Sankey>>()

onMounted(async () => {
  let elements: HTMLElement[] = [];
  ['.viz'].forEach((selector) => {
    elements = elements.concat(Array.from(document.querySelectorAll(selector)))
  })
  stickyBits(elements, { stickyBitStickyOffset: 0 })

  // Initializes the scroller and the visualizations.
  Promise.all([
    barChartRef.value!.initialize(),
    radarRef.value!.initialize(),
    treeMapRef.value!.initialize(),
    waffleRef.value!.initialize(),
    sankeyRef.value!.initialize(),
    stackedBarplotRef.value!.initialize(),
  ]).then(([c1, c2, c3, c4, c5, c6]) => {
    scroller([c1, c2, c3, c4, c5, c6]).initialize()
  })
})
</script>

<template>
  <div>
    <div relative flex flex-col>
      <section class="intro text-section">
        <h1>Projet INF8808</h1>
        <p>
          La région métropolitaine de Montréal est confrontée chaque année à un
          défi majeur en matière de sécurité routière. Un nombre significatif de
          collisions impliquant des véhicules motorisés sont enregistrées
          annuellement, entraînant des conséquences allant de simples dommages
          matériels à des blessures graves, voire mortelles. Ces incidents
          perturbent non seulement la fluidité du trafic, mais mettent également
          en danger la sécurité des usagers de la route. Dans notre démarche
          pour renforcer la sécurité routière et déterminer les origines des
          accidents, nous nous engageons dans une analyse approfondie des
          incidents afin de repérer les éléments pouvant impacter la sécurité
          des routes. En améliorant notre compréhension des facteurs influençant
          le comportement des conducteurs à Montréal, nous visons à accroître
          leur sensibilisation pour rendre les routes de la ville plus
          sécurisées.
        </p>
      </section>
      <div>
        <BarChart ref="barChartRef" />
        <Radar ref="radarRef" />
        <TreeMap ref="treeMapRef" />
        <Waffle ref="waffleRef" />
        <Sankey ref="sankeyRef" />
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
