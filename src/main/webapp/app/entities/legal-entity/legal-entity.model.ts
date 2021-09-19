import { ILegalEntityType } from 'app/entities/legal-entity-type/legal-entity-type.model';

export interface ILegalEntity {
  id?: number;
  name?: string;
  type?: ILegalEntityType | null;
}

export class LegalEntity implements ILegalEntity {
  constructor(public id?: number, public name?: string, public type?: ILegalEntityType | null) {}
}

export function getLegalEntityIdentifier(legalEntity: ILegalEntity): number | undefined {
  return legalEntity.id;
}
