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

function maxLength(n) {
    return (val) => val?.length <= n;
}

function sameAs(val) {
    return (obj) => val === obj;
}

function equals(val) {
    return (obj) => val == obj;
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
    } else if(typeof val === "number") {
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
    maxLength,
    sameAs,
    equals,
    isEmail,
    isPhoneNumber,
    isUrl,
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