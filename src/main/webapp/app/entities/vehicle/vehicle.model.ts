import * as dayjs from 'dayjs';
import { IMake } from 'app/entities/make/make.model';
import { ILegalEntity } from 'app/entities/legal-entity/legal-entity.model';

export interface IVehicle {
  id?: number;
  registrationNumber?: string;
  firstRegistrationDate?: dayjs.Dayjs;
  make?: IMake | null;
  owner?: ILegalEntity | null;
}

export class Vehicle implements IVehicle {
  constructor(
    public id?: number,
    public registrationNumber?: string,
    public firstRegistrationDate?: dayjs.Dayjs,
    public make?: IMake | null,
    public owner?: ILegalEntity | null
  ) {}
}

export function getVehicleIdentifier(vehicle: IVehicle): number | undefined {
  return vehicle.id;
}
