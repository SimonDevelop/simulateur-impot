import ITranche from './ITranche';

export default class Tranche {

  constructor(
    private tranche: ITranche
  ) { }

  public get min() {
    return (
      this.tranche.precedente && this.tranche.precedente.seuil
      ? this.tranche.precedente.seuil - 1
      : -1
    ) + 1;
  }

  public set index(index: number) {
    this.tranche.index = index;
  }

  public set precedente(tranche: Tranche | null) {
    this.tranche.precedente = tranche;
  }

  public get max() {
    return this.tranche.seuil || Infinity;
  }

  public get seuil() {
    return this.tranche.seuil;
  }

  public get taux() {
    return this.tranche.taux;
  }

}