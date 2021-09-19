export interface ILegalEntityType {
  id?: number;
  label?: string;
}

export class LegalEntityType implements ILegalEntityType {
  constructor(public id?: number, public label?: string) {}
}

export function getLegalEntityTypeIdentifier(legalEntityType: ILegalEntityType): number | undefined {
  return legalEntityType.id;
}
