import ITranche from './ITranche';
import Tranche from './Tranche';

export default class Bareme {

  public tranches: Array<Tranche>;
  
  constructor(
    Itranches: Array<ITranche>
  ) {
    this.tranches = Itranches
      .map(Itranche => new Tranche(Itranche));

    this.tranches
      .map((tranche, index) => {
        tranche.index = index;
        tranche.precedente = index === 0 ? null : this.tranches[index-1];
      })
  }

  /**
   * Retourne la tranche du barème à laquelle correspond le revenu
   * 
   * @param {number} quotientFamilial Quotient familial à utiliser pour la recherche de la tranche
   * @returns {ITranche} Tranche du barème correspondant au quotient familial
   */
  public getTrancheMarginaleImposition(quotientFamilial: number): ITranche {
    return this.tranches.find((tranche: Tranche) => (
      quotientFamilial >= tranche.min && quotientFamilial <= tranche.max
    )) as ITranche;
  }

}