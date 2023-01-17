// validation helpers:
type booleanReturner = (o: any) => boolean;
export function chainAnd(...callbacks: booleanReturner[]): booleanReturner;
export function chainOr(...callbacks: booleanReturner[]): booleanReturner;
export function isEmail(val: string): boolean;
export function hasNoSpaces(val: string): boolean;
export function hasNoSpecialCharacters(val: string): boolean;
export function minLength(n: number): booleanReturner;
export function maxLength(n: number): booleanReturner;
export function sameAs(val: any): booleanReturner;
export function equals(val: any): booleanReturner;
export function required(val: any): boolean;

// transform helpers:
type valueReturner = (o: any) => any;
export function chainTransform(...transformations: valueReturner[]): valueReturner;
export function toUpper(val: any): any;
export function toLocaleUpper(val: any): any;
export function toLower(val: any): any;
export function toLocaleLower(val: any): any;
export function trim(val: any): any;
export function trimEnd(val: any): any;
export function trimStart(val: any): any;
export function prefix(val: any): valueReturner;
export function postfix(val: any): valueReturner;