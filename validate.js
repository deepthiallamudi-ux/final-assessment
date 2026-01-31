const isEmpty = (value) => {
    if(value === undefined || value === null || value === "") return true;
    return false;
};

const isNumber = (value) => {
    if(value === null || value === undefined) return false;
    if (typeof value === 'number') return true;
    const num = Number(value);
    if(isNaN(num)) return false;
    return true;
};

module.exports = {isEmpty, isNumber};