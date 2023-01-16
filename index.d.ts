type Validation = {
    errorMessage: string,
    validator: (obj: any) => boolean
}

type ValidationsMap = {
    [key: string]: Validation
}

type FormuaParams = {
    form?: HTMLFormElement | HTMLElement | Element | null,
    validations?: ValidationsMap,
    legacyListeners?: boolean
}

export default function Formua(params?: FormuaParams);