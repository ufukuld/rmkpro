import { IModel } from 'app/entities/model/model.model';
import { FuelType } from 'app/entities/enumerations/fuel-type.model';

export interface ITrim {
  id?: number;
  label?: string;
  doors?: number;
  seats?: number;
  engineDisplacementCc?: number;
  isAutomatic?: boolean | null;
  fuelType?: FuelType;
  model?: IModel | null;
}

export class Trim implements ITrim {
  constructor(
    public id?: number,
    public label?: string,
    public doors?: number,
    public seats?: number,
    public engineDisplacementCc?: number,
    public isAutomatic?: boolean | null,
    public fuelType?: FuelType,
    public model?: IModel | null
  ) {
    this.isAutomatic = this.isAutomatic ?? false;
  }
}

export function getTrimIdentifier(trim: ITrim): number | undefined {
  return trim.id;
}
