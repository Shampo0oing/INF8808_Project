<script setup lang="ts" generic="T extends any, O extends any">
import stickyBits from 'stickybits'
import BarChart from '~/components/BarChart.vue'
import Radar from '~/components/Radar.vue'
import Sankey from '~/components/Sankey.vue'
import StackedBarplot from '~/components/StackedBarplot.vue'
import TreeMap from '~/components/TreeMap.vue'
import Waffle from '~/components/Waffle.vue'
import Measures from '~/components/Measures.vue'
import Methodology from '~/components/Methodology.vue'

defineOptions({
  name: 'IndexPage',
})

const barChartRef = ref<InstanceType<typeof BarChart>>()
const treeMapRef = ref<InstanceType<typeof TreeMap>>()
const radarRef = ref<InstanceType<typeof Radar>>()
const waffleRef = ref<InstanceType<typeof Waffle>>()
const stackedBarplotRef = ref<InstanceType<typeof StackedBarplot>>()
const sankeyRef = ref<InstanceType<typeof Sankey>>()
const measuresRef = ref<InstanceType<typeof Measures>>()
const methodologyRef = ref<InstanceType<typeof Methodology>>()

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
    measuresRef.value!.initialize(),
    methodologyRef.value!.initialize(),
  ]).then(([c1, c2, c3, c4, c5, c6, c7, c8]) => {
    scroller([c1, c2, c3, c4, c5, c6, c7, c8]).initialize()
  })
})
</script>

<template>
  <div>
    <div relative flex flex-col>
      <section class="section">
        <MainPage />
      </section>
      <div id="barChartParent">
        <BarChart ref="barChartRef" />
        <Radar ref="radarRef" />
        <TreeMap ref="treeMapRef" />
        <Waffle ref="waffleRef" />
        <Sankey ref="sankeyRef" />
        <StackedBarplot ref="stackedBarplotRef" />
        <Measures ref="measuresRef" />
        <Methodology ref="methodologyRef" />
      </div>
    </div>
  </div>
</template>

<style>
.section {
  height: 100vh;
}
</style>
