const fs = require('fs');

/**
 * Nullifies every property in object.
 *
 * @param {any} obj
 *
 * @returns {any} object with nullify properties
 */
function nullify(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            obj[key] = nullify(obj[key]);

            continue;
        }

        obj[key] = null;
    }

    return obj;
}

/**
 * Updates secrets model.
 *
 * @param {any} secrets JSON
 */
exports.refreshModel = async function refreshModel(secrets) {
    // saves model file
    const data = JSON.stringify(nullify({ ...secrets }), null, 4);
    fs.writeFileSync('environment/environment.schema.json', data);
};
