import { IRouteRepository } from '../ports/repository.ports';
import { Route } from '../domain/compliance';

export interface RouteComparison extends Route {
  percentDiff: number | null;
  compliant: boolean;
}

const TARGET_INTENSITY_2025 = 89.3368;

export class RouteService {
  constructor(private routeRepo: IRouteRepository) {}

  public async getAllRoutes(): Promise<Route[]> {
    return this.routeRepo.findAll();
  }

  public async setBaseline(id: number): Promise<Route> {
    return this.routeRepo.setBaseline(id);
  }

  public async getComparison(year: number): Promise<{ baseline: Route; comparisons: RouteComparison[] }> {
    const baseline = await this.routeRepo.findBaseline(year);
    if (!baseline) {
      throw new Error(`No baseline route found for year ${year}`);
    }

    const allRoutes = await this.routeRepo.findAll();
    
    const comparisonRoutes = allRoutes
      .filter(route => route.year === year && route.id !== baseline.id);

    const comparisons: RouteComparison[] = comparisonRoutes.map(route => {
      let percentDiff: number | null = null;

      if (baseline.ghgIntensity > 0) {
        percentDiff = ((route.ghgIntensity - baseline.ghgIntensity) / baseline.ghgIntensity) * 100;
      }

      const compliant = route.ghgIntensity <= TARGET_INTENSITY_2025;

      return {
        ...route,
        percentDiff,
        compliant,
      };
    });

    return { baseline, comparisons };
  }
}