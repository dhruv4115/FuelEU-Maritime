import { PrismaClient } from '@prisma/client';
import { RouteRepository } from '../../adapters/outbound/postgres/route.repository';
import { ShipComplianceRepository } from '../../adapters/outbound/postgres/shipCompliance.repository';
import { ComplianceService } from '../../core/application/compliance.service';

export const prisma = new PrismaClient();

const routeRepository = new RouteRepository(prisma);
const complianceRepository = new ShipComplianceRepository(prisma);

export const complianceService = new ComplianceService(
  routeRepository,
  complianceRepository
);
