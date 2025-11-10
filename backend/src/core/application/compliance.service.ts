import { IRouteRepository, IShipComplianceRepository } from '../ports/repository.ports';
import { ShipCompliance } from '../domain/compliance';

const TARGET_INTENSITY_2025 = 89.3368;
const ENERGY_CONVERSION_FACTOR_MJ_PER_T = 41000;

export class ComplianceService {
  constructor(
    private routeRepo: IRouteRepository,
    private complianceRepo: IShipComplianceRepository
  ) {}

  private calculateEnergyInScope(fuelConsumption: number): number {
    return fuelConsumption * ENERGY_CONVERSION_FACTOR_MJ_PER_T;
  }

  private calculateComplianceBalance(actualIntensity: number, energyInScope: number): number {
    const targetIntensity = TARGET_INTENSITY_2025;
    return (targetIntensity - actualIntensity) * energyInScope;
  }

  public async computeAndStoreCB(shipId: number, year: number): Promise<ShipCompliance> {
    const routeData = await this.routeRepo.findByShipAndYear(shipId, year);

    if (!routeData) {
      throw new Error(`No route data found for ship ${shipId} in year ${year}`);
    }

    if (year !== 2025) {
      throw new Error('Only year 2025 calculations are currently supported');
    }

    const energy = this.calculateEnergyInScope(routeData.fuelConsumption);
    const cb = this.calculateComplianceBalance(routeData.ghgIntensity, energy);

    const existingRecord = await this.complianceRepo.findByShipAndYear(shipId, year);
    
    const complianceData: ShipCompliance = {
      ...existingRecord,
      shipId: shipId,
      year: year,
      cbGco2eq: cb,
    };

    return this.complianceRepo.save(complianceData);
  }
}