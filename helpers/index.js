function chainAnd(...callbacks){
    return (val) => callbacks.map(callback => callback(val)).reduce((prev, next) => prev && next);
}

function chainOr(...args){
    return (val) => args.map(callback => callback(val)).reduce((prev, next) => prev || next);
}

function chainTransform(...args){
    return (val) => args.reduce((prev, next) => next(prev), val);
}

function isEmail(val){
    return typeof val === "string" ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) : false;
}

function hasNoSpaces(val){
    return typeof val === "string" ? !(/\s/.test(val)) : false;
}

function hasNoSpecialCharacters(val){
    return typeof val === "string" ? !/[^A-Za-z0-9]/.test(val) : false;
}

function minLength(n){
    return (val) => val?.length >= n;
}

function maxLength(n){
    return (val) => val?.length <= n;
}

function sameAs(val){
    return (obj) => val === obj;
}

function equals(val){
    return (obj) => val == obj;
}

function required(val){
    if(typeof val !== "boolean")
        return !!val;
    else
        return true;
}

/**
 * @param {string} str 
 * @returns string
 */
function toUpper(str){
    return str.toUpperCase(); 
}

/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function toLocaleUpper(str){
    return str.toLocaleUpperCase();
}

/**
 * @param {string} str 
 * @returns {string}
 */
function toLower(str){
    return str.toLowerCase(); 
}

/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function toLocaleLower(str){
    return str.toLocaleLowerCase();
}

/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function trim(str){
    return str.trim()
}


/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function trimEnd(str){
    return str.trimEnd();
}

/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function trimStart(str){
    return str.trimStart();
}

/**
 * 
 * @param {string} str 
 */
function postfix(str){
    return (val) => val.concat(str) 
}

/**
 * 
 * @param {string} str 
 */
function prefix(str){
    return (val) => str.concat(val) 
}



module.exports = {
    chainAnd,
    chainOr,
    isEmail,
    hasNoSpaces,
    hasNoSpecialCharacters,
    minLength,
    maxLength,
    sameAs,
    equals,
    required,
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