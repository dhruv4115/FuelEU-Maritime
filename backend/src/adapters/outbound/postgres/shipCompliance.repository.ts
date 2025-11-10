import { PrismaClient, ShipCompliance as PrismaCompliance } from '@prisma/client';
import { IShipComplianceRepository } from '../../../core/ports/repository.ports';
import { ShipCompliance } from '../../../core/domain/compliance';

export class ShipComplianceRepository implements IShipComplianceRepository {
  constructor(private prisma: PrismaClient) {}

  private toDomain(compliance: PrismaCompliance): ShipCompliance {
    return { ...compliance };
  }

  async findByShipAndYear(shipId: number, year: number): Promise<ShipCompliance | null> {
    const compliance = await this.prisma.shipCompliance.findUnique({
      where: {
        shipId_year: { shipId, year },
      },
    });
    return compliance ? this.toDomain(compliance) : null;
  }

  async save(compliance: ShipCompliance): Promise<ShipCompliance> {
    const { id, ...data } = compliance;

    const saved = await this.prisma.shipCompliance.upsert({
      where: {
        id: id || -1, // Use -1 as a non-existent ID for upsert logic if ID is new
        shipId_year: { shipId: data.shipId, year: data.year },
      },
      update: data,
      create: data,
    });
    return this.toDomain(saved);
  }
}