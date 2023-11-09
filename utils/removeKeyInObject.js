
/**
 * 
 * @param {string} key - key yang akan dihapus
 * @param {object} object - object yagn akan kita hapus key nya
 * @returns 
 */
module.exports = function (key, object) {
    if (typeof key === Array) {
        for (const k in key) {
           delete object[k]
        }
    }
    delete object[key];

    return object;
};
