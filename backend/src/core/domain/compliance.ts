export interface ShipCompliance {
  id?: number;
  shipId: number;
  year: number;
  cbGco2eq: number;
}

export interface BankEntry {
  id?: number;
  shipId: number;
  year: number;
  amountGco2eq: number;
  applied: number;
}

export interface Route {
  id?: number;
  routeId: string;
  year: number;
  ghgIntensity: number;
  isBaseline: boolean;
  fuelConsumption: number;
}