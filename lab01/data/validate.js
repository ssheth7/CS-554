module.exports = {
    isValidString(string) {
        if (!string || typeof(string) !== 'string' || !string.trim()) {
            return false;
        }
        return true;
    },
    isValidQueryNumber(number) {
        if (number === undefined) {
            return true;
        }
        if (typeof(number) !== 'number' || !Number.isInteger(number) || number < 0) {
            return false;
        }
        return true;
    },
    isValidNumber(number) {
        if (!number || typeof(number) !== 'number' ||
            !Number.isInteger(number) || number < 0) {
            return false;
        }
        return true;
    },

};