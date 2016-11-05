'use strict';

const safePattern      = /^[a-z0-9_\/\-.,?:@#%^+=\[\]]*$/i;
const wrappablePattern = /^[a-z0-9_\/\-.,?:@#%^+=\[\]{}|&()<>; *']*$/i;

module.exports.escape = arg => {
    if (safePattern.test(arg))
        return arg;

    if (wrappablePattern.test(arg))
        return `"${arg}"`;

    // use strong escaping with single quotes
    const result = arg.replace(/'+/g, val => {
        // One or two can be '\'' -> ' or '\'\'' -> ''
        if (val.length < 3)
            return `'${val.replace(/'/g, "\\'")}'`;

        // More in a row, wrap in double quotes '"'''''"' -> '''''
        return `'"${val}"'`;
    });

    return `'${result}'`
};
