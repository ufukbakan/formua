const { useEffect, useState } = require("react");
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
        const [validators, setValidators] = useState(initValidators())

        function initValidators() {
            return Object.entries(params?.validations || {}).map(keyValue => {
                const name = keyValue[0];
                const message = keyValue[1].errorMessage;
                const actualCallback = keyValue[1].validator;
                return {
                    "field": name,
                    callback() {
                        if (!actualCallback(getValue(inputs.find(i => i.name == name), false))) {
                            setErrors({ ...errors, [name]: message })
                        } else if (errors[name]) {
                            const tempError = { ...errors };
                            delete tempError[name];
                            setErrors(tempError);
                        }
                    }
                };
            })
        }

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

        useEffect(()=> {
            setValidators(initValidators());
        }, [Symbol.for(JSON.stringify(params.validations))])

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
                const validator = validators.find(v => v.field == input.name)?.callback;
                if (validator) {
                    input.addEventListener("blur", validator);
                }
            });
        }

        const removeEventListeners = () => {
            inputs?.forEach(input => {
                input.removeEventListener("input", updateSingleData);
                input.removeEventListener("change", updateSingleData);
                const validator = validators.find(v => v.field == input.name)?.callback;
                if (validator) {
                    input.removeEventListener("blur", validator);
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

        const validateAll = () => {
            if (params?.validations) {
                return Object.entries(params?.validations || {}).map(keyValue => {
                    const name = keyValue[0];
                    const actualCallback = keyValue[1].validator;
                    return actualCallback(getValue(inputs.find(i => i.name == name), false));
                }).reduce((prev, next) => prev && next);
            } else {
                return true;
            }
        }

        return {
            "formData": new FormData(formData),
            "pureData": new FormData(pureData),
            "formErrors": errors,
            "isFormValid": validateAll()
        };
    }
    else {
        return {
            "formData": new FormData({}),
            "pureData": new FormData({}),
            "formErrors": {},
            "isFormValid": false
        }
    }
}

module.exports = {
    Formua,
    FormData
}