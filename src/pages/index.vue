<script setup lang="ts" generic="T extends any, O extends any">
import stickyBits from 'stickybits'
import { initialize as v1 } from '../dataviz/viz'

defineOptions({
  name: 'IndexPage',
})

onMounted(() => {
  let elements: HTMLElement[] = [];
  ['.viz'].forEach((selector) => {
    elements = elements.concat(Array.from(document.querySelectorAll(selector)))
  })
  stickyBits(elements, { stickyBitStickyOffset: 0 })

  // Initializes the scroller and the visualizations.
  Promise.all([v1()]).then(([callbacksV1]) => {
    scroller([callbacksV1])
      .initialize()
  })
})
</script>

<template>
  <main>
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
  </main>
</template>
