import * as dayjs from 'dayjs';
import { IVehicleImages } from 'app/entities/vehicle-images/vehicle-images.model';
import { ICosts } from 'app/entities/costs/costs.model';
import { ITrim } from 'app/entities/trim/trim.model';
import { ILegalEntity } from 'app/entities/legal-entity/legal-entity.model';
import { IColour } from 'app/entities/colour/colour.model';
import { VehicleStatus } from 'app/entities/enumerations/vehicle-status.model';

export interface IVehicle {
  id?: number;
  registrationNumber?: string;
  firstRegistrationDate?: dayjs.Dayjs;
  status?: VehicleStatus | null;
  mileage?: number;
  reservePrice?: number | null;
  proposedSalePrice?: number | null;
  netBookValue?: number | null;
  images?: IVehicleImages[] | null;
  costs?: ICosts[] | null;
  trim?: ITrim | null;
  owner?: ILegalEntity | null;
  colour?: IColour | null;
}

export class Vehicle implements IVehicle {
  constructor(
    public id?: number,
    public registrationNumber?: string,
    public firstRegistrationDate?: dayjs.Dayjs,
    public status?: VehicleStatus | null,
    public mileage?: number,
    public reservePrice?: number | null,
    public proposedSalePrice?: number | null,
    public netBookValue?: number | null,
    public images?: IVehicleImages[] | null,
    public costs?: ICosts[] | null,
    public trim?: ITrim | null,
    public owner?: ILegalEntity | null,
    public colour?: IColour | null
  ) {}
}

export function getVehicleIdentifier(vehicle: IVehicle): number | undefined {
  return vehicle.id;
}
