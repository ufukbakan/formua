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

type Formdata = {
    [key: string]: any
}

type StringMap = {
    [key:string]: string
}

type FormuaResult = {
    formData: Formdata,
    formErrors: StringMap,
    isFormValid: boolean
}

export default function Formua(params?: FormuaParams): FormuaResult                                                                                                                                                                                                                             ;