<script setup lang="ts" generic="T extends any, O extends any">
import stickyBits from 'stickybits'
import Waffle from '~/components/Waffle.vue'
import StackedBarplot from '~/components/StackedBarplot.vue'

defineOptions({
  name: 'IndexPage',
})

const waffleRef = ref<InstanceType<typeof Waffle>>()
const stackedBarplotRef = ref<InstanceType<typeof StackedBarplot>>()

onMounted(async () => {
  let elements: HTMLElement[] = [];
  ['.viz'].forEach((selector) => {
    elements = elements.concat(Array.from(document.querySelectorAll(selector)))
  })
  stickyBits(elements, { stickyBitStickyOffset: 0 })

  // Initializes the scroller and the visualizations.
  Promise.all([
    stackedBarplotRef.value!.initialize(),
    waffleRef.value!.initialize(),
  ]).then(([c1, c2]) => {
    scroller([c1, c2]).initialize()
  })
})
</script>

<template>
  <div>
    <div relative flex flex-col>
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
      <div>
        <!-- <Sankey ref="sankeyRef" :accidents />
        <BarChart ref="barChartRef" :accidents />
        <Radar ref="radarRef" :accidents /> -->
        <StackedBarplot ref="stackedBarplotRef" />
        <Waffle ref="waffleRef" />
      </div>
    </div>
  </div>
</template>

<style>
.intro {
  height: 100vh;
}
</style>
