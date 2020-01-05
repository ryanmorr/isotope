const DATA = Symbol('data');

function setValue(value, mutator) {
    return (typeof mutator === 'function') ? mutator(value) : value;
}

export function isData(obj) {
    return typeof obj === 'function' && DATA in obj;
}

export function data(value = null, mutator = null) {
    value = setValue(value, mutator);
    const listeners = [];
    const callback = (...args) => {
        if (args.length === 1) {
            value = setValue(args[0], mutator);
            listeners.forEach((fn) => fn(value));
        }
        return value;
    };
    callback[DATA] = true;
    callback.subscribe = (fn) => listeners.push(fn);
    return callback;
}
