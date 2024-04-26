<script setup>
function initialize() {
  return new Promise((resolve) => {
    resolve([
      () => {
        console.warn(1)
      },
      () => {
        console.warn(2)
      },
      () => {
        console.warn(3)
      },
      () => {
        console.warn(4)
      },
    ])
  })
}

defineExpose({ initialize })
</script>

<template>
  <section class="viz-section measures">
    <div class="steps measures-details">
      <section class="measures-details-item">
        <span class="item-number">1</span>
        <img src="/search.svg">
        <h3>Collecte des données</h3>
        <p>
          Les données sur les accidents routiers sont fournies par Données
          Québec et ont été récoltées depuis 2011 jusqu'à fin 2022. Toutefois,
          ces dernières proviennent de la Société de l'assurance automobile du
          Québec (SAAQ).
        </p>
        <a
          href="https://www.donneesquebec.ca/recherche/fr/dataset/rapports-d-accident"
        >Rapports d'accident à Montréal de 2011 à 2022</a>
      </section>
      <section class="measures-details-item">
        <span class="item-number">2</span>
        <img src="/clean.svg">
        <h3>Nettoyage et Prétraitement des Données</h3>
        <p>
          Une fois collectées, les données sont nettoyées et prétraitées pour
          éliminer les erreurs, les doublons et les valeurs manquantes. Ce
          processus garantit la qualité et la fiabilité des données utilisées
          dans l'analyse ultérieure.
        </p>
      </section>
      <section class="measures-details-item">
        <span class="item-number">3</span>
        <img src="/notebook.svg">
        <h3>Analyse et Traitement Statistique</h3>
        <p>
          Après le prétraitement, les données sont analysées et traitées
          statistiquement pour identifier les tendances, les modèles et les
          corrélations significatives.
        </p>
      </section>
      <section class="measures-details-item">
        <span class="item-number">4</span>
        <img src="/viz.svg">
        <h3>Visualisation des Données</h3>
        <p>
          Enfin, les résultats de l'analyse sont présentés visuellement à l'aide
          de graphiques, de tableaux et d'autres outils de visualisation des
          données. Ces visualisations permettent de communiquer efficacement les
          conclusions de l'analyse et de mettre en évidence les principaux
          résultats de manière claire et concise.
        </p>
      </section>
    </div>
    <div class="viz measures-intro">
      <h1>Méthodologie</h1>
      <p>
        La section ici présente se concentre sur la méthodologie utilisée pour
        recueillir, traiter et visualiser les données relatives aux accidents
        routiers. Cette méthodologie comprend plusieurs étapes cruciales, allant
        de la collecte initiale des données à leur présentation visuelle.
      </p>
    </div>
  </section>
</template>

<style scoped>
.measures {
  padding-right: 0 !important;
  padding-left: 0 !important;
}

.measures-intro {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 0px 150px;
  text-align: start;
  h1 {
    font-size: 3rem;
    font-weight: 700;
    width: 100%;
    margin-bottom: 1rem;
  }
  p {
    text-align: start;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #616163;
  }
}

.measures-details-item {
  margin: auto auto 0vh !important;
  transform: none !important;
}

.measures-details {
  display: flex;
  flex-direction: column;
  gap: 50px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    url('/left.png');
  background-attachment: fixed;
  background-size: 45%;
  background-repeat: no-repeat;
  padding: 32vh 0 32vh 0 !important;
  flex-basis: 50% !important;
}

.measures-details-item {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
  max-width: 65% !important;
  position: relative;
  backdrop-filter: blur(30px);
  background: #ffffff80;
  border: 1px solid #ffffff80;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 0 70px #0000000d;

  span {
    position: absolute;
    top: 15px;
    right: 15px;
  }

  a {
    text-decoration: underline;
  }

  img {
    width: 50px;
    height: 50px;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
  }
}
</style>
