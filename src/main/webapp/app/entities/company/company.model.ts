import { IPerson } from 'app/entities/person/person.model';

export interface ICompany {
  id?: number;
  name?: string;
  department?: string | null;
  contactPerson?: IPerson | null;
}

export class Company implements ICompany {
  constructor(public id?: number, public name?: string, public department?: string | null, public contactPerson?: IPerson | null) {}
}

export function getCompanyIdentifier(company: ICompany): number | undefined {
  return company.id;
}
