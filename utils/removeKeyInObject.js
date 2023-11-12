
/**
 * 
 * @param {string} key - key yang akan dihapus
 * @param {object} object - object yagn akan kita hapus key nya
 * @returns 
 */
module.exports = function (key, object) {
   
    delete object[key];
    console.log(object);
    return object;
};
