function chainAnd(...callbacks){
    return (val) => callbacks.map(callback => callback(val)).reduce((prev, next) => prev && next);
}

function chainOr(...args){
    return (val) => args.map(callback => callback(val)).reduce((prev, next) => prev || next);
}

function isEmail(val){
    return typeof val === "string" ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) : false;
}

function hasNoSpaces(val){
    return typeof val === "string" ? !(/\s/.test(val)) : false;
}

function hasNoSpecialCharacters(val){
    return typeof val === "string" ? /[A-Za-z0-9]/.test(val) : false;
}

function minLength(n){
    return (val) => val?.length >= n;
}

function maxLength(n){
    return (val) => val?.length <= n;
}

function nonEmpty(val){
    return !!val;
}


module.exports = {
    chainAnd,
    chainOr,
    isEmail,
    hasNoSpaces,
    hasNoSpecialCharacters,
    minLength,
    maxLength,
    nonEmpty
}