import { IVehicle } from 'app/entities/vehicle/vehicle.model';

export interface IVehicleImages {
  id?: number;
  contentType?: string;
  imageContentType?: string;
  image?: string;
  vehicle?: IVehicle | null;
}

export class VehicleImages implements IVehicleImages {
  constructor(
    public id?: number,
    public contentType?: string,
    public imageContentType?: string,
    public image?: string,
    public vehicle?: IVehicle | null
  ) {}
}

export function getVehicleImagesIdentifier(vehicleImages: IVehicleImages): number | undefined {
  return vehicleImages.id;
}
