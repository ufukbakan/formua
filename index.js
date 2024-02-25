const { useEffect, useState, useMemo, useCallback } = require("react");
const hash = require('object-hash');

class FormData {
    constructor(data) {
        this.data = data || {};
    }
    getAll() {
        return this.data;
    }
    get(key) {
        return this.data[key];
    }
    set(key, value) {
        return new FormData({ ...this.data, [key]: value });
    }
    has(key) {
        return this.data.hasOwnProperty(key);
    }
    drop(...keys) {
        return Object.fromEntries(Object.entries(this.data).filter(keyvalue => !keys.includes(keyvalue[0])));
    }
    select(...keys) {
        return Object.fromEntries(Object.entries(this.data).filter(keyvalue => keys.includes(keyvalue[0])));
    }
    keys() {
        return Object.keys(this.data);
    }
    values() {
        return Object.values(this.data);
    }
    entries() {
        return Object.entries(this.data);
    }
    toString() {
        return JSON.stringify(this.data);
    }
    toJSON() {
        return this.data;
    }
    hashcode() {
        return hash(Object.values(this.data));
    }
}

/**
 * @typedef {Object<string, string>} ErrorMap
 */

/**
 * @callback Validator 
 * @param {any} obj
 * @returns {boolean}
 */

/**
 * 
 * @typedef {Object} Validation 
 * @property {string} errorMessage Error Message
 * @property {Validator} validator Validator function: receives the value of input and returns boolean
 */

/**
 * @callback Transformer
 * @param {any} obj
 * @returns {any}
 */

/**
 * @typedef {Object} FormuaParams
 * @property {HTMLFormElement | HTMLElement | Element | null} [form]
 * @property {Object<string, Validation>} [validations]
 * @property {Object<string, Transformer>} [transforms]
 * @property {boolean} [legacyListeners]
 */

/**
 * @typedef {Object} FormuaResult
 * @property {FormData} formData
 * @property {FormData} pureData
 * @property {ErrorMap} formErrors
 * @property {boolean} isFormValid
 */

/**
 * @param {FormuaParams} [params]
 * @returns {FormuaResult}
 */
function Formua(params) {
    if (typeof window !== "undefined") {
        const form = params?.form || document.querySelector("form");
        const [formData, setFormData] = useState({});
        const [pureData, setPureData] = useState({});
        const [inputs, setInputs] = useState([]);
        const [errors, setErrors] = useState({});
        const [validatedErrors, setValidatedErrors] = useState({});
        const [blurInputEventHandlersMap, setBlurInputEventHandlersMap] = useState({});

        const dependentValidators = Object.entries(params?.validations || {})
            .filter(keyValue => keyValue[1].validator.length === 2)
            .map(keyValue => {
                const name = keyValue[0];
                const message = keyValue[1].errorMessage;
                /**@type {Validator} */const actualCallback = keyValue[1].validator.bind(this, pureData);
                return {
                    "field": name,
                    callback() {
                        const result = actualCallback(getValue(inputs.find(i => i.name == name), false));
                        const fieldErrors = result ? { [name]: undefined } : { [name]: message };
                        setErrors(previous => ({ ...previous, ...fieldErrors }))
                        return { result, errors: fieldErrors };
                    }
                };
            });

        const independentValidators = Object.entries(params?.validations || {})
            .filter(keyValue => keyValue[1].validator.length < 2)
            .map(keyValue => {
                const name = keyValue[0];
                const message = keyValue[1].errorMessage;
                const actualCallback = keyValue[1].validator;
                return {
                    "field": name,
                    callback() {
                        const result = actualCallback(getValue(inputs.find(i => i.name == name), false));
                        const fieldErrors = result ? { [name]: undefined } : { [name]: message };
                        setErrors(previous => ({ ...previous, ...fieldErrors }))
                        return { result, errors: fieldErrors };
                    }
                };
            })

        const observeCallback = (mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                    updateInputs();
                    break;
                }
            }
        }
        const observer = new MutationObserver(observeCallback);

        useEffect(() => {
            updateInputs();
        }, [])

        useEffect(() => {
            if (form) {
                updateInputs();
                if (!params?.legacyListeners && observer) {
                    observer.observe(form, { childList: true, subtree: true })
                } else {
                    document.body.addEventListener("DOMNodeInserted", updateInputs);
                    document.body.addEventListener("DOMNodeRemoved", updateInputs);
                }
            }
            return (() => {
                if (!params?.legacyListeners && observer) {
                    observer.disconnect();
                }
                else {
                    document.body.removeEventListener("DOMNodeInserted", updateInputs);
                    document.body.removeEventListener("DOMNodeRemoved", updateInputs);
                }
            });
        }, [form])

        useEffect(() => {
            addEventListeners();
            updateFormData();
            return () => {
                removeEventListeners();
            }
        }, [inputs]);

        const updateInputs = () => {
            let inputElements = Array.from(form?.querySelectorAll("input,textarea") || []);
            inputElements = inputElements.filter(e => {
                if (e instanceof HTMLTextAreaElement) {
                    return true;
                } else if (e instanceof HTMLInputElement) {
                    return e.type != "file" && e.type != "submit" && e.type != "reset" && e.type != "button" && e.type != "image";
                }
            });
            setInputs(inputElements);
        }

        const updateFormData = () => {
            const newFormData = {};
            const newPureData = {};
            inputs?.forEach(input => {
                if (input instanceof HTMLInputElement) {
                    if (input.type != "radio") {
                        newFormData[input.name] = getValue(input);
                        newPureData[input.name] = getValue(input, false);
                    } else if (!newFormData[input.name] && input.type == "radio") {
                        newFormData[input.name] = getValue(inputs.find(i => i instanceof HTMLInputElement && i.type == "radio" && i.name == input.name && i.checked));
                        newPureData[input.name] = getValue(inputs.find(i => i instanceof HTMLInputElement && i.type == "radio" && i.name == input.name && i.checked), false);
                    }
                } else if (input instanceof HTMLTextAreaElement) {
                    newFormData[input.name] = getValue(input);
                    newPureData[input.name] = getValue(input, false);
                }
            });
            setFormData(newFormData);
            setPureData(newPureData);
        }

        const updateSingleData = (e) => {
            const inputElement = e.target;
            setFormData((prevData) => ({ ...prevData, [inputElement.name]: getValue(inputElement) }));
            setPureData((prevData) => ({ ...prevData, [inputElement.name]: getValue(inputElement, false) }));
        }

        const addEventListeners = () => {
            inputs?.forEach(input => {
                input.addEventListener("input", updateSingleData);
                input.addEventListener("change", updateSingleData);
                const eventHandlers = [];
                const independentValidator = independentValidators.find(v => v.field == input.name)?.callback;
                if (independentValidator) {
                    eventHandlers.push(() => {
                        const { errors } = independentValidator();
                        setValidatedErrors(previous => ({ ...previous, ...errors }));
                    })
                }
                const dependentValidator = dependentValidators.find(v => v.field == input.name)?.callback;
                if (dependentValidator) {
                    eventHandlers.push(() => {
                        const { errors } = dependentValidator();
                        setValidatedErrors(previous => ({ ...previous, ...errors }));
                    })
                }
                if (eventHandlers.length > 0) {
                    const eventHandler = (event) => eventHandlers.forEach(handler => handler(event));
                    setBlurInputEventHandlersMap(previous => ({ ...previous, [input.name]: eventHandler }))
                    input.addEventListener("blur", eventHandler);
                }
            });
        }

        const removeEventListeners = () => {
            inputs?.forEach(input => {
                input.removeEventListener("input", updateSingleData);
                input.removeEventListener("change", updateSingleData);
                const eventHandler = blurInputEventHandlersMap[input.name];
                if (eventHandler) {
                    input.removeEventListener("blur", eventHandler);
                    setBlurInputEventHandlersMap(previous => ({ ...previous, [input.name]: undefined }));
                }
            });
        }

        const getValue = (element, applyTransforms = true) => {
            if (!element) {
                return undefined;
            }
            if (element instanceof HTMLInputElement && element.type == "checkbox") {
                if (applyTransforms && params?.transforms?.[element.name]) {
                    return params.transforms[element.name](element.checked);
                } else {
                    return element.checked;
                }
            } else if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                if (applyTransforms && params?.transforms?.[element.name]) {
                    return params.transforms[element.name](element.value);
                }
                else {
                    return element.value;
                }
            }
        }

        const checkFormErrors = () => {
            const independentsResult = independentValidators?.map(validator => validator.callback()).reduce((acc, next) => {
                acc.isValid = acc.isValid && next.result;
                acc.errors = { ...acc.errors, ...next.errors };
                return acc;
            }, { isValid: true, errors: {} });
            const dependenciesResult = dependentValidators?.map(validator => validator.callback()).reduce((acc, next) => {
                acc.isValid = acc.isValid && next.result;
                acc.errors = { ...acc.errors, ...next.errors };
                return acc;
            }, { isValid: true, errors: {} });
            return { isValid: dependenciesResult.isValid && independentsResult.isValid, errors: { ...dependenciesResult.errors, ...independentsResult.errors } }
        }

        const lastValidation = useMemo(() => checkFormErrors(), [hash(pureData)]);
        const isFormValid = lastValidation.isValid;
        const validateForm = useCallback(() => {
            inputs.forEach(input => {
                const handler = blurInputEventHandlersMap[input.name];
                if (handler) {
                    handler(null);
                }
            });
            return lastValidation;
        }, [blurInputEventHandlersMap, lastValidation])

        return {
            "formData": new FormData(formData),
            "pureData": new FormData(pureData),
            "formErrors": errors,
            "isFormValid": isFormValid,
            "validateForm": validateForm,
            "validatedErrors": validatedErrors,
        };
    }
    else {
        return {
            "formData": new FormData({}),
            "pureData": new FormData({}),
            "formErrors": {},
            "isFormValid": false,
            "validateForm": () => false,
            "validatedErrors": {},
        }
    }
}

module.exports = {
    Formua,
    FormData
}