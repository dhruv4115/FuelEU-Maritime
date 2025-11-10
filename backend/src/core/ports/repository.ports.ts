import { Route, ShipCompliance, BankEntry } from '../domain/compliance';

export interface IRouteRepository {
  findAll(): Promise<Route[]>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findBaseline(year: number): Promise<Route | null>;
  setBaseline(id: number): Promise<Route>;
  findByShipAndYear(shipId: number, year: number): Promise<Route | null>;
}

export interface IShipComplianceRepository {
  findByShipAndYear(shipId: number, year: number): Promise<ShipCompliance | null>;
  save(compliance: ShipCompliance): Promise<ShipCompliance>;
}

export interface IBankEntryRepository {
  findByShip(shipId: number, year?: number): Promise<BankEntry[]>;
  save(entry: BankEntry): Promise<BankEntry>;
  update(id: number, entry: Partial<BankEntry>): Promise<BankEntry>;
  findAvailableByShip(shipId: number): Promise<BankEntry[]>;
}