/**
 * scroller.js
 * ===========
 * Defines the logic used by the scroller. This script does not need external dependencies and uses native functions
 * of the browser.
 *
 * It is a lightweight version of the scroller script used in Le Devoir's articles.
 *
 * @author Antoine Béland
 * @licence MIT
 * @copyright Le Devoir, All rights reserved
 */

'use strict'

function useScrollerStep(el: HTMLElement, index: string, callback: (scrollDirection: string) => void): ScrollerStep {
  const element = ref(el)
  const stepIndex = ref(index)
  const stepCallback = ref(callback)
  const isActivated = ref(false)

  const activate = (scrollDirection: string) => {
    if (isActivated.value)
      return

    isActivated.value = true
    element.value.classList.add('active')
    stepCallback.value(scrollDirection)
  }

  const deactivate = () => {
    if (!isActivated.value)
      return

    isActivated.value = false
    element.value.classList.remove('active')
  }

  return {
    element,
    stepIndex,
    stepCallback,
    isActivated,
    activate,
    deactivate,
  }
}

/**
 * Defines the scroll directions.
 *
 * @type {{down: string, up: string}}
 */
export const scrollDirections: { down: string, up: string } = {
  down: 'down',
  up: 'up',
}

/**
 * Defines the scroller to use with the Le Devoir's scrollytelling articles. Please see "README.md"
 * to know how to use it.
 *
 * /!\ Be sure to use the good CSS class names in your HTML file before to use the function.
 *
 * @param callbacks   A multi-dimensional array of callbacks to use with each step.
 * @returns {*}       The instance of the scroller.
 */
export interface ScrollerStep {
  element: Ref<HTMLElement>
  stepIndex: Ref<string>
  stepCallback: Ref<(scrollDirection: string) => void>
  isActivated: Ref<boolean>
  activate: (scrollDirection: string) => void
  deactivate: () => void
}

export interface Scroller {
  scrollDirections: {
    down: string
    up: string
  }
  initialize: () => void
  offsetBottom: (offsetBottom?: number) => number | undefined
  offsetTop: (offsetTop?: number) => number | undefined
}

export default function useScroller(callbacks: ((scrollDirection: string) => void)[][]): Scroller {
  const scrollDirections = {
    down: 'down',
    up: 'up',
  }

  const _offsetTop = ref(0)
  const _offsetBottom = ref(0)
  const innerHeight = ref(window.innerHeight)
  const isInitialized = ref(false)
  const lastScroll = ref(0)
  const steps: ScrollerStep[] = []
  const viz: HTMLElement[] = []
  let visibleSteps: ScrollerStep[] = []

  const vizSections = document.querySelectorAll('.viz-section')
  if (vizSections.length !== callbacks.length) {
    throw new Error(`The number of viz sections (${vizSections.length}) mismatch with the length of the first `
      + `dimension of the callbacks array (${callbacks.length}). Please, be sure that the two elements `
      + `have the same size.`)
  }
  vizSections.forEach((vizSection, i) => {
    const sections = Array.from(vizSection.querySelectorAll('section'))
    if (sections.length !== callbacks[i].length) {
      throw new Error(`The number of steps (${sections.length}) in the viz section #${i + 1} mismatch with the `
        + `number of callbacks specified (${callbacks[i].length}) at the index "${i}". Please, be sure that the two `
        + `elements have the same size.`)
    }
    steps.push(...sections.map((e, j) => useScrollerStep(e, `${i}-${j}`, callbacks[i][j])))
    const vizElements = vizSection.querySelector('.viz > *') as HTMLElement
    vizElements && viz.push(vizElements)
  })

  const _update = () => {
    const currentScroll = window.scrollY || document.documentElement.scrollTop
    steps.forEach((step) => {
      // Check if the current step is in the viewport.
      const boundingRect = step.element.value.getBoundingClientRect()
      if (innerHeight.value - boundingRect.top - _offsetBottom.value > 0
        && boundingRect.top + boundingRect.height - _offsetTop.value > 0)
        visibleSteps.push(step)
      else
        step.deactivate()
    })

    // For the visible steps, choose the good one based on the scroll direction.
    visibleSteps.forEach((section, i) => {
      if (currentScroll >= lastScroll.value) { // Scroll down (↓)
        if (i === visibleSteps.length - 1)
          section.activate(scrollDirections.down)
        else
          section.deactivate()
      }
      else { // Scroll up (↑)
        if (i === 0)
          section.activate(scrollDirections.up)
        else
          section.deactivate()
      }
    })

    // Reset the variables for the next function call.
    visibleSteps = []
    lastScroll.value = currentScroll
  }

  const initialize = () => {
    if (isInitialized.value)
      throw new Error('The scroller is already initialized.')

    isInitialized.value = true
    window.addEventListener('scroll', _update)
    window.addEventListener('resize', () => {
      innerHeight.value = window.innerHeight
    })
    if ((window.scrollY || document.documentElement.scrollTop) > 0)
      _update()
  }

  const offsetBottom = (offsetBottom?: number) => {
    if (offsetBottom === undefined)
      return _offsetBottom.value

    if (!Number.isInteger(offsetBottom))
      throw new Error('The offset must be an integer number.')

    _offsetBottom.value = offsetBottom
  }

  const offsetTop = (offsetTop?: number) => {
    if (offsetTop === undefined)
      return _offsetTop.value

    if (!Number.isInteger(offsetTop))
      throw new Error('The offset must be an integer number.')

    _offsetTop.value = offsetTop
  }

  return {
    scrollDirections,
    initialize,
    offsetBottom,
    offsetTop,
  }
}
