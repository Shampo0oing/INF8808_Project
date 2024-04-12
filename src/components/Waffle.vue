<script setup>
import * as d3 from 'd3'
import waffleData from '~/data/waffle/Types_Vehicules.json'

function initialize() {
  return new Promise((resolve) => {
    const waffle = d3.select('.waffle')
    const numbers = d3.range(400)

    const data = waffleData

    function setWaffle() {
      waffle
        .selectAll('.block')
        .data(numbers)
        .enter()
        .append('div')
        .attr('class', 'block')
        .style('background-color', '#CCCCCC')
    }

    setWaffle()

    resolve([
      () => {
        waffle.selectAll('.block').remove()
        setWaffle()
      },
      () => {
        waffle
          .selectAll('.block')
          .filter(
            (d, i) => i >= data[2].value + data[3].value + data[4].value,
          )
          .remove()

        setWaffle()

        waffle
          .selectAll('.block')
          .filter((d, i) => i < data[4].value)
          .transition()
          .delay((d, i) => i * 20)
          .style('background-color', '#FE4A49')

        waffle
          .selectAll('.block')
          .filter(
            (d, i) => i >= data[4].value && i < data[3].value + data[4].value,
          )
          .transition()
          .delay((d, i) => i * 20 + data[4].value * 20)
          .style('background-color', '#FFC107')

        waffle
          .selectAll('.block')
          .filter(
            (d, i) =>
              i >= data[3].value + data[4].value
              && i < data[2].value + data[3].value + data[4].value,
          )
          .transition()
          .delay((d, i) => i * 20 + (data[3].value + data[4].value) * 20)
          .style('background-color', '#4CAF50')
      },
      () => {
        waffle
          .selectAll('.block')
          .filter(
            (d, i) =>
              i >= data[2].value + data[3].value + data[4].value
              && i
              < data[1].value + data[2].value + data[3].value + data[4].value,
          )
          .transition()
          .delay((d, i) => i * 5)
          .style('background-color', '#2196F3')

        waffle
          .selectAll('.block')
          .filter(
            (d, i) =>
              i
              >= data[1].value + data[2].value + data[3].value + data[4].value,
          )
          .transition()
          .delay((d, i) => i * 5 + data[1].value * 5)
          .style('background-color', '#9C27B0')
      },
    ])
  })
}

defineExpose({ initialize })
</script>

<template>
  <section class="viz-section">
    <div class="steps">
      <section />
      <section>
        <p>
          Les accidents impliquant un piéton, un vélo ou une motocyclette
          représentent 7.5% de la totalité des accidents à Montréal. Ces types
          d'accidents peuvent être particulièrement dangereux pour les personnes
          impliquées, car contrairement aux occupants d'une voiture, ces
          derniers ne bénéficient pas de la protection extérieure offerte par un
          véhicule motorisé.
        </p>
      </section>
      <section>
        <p>
          Bien évidemment, les accidents impliquant un automobiliste ou un
          camion représentent la grande majorité des accidents enregistrés. Ce
          taux s'élève à 92.5%, ce qui souligne l'importance d'être extrêmement
          vigilant lors de la conduite.
        </p>
      </section>
    </div>
    <div class="viz">
      <div>
        <h2>Répartition des accidents selon le type de véhicule</h2>
        <figure class="waffle" />
      </div>
      <div class="legend">
        <div class="legend-item">
          <div class="circle" style="background-color: #9c27b0" />
          <div class="legend-label">
            Automobile
          </div>
        </div>
        <div class="legend-item">
          <div class="circle" style="background-color: #2196f3" />
          <div class="legend-label">
            Camion
          </div>
        </div>
        <div class="legend-item">
          <div class="circle" style="background-color: #4caf50" />
          <div class="legend-label">
            Motocyclette
          </div>
        </div>
        <div class="legend-item">
          <div class="circle" style="background-color: #ffc107" />
          <div class="legend-label">
            Vélo
          </div>
        </div>
        <div class="legend-item">
          <div class="circle" style="background-color: #fe4a49" />
          <div class="legend-label">
            Piéton
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.waffle {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  transform: rotateX(180deg);
  margin: 20px;
}

.circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

h2 {
  font-weight: bold;
  font-size: 2rem;
}

.block {
  width: 25px;
  height: 25px;
  margin: 4px;
}

.viz {
  display: flex;
  align-items: center;
}
</style>
