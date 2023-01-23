type Validation = {
    errorMessage: string,
    validator: (obj: any) => boolean
}

type TransformationMap = {
    [key: string]: (obj: any) => any
}

type ValidationsMap = {
    [key: string]: Validation
}

type FormuaParams = {
    form?: HTMLFormElement | HTMLElement | Element | null,
    validations?: ValidationsMap,
    legacyListeners?: boolean,
    transforms?: TransformationMap
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
}

type FormuaResult = {
    formData: FormData,
    pureData: FormData,
    formErrors: Record<string, any>,
    isFormValid: boolean
}

export function Formua(params?: FormuaParams): FormuaResult;