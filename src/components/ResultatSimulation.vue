<template>
  <div>
    <b-alert v-if="!detailsImpots" show variant="warning">Saisissez un montant dans la case "Revenus imposables" ou "Revenus après impôt" pour lancer la simulation</b-alert>
    <div v-else>
      <p>Le montant de <strong>votre impôt est de <b-badge variant="primary">{{detailsImpots.impotsTotal | monaie}}</b-badge></strong> ce qui représente <b-badge>{{detailsImpots.ratioDesRevenus | pourcentage}}</b-badge> de vos revenus imposables.</p>
      <p>Le montant de vos revenus imposables s'élèvant à <b-badge>{{detailsImpots.revenusImposables | monaie}}</b-badge> et <strong>votre foyer fiscal</strong> comprenant <b-badge variant="primary">{{detailsImpots.nombreParts}} {{detailsImpots.nombreParts >= 2 ? 'parts' : 'part'}}</b-badge>, votre quotient familial est donc de <b-badge>{{detailsImpots.quotientFamilial | monaie}}</b-badge></p>
      <p>En soumettant ce quotient familial de <b-badge>{{detailsImpots.quotientFamilial | monaie}}</b-badge> au barême, on constate 
        <span v-if="detailsImpots.trancheMarginaleImposition.max !== Infinity">qu'il est compris entre <b-badge>{{detailsImpots.trancheMarginaleImposition.min | monaie}}</b-badge> et <b-badge>{{detailsImpots.trancheMarginaleImposition.max | monaie}}</b-badge></span>
        <span v-if="detailsImpots.trancheMarginaleImposition.max === Infinity">qu'il est supérieur ou égal à <b-badge>{{detailsImpots.trancheMarginaleImposition.min | monaie}}</b-badge></span>
        ce qui donne un <strong>taux marginal d'imposition</strong> de <b-badge variant="primary">{{detailsImpots.trancheMarginaleImposition.taux | pourcentage}}</b-badge>.
      </p>
      <div class="bareme">
        <div class="legende">
          <span class="montant">Montant<br>des revenus</span>
          <span class="taux">% d'imposition</span>
        </div>
        <ol>
          <li v-for="(trancheResult, index) in impotsParTranche" :key="index">
            <span class="max" v-if="trancheResult.tranche.max !== Infinity">{{trancheResult.tranche.max}}</span>
            <span class="taux"><span v-if="trancheResult.tranche.taux === detailsImpots.trancheMarginaleImposition.taux" class="triangle-taux"></span>{{Math.round(trancheResult.tranche.taux * 100)}}</span>
            <span class="impots">{{trancheResult.montantImposable | monaie}} x {{trancheResult.tranche.taux | pourcentage}} = {{Math.round(trancheResult.montantImpot) | monaie}}</span>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
const formatteurMonaie = new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'});
const formatteurPourcentage = new Intl.NumberFormat('fr-FR', {style: 'percent'});

export default {
  props: {
    detailsImpots: {
      required: true
    }
  },
  filters: {
    monaie: function(montant) {
      return formatteurMonaie.format(montant);
    },
    pourcentage: function(taux) {
      return formatteurPourcentage.format(taux);
    }
  },
  computed: {
    impotsParTranche() {
      return this.detailsImpots ? this.detailsImpots.impotsParTranche.slice().reverse() : [];
    }     
  },
}
</script>

<style>
.bareme {
  position: relative;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  overflow: hidden;
  border-radius: 5px;
}

.legende span {
  position: absolute;
  top: 10px;
  font-size: 14px;
  color: white;
  z-index: 9;
  text-transform: uppercase;
  display: block;
  font-weight: 500;
}

.legende .montant {
  left: 10px;
}

.legende .taux {
  right: 10px;
}

.bareme ol {
  padding: 0;
  margin: 0;
}

.bareme li {
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: relative;
}

.bareme li::after {
  content: '';
  z-index: 9;
  background: white;
  height: 2px;
  width: 100%;
  margin-left: 115px;
  position: absolute;
  display: block;
  bottom: -1px;
}

.bareme li:last-child::after {
  display: none;
}

.bareme li span.impots {
  position: absolute;
  bottom: 20px;
  left: 10px;
  height: auto;
  display: block;
  color: white;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  padding: 2px 5px;
  font-size: 14px;
}

.bareme li span.max {
  position: absolute;
  top: -17px;
  left: 10px;
  height: auto;
  display: block;
  color: white;
  background: none;
  font-size: 22px;
}

.bareme li span.max::after {
  content: '€';
}

.bareme li span.taux .triangle-taux{
  position: absolute;
  left: -35px;
  top: 16px;
  display : inline-block;
  height : 0;
  width : 0;
  background: transparent;
  border-top : 16px solid transparent;
  border-bottom : 16px solid transparent;
  border-left : 32px solid white;
  line-height: 0;
  overflow: none;
}

.bareme li span.taux {
  position: relative;
  height: auto;
  display: block;
  color: white;
  font-size: 46px;
  background: none;
  position: absolute;
  bottom: 0px;
  right: 10px;
  font-weight: 700;
}

.bareme li span.taux::after {
  content: '%';
}

.bareme ol :nth-child(1) {
  background: #202c4f;
  height: 115px;
}
.bareme ol :nth-child(2) {
  background: #5b366a;
  height: 190px;
}
.bareme ol :nth-child(3) {
  background: #c25086;
  height: 129px;
}
.bareme ol :nth-child(4) {
  background: #d65faa;
  height: 80px;
}
.bareme ol :nth-child(5) {
  background: #e1aed8;
  height: 70px;
}
</style>
