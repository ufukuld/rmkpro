export interface IMake {
  id?: number;
  label?: string;
}

export class Make implements IMake {
  constructor(public id?: number, public label?: string) {}
}

export function getMakeIdentifier(make: IMake): number | undefined {
  return make.id;
}
