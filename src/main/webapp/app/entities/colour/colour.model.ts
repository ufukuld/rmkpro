import { PaintType } from 'app/entities/enumerations/paint-type.model';

export interface IColour {
  id?: number;
  label?: string;
  paintType?: PaintType;
}

export class Colour implements IColour {
  constructor(public id?: number, public label?: string, public paintType?: PaintType) {}
}

export function getColourIdentifier(colour: IColour): number | undefined {
  return colour.id;
}
