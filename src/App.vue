<template>
  <div>
    <div class="fluid-container">
      <b-jumbotron class="bg-primary shadow rounded-0 text-light">
        <div class="container">
          <b-badge class="float-right" variant="light">Niveau : Boss Final</b-badge>
          <h1>Simulateur d'impôt sur le revenu</h1>
          <b-form-select
          class="select-bareme"
          v-model="bareme"
          :options="optionsBareme"
          @input="calculer"
          ></b-form-select>
        </div>
      </b-jumbotron>
    </div>
    <div class="container">
      <b-card class="mt-4 shadow" border-variant="primary" header-text-variant="primary">
        <template v-slot:footer>
          <i>Simulez le montant de l'impôt sur votre revenu en saisissant le montant de vos revenus imposables ou bien estimez le montant de vos revenus imposables nécessaire à partir du montant après impôt désiré.</i>
        </template>
        <template v-slot:header>
          <h5 class="mb-0">1. Je renseigne mes revenus</h5>
        </template>
        <b-row>
          <b-col sm="5">
            <b-form-group
            label="Mes revenus imposables"
            description="Il s'agit de vos revenus net imposables après l'abattement forfaitaire ou réel"
            >
              <b-input-group append="€">
                <b-form-input
                type="number"
                class="text-right"
                min="0"
                size="lg"
                ref="refRevenusImposables"
                v-model.number="revenusImposables"
                @input="calculerImpots"
                @focus="$event.target.select()"
                @click="$event.target.select()"
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col sm="2">
            <p class="text-center h2">
              <b-icon-arrow-right-circle-fill
              class="mb-0 mt-5 d-none d-sm-inline-block"
              :rotate="sensCalculNormal ? 0 : 180"
              variant="primary"
              v-b-tooltip.hover
              :title="phraseMontantImpot"
              ></b-icon-arrow-right-circle-fill>
              <b-icon-arrow-down-circle-fill
              class="d-sm-none"
              :rotate="sensCalculNormal ? 0 : 180"
              variant="primary"
              v-b-tooltip.hover
              :title="phraseMontantImpot"
              ></b-icon-arrow-down-circle-fill>
            </p>
          </b-col>
          <b-col sm="5">
            <b-form-group
            label="Mes revenus après impôt"
            description="Il s'agit de vos revenus net d'impôt (après déduction des impôts)"
            >
              <b-input-group append="€">
                <b-form-input
                  type="number"
                  class="text-right"
                  min="0"
                  size="lg"
                  v-model.number="revenusApresImpots"
                  @input="chercherRevenusImposables"
                  @focus="$event.target.select()"
                  @click="$event.target.select()"
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>
      <b-card class="mt-4 shadow" border-variant="primary" header-text-variant="primary">
        <template v-slot:header>
          <h5 class="mb-0">2. Je renseigne les caractéristiques de mon foyer fiscal</h5>
        </template>
        <b-row>
          <b-col sm="12">
            <p>
              <b-form-checkbox
              id="couple"
              v-model="couple"
              @input="calculer"
              >Je suis marié.e (ou pacsé.e)</b-form-checkbox>
            </p>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="5">
            <b-form-group
            label="Mes enfants à charge"
            description="Saisissez le nombre d'enfants total à votre charge"
            >
              <b-form-spinbutton
              min="0"
              max="99"
              v-model.number="nombreEnfantsTotal"
              @change="ajusterNombreEnfantsCMI"
              ></b-form-spinbutton>
            </b-form-group>
          </b-col>
          <b-col sm="2">
          </b-col>
          <b-col sm="5">
            <b-form-group
            label="Mes enfants titulaires de la CMI"
            description="Saisissez le nombre de vos enfants titulaires de la CMI parmi tous vos enfants à charge"
            >
              <b-form-spinbutton
              min="0"
              :max="nombreEnfantsTotal"
              :disabled="nombreEnfantsTotal <= 0"
              v-model.number="nombreEnfantsCMI"
              @change="calculer"
              ></b-form-spinbutton>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>
      <b-card class="mt-4 mb-4 shadow"  border-variant="primary" header-text-variant="primary">
        <template v-slot:header>
          <h5 class="mb-0">3. Je consulte le résultat de ma simulation</h5>
        </template>
        <ResultatSimulation :detailsImpots="detailsImpots"></ResultatSimulation>
      </b-card>
    </div>
  </div>
</template>

<script>
import SimulationImpots from './models/SimulationImpots';
import FoyerFiscal from './models/FoyerFiscal';
import baremesImpots from './utils/baremes-impots';
import ResultatSimulation from './components/ResultatSimulation';

export default {
  components: {
    ResultatSimulation
  },
  name: "App",
  data: () => ({
    baremesImpots,
    bareme: baremesImpots[2020],
    revenusImposables: 0,
    revenusApresImpots: 0,
    nombreEnfantsTotal: 0,
    nombreEnfantsCMI: 0,
    couple: false,
    detailsImpots: null,
    sensCalculNormal: true,
  }),
  computed: {
    phraseMontantImpot() {
      return `Le montant total de votre impôt s'élève à ${(this.detailsImpots ? this.detailsImpots.impotsTotal : 0)}€`;
    },
    optionsBareme() {
      return Object.keys(this.baremesImpots)
        .map(annee => ({
          value: this.baremesImpots[annee],
          text: `Barème de l'année ${annee}`
        })
      );
    }
  },
  methods: {
    /**
     * Lance le calcul à partir des valeurs renseignées par défaut
     * et donne le focus au champs "revenus imposables"
     */
    init() {
      this.calculer();
      this.$refs.refRevenusImposables.$el.focus();
    },
    /**
     * Retourne un objet simulation avec les paramètres donnés (barême et infos du foyer fiscal)
     */
    getSimulation() {
      const foyerFiscal = new FoyerFiscal(
        this.couple,
        this.nombreEnfantsTotal,
        this.nombreEnfantsCMI
      )
      return new SimulationImpots(this.bareme, foyerFiscal);
    },
    /**
     * Permet de remettre à 0 les champs de revenus
     */
    resetMontantsRevenus() {
      this.revenusImposables = 0;
      this.revenusApresImpots = 0;
      this.detailsImpots = null;
    },
    /**
     * Lance une simulation d'impôts pour un montant de revenus imposables donné
     */
    calculerImpots() {
      this.sensCalculNormal = true;
      if(!this.revenusImposables) {
        return this.resetMontantsRevenus();
      }
      setTimeout(() => {
        this.revenusImposables = Math.round(this.revenusImposables, 10);
        const detailsImpots = this.getSimulation().calculerImpots(this.revenusImposables);
        this.revenusApresImpots = detailsImpots.revenusApresImpots;
        this.detailsImpots = detailsImpots;
      });
    },
    /**
     * Cherche le revenu imposable par rapport aux revenus apres impots attendus
     */
    chercherRevenusImposables() {
      this.sensCalculNormal = false;
      if(!this.revenusApresImpots) {
        return this.resetMontantsRevenus();
      }
      setTimeout(() => {
        this.revenusApresImpots = Math.round(this.revenusApresImpots, 10);
        const resultatSimulationRevenus = this.getSimulation().chercherRevenusImposables(this.revenusApresImpots);
        this.revenusImposables = resultatSimulationRevenus.revenusImposables;
        this.detailsImpots = resultatSimulationRevenus.detailsImpots;
        console.log({
          "Nombre d'itérations": resultatSimulationRevenus.meta.nombreIterations,
          "Temps total écoulé": resultatSimulationRevenus.meta.tempsTotalEcoule,
        });
      });
    },
    /**
     * En fonction du dernier sens de calcul connu, on lance la simulation
     */
    calculer() {
      if (this.sensCalculNormal) {
        this.calculerImpots();
      } else {
        this.chercherRevenusImposables();
      }
    },
    /**
     * Ajuste le nombre d'enfants CMI :
     * il ne peut pas y avoir plus d'enfant CMI que d'enfant total
     */
    ajusterNombreEnfantsCMI() {
      if(this.nombreEnfantsCMI > this.nombreEnfantsTotal) {
        this.nombreEnfantsCMI = this.nombreEnfantsTotal;
      }
      this.calculer();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
legend {
  font-weight: bold;
}

.select-bareme {
  width: auto;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
