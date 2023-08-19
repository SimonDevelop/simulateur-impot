import Bareme from './Bareme';
import FoyerFiscal from './FoyerFiscal';
import ITrancheResults from './ITrancheResults';
import ITranche from './ITranche';
import IDetailsImpots from './IDetailsImpots';

export default class SimulationImpots {

  constructor(
    public bareme: Bareme,
    public foyerFiscal: FoyerFiscal,
  ) {}

  public chercherRevenusImposables(revenusApresImpotsAttendus: number) {

    let revenusApresImpots: number = 0;
    let revenusImposables = revenusApresImpotsAttendus;
    let detailsImpots: IDetailsImpots | null = null;
    let maxIterationsAllowed: number = 30;
    let nombreIterations: number = 0;
    const startTime: number = +new Date();

    while(
      revenusApresImpots !== revenusApresImpotsAttendus &&
      nombreIterations < maxIterationsAllowed
    ) {
      detailsImpots = this.calculerImpots(revenusImposables);
      revenusApresImpots = detailsImpots.revenusApresImpots;
      revenusImposables += (revenusApresImpotsAttendus - revenusApresImpots);
      nombreIterations++;
    }

    const tempsTotalEcoule = +new Date() - startTime;

    return {
      revenusImposables,
      detailsImpots,
      meta: {
        nombreIterations,
        tempsTotalEcoule,
      }
    }

  }

  public calculerImpots(revenusImposables: number): IDetailsImpots {

    const nombreParts = this.foyerFiscal.getNombreParts();
    const quotientFamilial: number = this.getQuotientFamilial(revenusImposables, nombreParts);
    const impotsParTranche: Array<ITrancheResults> = this.getImpotParTranche(quotientFamilial);
    const impotsTotal: number = this.getImpotTotal(impotsParTranche);
    const trancheMarginaleImposition: ITranche = this.bareme.getTrancheMarginaleImposition(quotientFamilial);
    const revenusApresImpots = revenusImposables - impotsTotal;
    const ratioDesRevenus = impotsTotal / revenusImposables;
    
    return {
      ratioDesRevenus,
      nombreParts,
      revenusImposables,
      impotsTotal,
      revenusApresImpots,
      quotientFamilial,
      trancheMarginaleImposition,
      impotsParTranche,
    };
    
  }

  private getQuotientFamilial(revenusImposables: number, nombreParts: number): number {
    return Math.round(revenusImposables / nombreParts);
  }

  private getImpotTotal(impotParTranche: Array<ITrancheResults>): number {
    const impotTotalParPart = impotParTranche.reduce(
      (total: number, trancheDetails: ITrancheResults) => (total + trancheDetails.montantImpot),
      0
    );
    const impotTotalDuFoyer = impotTotalParPart * this.foyerFiscal.getNombreParts();
    return Math.round(impotTotalDuFoyer);
  }

  private getImpotParTranche(quotientFamilial: number): Array<ITrancheResults> {
    return this.bareme.tranches.map(tranche => {
      if (quotientFamilial > tranche.max) {
        const montantImposable = tranche.max - tranche.min;
        return {
          montantImposable,
          montantImpot: montantImposable * tranche.taux,
          tranche,
        }
      } else if (quotientFamilial >= tranche.min && quotientFamilial <= tranche.max) {
        const montantImposable = quotientFamilial - tranche.min;
        return {
          montantImposable,
          montantImpot: montantImposable * tranche.taux,
          tranche,
        }
      } else {
        return {
          montantImposable: 0,
          montantImpot: 0,
          tranche,
        }
      }
    });
  }

}