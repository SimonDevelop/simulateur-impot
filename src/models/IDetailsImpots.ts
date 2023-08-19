import ITrancheResults from './ITrancheResults';
import ITranche from './ITranche';

export default interface IDetailsImpots {
    ratioDesRevenus: number;
    nombreParts: number;
    revenusImposables: number;
    impotsTotal: number;
    revenusApresImpots: number;
    quotientFamilial: number;
    trancheMarginaleImposition: ITranche;
    impotsParTranche: Array<ITrancheResults>;
};