import Tranche from "./Tranche";

export default interface ITrancheResults {
  tranche: Tranche;
  montantImpot : number;
  montantImposable: number;
}