<script setup lang="ts" generic="T extends any, O extends any">
import * as d3 from "d3";
import stickyBits from "stickybits";
import BarChart from "~/components/BarChart.vue";
import Sankey from "~/components/Sankey.vue";

defineOptions({
  name: "IndexPage",
});

const years = Array.from({ length: 12 }, (_, i) => i + 2011);

const sankeyRef = ref<InstanceType<typeof Sankey>>();
const barChartRef = ref<InstanceType<typeof BarChart>>();

const BASE_URL = import.meta.env.BASE_URL;

const accidents: null | any = ref(null);
const accidentsRadar: null | any = ref(null);
const yearsRadar: null | any = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  // Load the data
  Promise.all(
    years.map((year) => d3.csv(`${BASE_URL}data/Rapport_Accident_${year}.csv`))
  )
    .then(
      (onfulfilled) => {
        accidents = onfulfilled;
        // Filter out the data for Montréal (06)
        for (let i = 0; i < accidents.length; i++)
          accidents[i] = accidents[i].filter(
            (el: any) => Object.values(el)[8] !== "Montréal (06)"
          );

        // Data as been loaded
        isLoading.value = false;

        nextTick(() => {
          let elements: HTMLElement[] = [];
          [".viz"].forEach((selector) => {
            elements = elements.concat(
              Array.from(document.querySelectorAll(selector))
            );
          });
          stickyBits(elements, { stickyBitStickyOffset: 0 });

          // Initializes the scroller and the visualizations.
          Promise.all([
            sankeyRef.value!.initialize(),
            barChartRef.value!.initialize(),
          ]).then(([c1, c2]) => {
            scroller([c1, c2]).initialize();
          });
        });
      },
      (onrejected) => {
        console.error(onrejected);
      }
    )
    .catch((err) => {
      console.error(err);
    });
});
</script>

<template>
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
