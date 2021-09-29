import { IVehicle } from 'app/entities/vehicle/vehicle.model';

export interface ICosts {
  id?: number;
  detail?: string;
  unitPrice?: number | null;
  vatAmount?: number | null;
  vatPercentage?: number | null;
  netAmount?: number | null;
  vehicle?: IVehicle | null;
}

export class Costs implements ICosts {
  constructor(
    public id?: number,
    public detail?: string,
    public unitPrice?: number | null,
    public vatAmount?: number | null,
    public vatPercentage?: number | null,
    public netAmount?: number | null,
    public vehicle?: IVehicle | null
  ) {}
}

export function getCostsIdentifier(costs: ICosts): number | undefined {
  return costs.id;
}
