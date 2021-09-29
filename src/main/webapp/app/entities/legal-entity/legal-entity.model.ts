import { IPerson } from 'app/entities/person/person.model';
import { ICompany } from 'app/entities/company/company.model';
import { LegalEntityType } from 'app/entities/enumerations/legal-entity-type.model';

export interface ILegalEntity {
  id?: number;
  postCode?: string;
  streetAddress?: string;
  email?: string;
  phone?: string | null;
  type?: LegalEntityType | null;
  person?: IPerson | null;
  company?: ICompany | null;
}

export class LegalEntity implements ILegalEntity {
  constructor(
    public id?: number,
    public postCode?: string,
    public streetAddress?: string,
    public email?: string,
    public phone?: string | null,
    public type?: LegalEntityType | null,
    public person?: IPerson | null,
    public company?: ICompany | null
  ) {}
}

export function getLegalEntityIdentifier(legalEntity: ILegalEntity): number | undefined {
  return legalEntity.id;
}
