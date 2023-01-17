const { useEffect, useState } = require("react");

/**
 * @typedef {Object<string, any>} FormData
 */

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
        const [inputs, setInputs] = useState([]);
        const [errors, setErrors] = useState(undefined);
        
        const validators = Object.entries(params?.validations || {}).map(keyValue => {
            const name = keyValue[0];
            const message = keyValue[1].errorMessage;
            const actualCallback = keyValue[1].validator;
            return {
                "field": name,
                callback() {
                    if (!actualCallback(getValue(inputs.find(i => i.name == name)))) {
                        setErrors({ ...errors, [name]: message })
                    } else {
                        const tempError = { ...errors };
                        delete tempError[name];
                        setErrors(tempError);
                    }
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
            inputs?.forEach(input => {
                if (input instanceof HTMLInputElement) {
                    if (input.type != "radio") {
                        newFormData[input.name] = getValue(input);
                    } else if (!newFormData[input.name] && input.type == "radio") {
                        newFormData[input.name] = getValue(inputs.find(i => i instanceof HTMLInputElement && i.type == "radio" && i.name == input.name && i.checked));
                    }
                } else if (input instanceof HTMLTextAreaElement) {
                    newFormData[input.name] = getValue(input);
                }
            });
            setFormData(newFormData);
        }

        const updateSingleData = (e) => {
            const inputElement = e.target;
            setFormData((prevData) => ({ ...prevData, [inputElement.name]: getValue(inputElement) }));
        }

        const addEventListeners = () => {
            inputs?.forEach(input => {
                input.addEventListener("input", updateSingleData);
                const validator = validators.find(v => v.field == input.name)?.callback;
                if (validator) {
                    input.addEventListener("blur", validator);
                }console.log
            });
        }

        const removeEventListeners = () => {
            inputs?.forEach(input => {
                input.removeEventListener("input", updateSingleData);
                const validator = validators.find(v => v.field == input.name)?.callback;
                if (validator) {
                    input.removeEventListener("blur", validator);
                }
            });
        }

        const getValue = (element) => {
            if (!element) {
                return undefined;
            }
            if (element instanceof HTMLInputElement && element.type == "checkbox") {
                if(params?.transforms?.[element.name]){
                    return params.transforms[element.name](element.checked);
                }else{
                    return element.checked;
                }
            } else if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                if(params?.transforms?.[element.name]){
                    return params.transforms[element.name](element.value);
                }
                else{
                    return element.value;
                }
            }
        }

        const validateAll = () => {
            if(params?.validations){
                return Object.entries(params?.validations || {}).map(keyValue => {
                    const name = keyValue[0];
                    const actualCallback = keyValue[1].validator;
                    return actualCallback(getValue(inputs.find(i => i.name == name)));
                }).reduce((prev, next) => prev && next);
            }else{
                return true;
            }
        }

        return {
            "formData": formData,
            "formErrors": errors,
            "isFormValid": validateAll()
        };
    }
    else {
        return {
            "formData": {},
            "formErrors": {},
            "isFormValid": false
        }
    }
}

module.exports = Formua;