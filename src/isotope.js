const DATA = Symbol('data');

function setValue(value, mutator) {
    return (typeof mutator === 'function') ? mutator(value) : value;
}

export function isData(obj) {
    return typeof obj === 'function' && DATA in obj;
}

export function data(value = null, mutator = null) {
    let oldValue = setValue(value, mutator);
    const subscribers = [];
    const callback = (...args) => {
        if (args.length === 1) {
            let newValue = setValue(args[0], mutator);
            subscribers.forEach((fn) => fn(newValue, oldValue));
            oldValue = newValue;
        }
        return oldValue;
    };
    callback[DATA] = true;
    callback.subscribe = (fn) => subscribers.push(fn);
    return callback;
}
