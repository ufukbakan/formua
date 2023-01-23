// validation helpers:
type booleanReturner = (o: any) => boolean;
export function chainAnd(...callbacks: booleanReturner[]): booleanReturner;
export function chainOr(...callbacks: booleanReturner[]): booleanReturner;
export function isEmail(val: any): boolean;
export function isPhoneNumber(val: any): boolean;
export function isUrl(val: any): boolean;
export function isAlpha(val: any): boolean;
export function isAlphanumeric(val: any): boolean;
export function isLowercase(val: any): boolean;
export function isUppercase(val: any): boolean;
export function isInteger(val: any): boolean;
export function isFloat(val: any): boolean;
export function hasNoSpaces(val: any): boolean;
export function hasNoSpecialCharacters(val: any): boolean;
export function minLength(n: number): booleanReturner;
export function minTrimmedLength(n: number): booleanReturner;
export function maxLength(n: number): booleanReturner;
export function maxTrimmedLength(n: number): booleanReturner;
export function sameAs(val: any): booleanReturner;
export function equals(val: any): booleanReturner;
export function required(val: any): boolean;

// transform helpers:
type valueReturner = (o: any) => any;
export function chainTransform(...transformations: valueReturner[]): valueReturner;
export function toUpper(val: string): any;
export function toLocaleUpper(val: string): any;
export function toLower(val: string): any;
export function toLocaleLower(val: string): any;
export function trim(val: string): any;
export function trimEnd(val: string): any;
export function trimStart(val: string): any;
export function prefix(val: any): valueReturner;
export function postfix(val: any): valueReturner;