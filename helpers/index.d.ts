type booleanReturner = (o: any) => boolean;
export function chainAnd(...callbacks: booleanReturner[]): booleanReturner;
export function chainOr(...callbacks: booleanReturner[]): booleanReturner;
export function isEmail(val: string): boolean;
export function hasNoSpaces(val: string): boolean;
export function hasNoSpecialCharacters(val: string): boolean;
export function minLength(n: number): booleanReturner;
export function maxLength(n: number): booleanReturner;
export function nonEmpty(val: any): boolean;