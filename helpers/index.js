function chainAnd(...callbacks) {
    return (val) => callbacks.map(callback => callback(val)).reduce((prev, next) => prev && next);
}

function chainOr(...args) {
    return (val) => args.map(callback => callback(val)).reduce((prev, next) => prev || next);
}

function chainTransform(...args) {
    return (val) => args.reduce((prev, next) => next(prev), val);
}

function hasNoSpaces(val) {
    return typeof val === "string" ? !(/\s/.test(val)) : false;
}

function hasNoSpecialCharacters(val) {
    return typeof val === "string" ? !/[^A-Za-z0-9]/.test(val) : false;
}

function minLength(n) {
    return (val) => val?.length >= n;
}

function minTrimmedLength(n) {
    return (val) => {
        if (typeof val === "string") {
            return val.trim().length >= n;
        } else {
            return false;
        }
    };
}

function maxLength(n) {
    return (val) => val?.length <= n;
}

function maxTrimmedLength(n) {
    return (val) => {
        if (typeof val === "string") {
            return val.trim().length <= n;
        } else {
            return false;
        };
    }
}

function sameAs(val) {
    return (obj) => val === obj;
}

function sameAsField(fieldName) {
    return (fields, obj) => fields?.[fieldName] === obj;
}

function equals(val) {
    return (obj) => val == obj;
}

function equalsToField(fieldName) {
    return (fields, obj) => fields?.[fieldName] == obj;
}

function required(val) {
    if (typeof val !== "boolean")
        return !!val;
    else
        return true;
}

/**
 * @param {string} str 
 * @returns string
 */
function toUpper(str) {
    return str.toUpperCase();
}

/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function toLocaleUpper(str) {
    return str.toLocaleUpperCase();
}

/**
 * @param {string} str 
 * @returns {string}
 */
function toLower(str) {
    return str.toLowerCase();
}

/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function toLocaleLower(str) {
    return str.toLocaleLowerCase();
}

/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function trim(str) {
    return str.trim()
}


/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function trimEnd(str) {
    return str.trimEnd();
}

/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function trimStart(str) {
    return str.trimStart();
}


function postfix(str) {
    return (val) => val + str.toString();
}

function prefix(str) {
    return (val) => str.toString() + val;
}

function isPhoneNumber(str) {
    if (typeof str === "string") {
        return str.match(/[0-9() +-]+/);
    } else {
        return false;
    }
}

function isUrl(str) {
    if (typeof str === "string") {
        return str.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i);
    } else {
        return false;
    }
}

function isIpv4(str) {
    if (typeof str === "string") {
        return str.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
    } else {
        return false;
    }
}

function isIpv6(str) {
    if (typeof str === "string") {
        return str.match(/^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i);
    } else {
        return false;
    }
}

function isDateStr(str) {
    if (typeof str === "string") {
        return str.match(/^(0[1-9]|[12][0-9]|3[01])[\/\-](0[1-9]|1[012])[\/\-]\d{4}$/);
    } else {
        return false;
    }
}

function isTimeStr(str) {
    if (typeof str === "string") {
        return str.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);
    } else {
        return false;
    }
}

function isDateTimeStr(str) {
    if (typeof str === "string") {
        return str.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    } else {
        return false;
    }
}

function isEmail(str) {
    if (typeof str === "string") {
        return str.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i);
    } else {
        return false;
    }
}

function isAlpha(str) {
    if (typeof str === "string") {
        return str.match(/^[a-zA-Z]+$/);
    } else {
        return false;
    }
}

function isAlphaNum(str) {
    if (typeof str === "string") {
        return str.match(/^[a-zA-Z0-9]+$/);
    } else {
        return false;
    }
}

function isLowerCase(str) {
    if (typeof str === "string") {
        return str.match(/^[a-z]+$/);
    } else {
        return false;
    }
}

function isUpperCase(str) {
    if (typeof str === "string") {
        return str.match(/^[A-Z]+$/);
    } else {
        return false;
    }
}

function isInteger(val) {
    if (typeof val === "string") {
        return val.match(/^[0-9]+$/);
    } else if (typeof val === "number") {
        return val % 10 === 0;
    } else {
        return false;
    }
}

function isFloat(val) {
    if (typeof val === "string") {
        return val.match(/^\d+(\.\d+)?$/);
    } else if (typeof val === "number") {
        return val % 10 !== 0;
    } else {
        return false;
    }
}

module.exports = {
    // validations :
    chainAnd,
    chainOr,
    hasNoSpaces,
    hasNoSpecialCharacters,
    minLength,
    minTrimmedLength,
    maxLength,
    maxTrimmedLength,
    sameAs,
    sameAsField,
    equals,
    equalsToField,
    isEmail,
    isPhoneNumber,
    isUrl,
    isIpv4,
    isIpv6,
    isDateStr,
    isTimeStr,
    isDateTimeStr,
    isAlpha,
    isAlphaNum,
    isLowerCase,
    isUpperCase,
    isInteger,
    isFloat,
    required,
    // transformations :
    chainTransform,
    toUpper,
    toLocaleUpper,
    toLower,
    toLocaleLower,
    trim,
    trimEnd,
    trimStart,
    prefix,
    postfix
}