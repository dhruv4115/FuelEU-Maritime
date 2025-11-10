import { PrismaClient, Route as PrismaRoute } from '@prisma/client';
import { IRouteRepository } from '../../../core/ports/repository.ports';
import { Route } from '../../../core/domain/compliance';

export class RouteRepository implements IRouteRepository {
  constructor(private prisma: PrismaClient) {}

  private toDomain(route: PrismaRoute): Route {
    return {
      id: route.id,
      routeId: route.routeId,
      year: route.year,
      ghgIntensity: route.ghgIntensity,
      isBaseline: route.isBaseline,
      fuelConsumption: route.fuelConsumption,
    };
  }

  async findAll(): Promise<Route[]> {
    const routes = await this.prisma.route.findMany();
    return routes.map(this.toDomain);
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const route = await this.prisma.route.findUnique({
      where: { routeId },
    });
    return route ? this.toDomain(route) : null;
  }

  async findBaseline(year: number): Promise<Route | null> {
    const route = await this.prisma.route.findFirst({
      where: { year, isBaseline: true },
    });
    return route ? this.toDomain(route) : null;
  }

  async setBaseline(id: number): Promise<Route> {
    const routeToSet = await this.prisma.route.findUnique({ where: { id } });
    if (!routeToSet) {
      throw new Error('Route not found');
    }

    const [, newBaseline] = await this.prisma.$transaction([
      this.prisma.route.updateMany({
        where: { year: routeToSet.year, isBaseline: true },
        data: { isBaseline: false },
      }),
      this.prisma.route.update({
        where: { id },
        data: { isBaseline: true },
      }),
    ]);

    return this.toDomain(newBaseline);
  }

  async findByShipAndYear(shipId: number, year: number): Promise<Route | null> {
    const route = await this.prisma.route.findFirst({
      where: {
        year: year,
        routeId: `${shipId}-${year}`,
      },
    });
    return route ? this.toDomain(route) : null;
  }
}