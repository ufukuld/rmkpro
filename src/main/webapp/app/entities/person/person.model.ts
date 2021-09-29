export interface IPerson {
  id?: number;
  title?: string;
  firstNames?: string;
  surname?: string;
}

export class Person implements IPerson {
  constructor(public id?: number, public title?: string, public firstNames?: string, public surname?: string) {}
}

export function getPersonIdentifier(person: IPerson): number | undefined {
  return person.id;
}
