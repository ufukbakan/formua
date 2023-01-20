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

export type FormData = {
    [key: string]: any
}

type StringMap = {
    [key:string]: string
}

type FormuaResult = {
    formData: FormData,
    pureData: FormData,
    formErrors: StringMap,
    isFormValid: boolean
}

export default function Formua(params?: FormuaParams): FormuaResult;