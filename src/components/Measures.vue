<script setup></script>

<template>
  <section class="text-section measures-intro">
    <h1>Mesures de prévention</h1>
    <p>
      À la lumière de nos recherches sur les accidents à Montréal, il est
      intéressant de constater que la majorité de ces incidents surviennent dans
      des conditions où les conditions météorologiques et routières sont
      propices à une conduite sûre. En d'autres mots, cela signifie que ces
      moments de clémence climatique semblent engendrer un relâchement de la
      vigilance chez les conducteurs, entraînant des conséquences
      potentiellement fatales. Face à ce constat, il est important de rappeler
      quelques mesures de prévention à adopter pour éviter les accidents de la
      route.
    </p>
  </section>
  <section class="measures-details">
    <ul class="measures-details-list">
      <li class="measures-details-item">
        <span class="item-number">1</span>
        <img src="/public/car-search.svg">
        <h3>Maintenir son véhicule</h3>
        <p>
          Effectuer régulièrement l'entretien de son véhicule, y compris les
          freins, les pneus, les feux et les essuie-glaces, peut prévenir les
          pannes et les accidents dus à des défaillances mécaniques.
        </p>
      </li>
      <li class="measures-details-item">
        <span class="item-number">2</span>
        <img src="/public/priority.svg">
        <h3>Règles de priorité</h3>
        <p>
          Donner la priorité aux piétons, aux cyclistes et aux autres véhicules
          selon les règles de circulation peut éviter les collisions et les
          accidents.
        </p>
      </li>
      <li class="measures-details-item">
        <span class="item-number">3</span>
        <img src="/public/food.svg">
        <h3>Distraction</h3>
        <p>
          Éviter les distractions telles que l'utilisation du téléphone portable
          ou manger en conduisant peut aider à maintenir l'attention sur la
          route et à réagir rapidement aux situations dangereuses.
        </p>
      </li>
      <li class="measures-details-item">
        <span class="item-number">4</span>
        <img src="/public/meteo.svg">
        <h3>S'informer</h3>
        <p>
          Adapter sa conduite aux conditions météorologiques, comme la pluie, la
          neige ou le brouillard, en réduisant sa vitesse et en augmentant la
          distance de sécurité, peut améliorer la sécurité sur la route.
        </p>
      </li>
      <li class="measures-details-item">
        <span class="item-number">5</span>
        <img src="/public/priority.svg">
        <h3>Distance de securité</h3>
        <p>
          Garder une distance adéquate entre votre véhicule et celui qui vous
          précède peut vous donner plus de temps pour réagir en cas d'urgence et
          éviter les collisions par l'arrière.
        </p>
      </li>
      <li class="measures-details-item">
        <span class="item-number">6</span>
        <img src="/public/speed.svg">
        <h3>Vitesse</h3>
        <p>
          Adapter sa vitesse aux conditions de la route et respecter les limites
          de vitesse indiquées peut réduire les risques d'accidents et de
          blessures graves.
        </p>
      </li>
    </ul>
  </section>
</template>

<style>
.measures-intro {
  position: sticky;
  flex: 0.5;
}

.measures-details {
  flex: 0.5;
}

.measures-details-item {
  position: relative;
  backdrop-filter: blur(30px);
  background: #ffffff80;
  border: 1px solid #ffffff80;
  border-radius: 20px;
  flex-direction: column;
  margin-bottom: 40px;
  padding: 40px 30px;
  box-shadow: 0 0 70px #0000000d;
}

.item-number {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
