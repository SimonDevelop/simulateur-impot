import Tranche from './Tranche';

export default interface ITranche {
  index?: number;
  seuil?: number;
  precedente?: Tranche | null;
  taux?: number;
}