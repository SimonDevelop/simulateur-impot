export default class FoyerFiscal {

  constructor(
    public enCouple: boolean = false,
    public nombreEnfantsTotal: number = 0,
    public nombreEnfantsCMI: number = 0,
  ) {}

  /**
   * Retourne le nombre de parts du foyer (adultes et enfants)
   * 
   * @returns {number} Nombre de parts totale du foyer fiscal
   */
  public getNombreParts(): number {
    return this.getNombrePartsCouple() + this.getNombrePartsEnfants();
  }

  /**
   * Retourne le nombre de part du foyer pour les adultes.
   * S'ils sont en couples (mariés ou pacsé), on compte 2 parts, sinon 1
   * 
   * @returns {number} Nombre de parts pour les adultes
   */
  private getNombrePartsCouple() {
    return this.enCouple ? 2 : 1;
  }

  /**
   * Retourne le nombre de parts par rapport au nombre d'enfants à charge dans le foyer fiscal.
   * 
   * Exemples :
   * 1 enfant : 0,5 part
   * 2 enfants : 1 part
   * 3 enfants : 2 parts (à partir de 3 enfants, chaque enfant apporte 1 part supplémentaire)
   * 4 enfants : 3 parts
   * 
   * Les enfants titulaires d'une carte CMI ouvrent le droit à une demi-part de quotient familial supplémentaire
   * 
   * @returns  {number}  Nombre de parts pour les enfants
   */
  private getNombrePartsEnfants() {
    return (
      (this.nombreEnfantsTotal > 2
        ? this.nombreEnfantsTotal - 1
        : this.nombreEnfantsTotal / 2)
      + (this.nombreEnfantsCMI / 2)     // Ajout des demi-part pour les enfants CMI
    );
  }

}
