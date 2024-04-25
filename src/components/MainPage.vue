<script setup>
function scrollToBottom() {
  document
    .getElementById('barChartParent')
    .scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="background-image">
    <div class="text-section">
      <div class="title">
        <h1>Comprendre les accidents de la route</h1>
        <p>
          Les collisions de véhicules motorisés à Montréal sont un défi majeur.
          Nos analyses de 2011 à 2022 visent à renforcer la sécurité routière en
          identifiant les facteurs de risque et en sensibilisant les conducteurs
          pour des routes plus sûres.
        </p>
      </div>
      <button @click="scrollToBottom">
        <img src="/public/arrow.svg" class="arrow">
      </button>
    </div>
  </div>
</template>

<style>
.title {
  display: flex;
  flex: 0.7;
  flex-direction: column;
  justify-content: center;
  align-items: start;
}

.title h1 {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.title p {
  font-size: 1.15rem;
  font-weight: 400;
  line-height: 1.5;
}

.background-image {
  display: flex;
  justify-content: center;
  background-image: url('/public/car.svg');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #e4f5ff;
}

.arrow {
  transform: rotate(90deg);
  width: 60px;
  border: black 2px solid;
  border-radius: 50%;
  padding: 15px;
}
</style>
