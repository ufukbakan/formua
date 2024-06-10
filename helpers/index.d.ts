type IndependentValidator<T> = (value: T) => boolean;
type DependentValidator<T> = (fields: Record<string, string | boolean>, value: T) => boolean;

// validation helpers:
export function chainAnd<T>(...callbacks: IndependentValidator<T>[]): IndependentValidator<T>;
export function chainOr<T>(...callbacks: IndependentValidator<T>[]): IndependentValidator<T>;
export function isEmail(val: any): boolean;
export function isPhoneNumber(val: any): boolean;
export function isUrl(val: any): boolean;
export function isIpv4(val: any): boolean;
export function isIpv6(val: any): boolean;
export function isDateStr(val: any): boolean;
export function isTimeStr(val: any): boolean;
export function isDateTimeStr(val: any): boolean;
export function isAlpha(val: any): boolean;
export function isAlphaNumeric(val: any): boolean;
export function isLowerCase(val: any): boolean;
export function isUpperCase(val: any): boolean;
export function isInteger(val: any): boolean;
export function isFloat(val: any): boolean;
export function hasNoSpaces(val: string): boolean;
export function hasNoSpecialCharacters(val: string): boolean;
export function minLength(n: number): IndependentValidator<string>;
export function minTrimmedLength(n: number): IndependentValidator<string>;
export function maxLength(n: number): IndependentValidator<string>;
export function maxTrimmedLength(n: number): IndependentValidator<string>;
export function sameAs<T>(val: any): IndependentValidator<T>;
export function sameAsField<T>(fieldName: string): DependentValidator<T>;
export function equals<T>(val: any): IndependentValidator<T>;
export function equalsToField<T>(fieldName: string): DependentValidator<T>;
export function required<T>(val: any): boolean;

// transform helpers:
type valueReturner = (o: any) => any;
export function chainTransform(...transformations: valueReturner[]): valueReturner;
export function toUpper(val: string): string;
export function toLocaleUpper(val: string): string;
export function toLower(val: string): string;
export function toLocaleLower(val: string): string;
export function trim(val: string): string;
export function trimEnd(val: string): string;
export function trimStart(val: string): string;
export function prefix(val: any): valueReturner;
export function postfix(val: any): valueReturner;
