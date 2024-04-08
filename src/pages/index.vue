<script setup lang="ts" generic="T extends any, O extends any">
import * as d3 from "d3";
import stickyBits from "stickybits";

defineOptions({
  name: "IndexPage",
});

const BASE_URL = import.meta.env.BASE_URL;

const accidents: null | any = ref(null);
const accidentsRadar: null | any = ref(null);
const yearsRadar: null | any = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  // CHARGEMENT DES DONNÉES
  Promise.all([
    d3.csv(`${BASE_URL}data/Rapport_Accident_2011.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2012.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2013.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2014.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2015.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2016.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2017.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2018.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2019.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2020.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2021.csv`),
    d3.csv(`${BASE_URL}data/Rapport_Accident_2022.csv`),
  ])
    .then(
      (onfulfilled) => {
        accidents.value = onfulfilled;
        isLoading.value = false;
        const initialize = async () => {
          const dataCopy = accidents;
          return [
            () => {
              accidentsRadar.value = [dataCopy.value[0]];
              yearsRadar.value = ["2011"];
            },
            () => {
              accidentsRadar.value = [dataCopy.value[8]];
              yearsRadar.value = ["2019"];
            },
            () => {
              accidentsRadar.value = [dataCopy.value[0], dataCopy.value[8]];
              yearsRadar.value = ["2011", "2019"];
            },
            () => {
              accidentsRadar.value = [dataCopy.value[11]];
              yearsRadar.value = ["2022"];
            },
            () => {
              accidentsRadar.value = [dataCopy.value[8], dataCopy.value[11]];
              yearsRadar.value = ["2019", "2022"];
            },
          ];
        };

        let elements: HTMLElement[] = [];
        [".viz"].forEach((selector) => {
          elements = elements.concat(
            Array.from(document.querySelectorAll(selector))
          );
        });
        stickyBits(elements, { stickyBitStickyOffset: 0 });

        // Initializes the scroller and the visualizations.
        Promise.all([initialize()]).then(([callbacks]) => {
          scroller([callbacks]).initialize();
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
  <!-- <div v-if="!isLoading"> -->
  <!-- <VizTest :accidents /> -->
  <!-- </div> -->
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
      <section class="viz-section">
        <div class="steps">
          <section>
            <p>
              En 2011, Montréal a enregistré un nombre élevé d'accidents,
              atteignant un pic de 17600. Aucune saison ne se distingue
              particulièrement en termes d'accidents, mais nous pouvons
              constater une baisse légère durant l'été et le printemps.
            </p>
          </section>
          <section>
            <p>
              En 2019, la pandémie de Covid-19 frappe Montréal. Malgré la
              tendance croissante à rester chez soi, un pic de 15600 accidents
              est enregistré en un mois. Comme précédemment, les taux
              d'accidents semblent être plus élevés en automne et en hiver par
              rapport à l'été et au printemps.
            </p>
          </section>
          <section>
            <p>
              En comparant les deux années, on remarque une diminution du nombre
              d'accidents de 2011 à 2019. La crise sanitaire liée à la Covid-19
              a probablement joué un rôle dans cette baisse, étant donné que
              moins de personnes étaient en circulation pendant le confinement.
              Cependant, ce décroissement restera-t-elle constante après la fin
              de la pandémie?
            </p>
          </section>
          <section>
            <p>
              En 2022, la fin de la pandémie marque un retour graduel des
              déplacements, en particulier pour le travail. La tendance à la
              baisse semble avoir été maintenue, car le pic mensuel d'accidents
              est désormais de 10600. Une fois de plus, l'automne et l'hiver
              enregistrent davantage d'accidents que l'été et le printemps. Il
              est possible que la présence de neige durant ces deux saisons
              contribue à rendre les conditions routières plus précaires, ce qui
              entraîne une augmentation des accidents.
            </p>
          </section>
          <section>
            <p>
              En comparant les années 2019 et 2022, on ressent clairement une
              différence. En général, le nombre d'accidents est moins élevé
              chaque mois. Il est possible que les Montréalais aient pris
              conscience de l'importance de la sécurité et de l'attention après
              la pandémie, ce qui pourrait également avoir influencé leur façon
              de conduire. Qui sait!
            </p>
          </section>
        </div>
        <Radar
          v-if="!isLoading"
          class="viz"
          :accidents-radar="accidentsRadar"
          :years-radar="yearsRadar"
        />
      </section>
    </div>
  </div>
</template>

<style>
.intro {
  height: 100vh;
}
</style>
