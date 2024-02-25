export type Validation<T> = {
    errorMessage: string,
    validator: FormuaValidator<T>
}

export type FormuaValidator<T> = IndependentValidator<T> | DependentValidator<T>;
export type IndependentValidator<T> = (value: T) => boolean;
export type DependentValidator<T> = (fields: Record<string, string | boolean>, value: T) => boolean

type TransformationMap = {
    [key: string]: <T, R>(obj: T) => R
}

type ValidationsMap = {
    [key: string]: Validation<any>
}

export type FormuaParams = {
    form?: HTMLFormElement | HTMLElement | Element | null,
    validations?: ValidationsMap,
    transforms?: TransformationMap
    /**
     * use legacy listeners
     * @default false
     */
    legacyListeners?: boolean
}

export class FormData {
    constructor(data?: Record<string, any>);
    data: Record<string, any>;
    get(key): any;
    getAll(): Record<string, any>;
    has(key): boolean;
    set(key, value): void;
    select(...keys: string[]): Record<string, any>;
    drop(...keys: string[]): Record<string, any>;
    keys(): string[];
    values(): any[];
    entries(): Record<string, any>;
    toString(): string;
    toJSON(): Record<string, any>;
    hashcode(): string;
}

type FormuaResult = {
    formData: FormData,
    pureData: FormData,
    formErrors: Record<string, string>,
    isFormValid: boolean,
    validateForm: () => { isValid: boolean, errors: Record<string, string> },
    validatedErrors: Record<string, string>,
}

export function Formua(params?: FormuaParams): FormuaResult;