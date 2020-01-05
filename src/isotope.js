const tracker = [];
const OBSERVABLE = Symbol('observable');

function setValue(value, mutator) {
    return (typeof mutator === 'function') ? mutator(value) : value;
}

function observable(value, fn) {
    const subscribers = [];
    const subscribe = (fn, immediate = false) => {
        if (!subscribers.includes(fn)) {
            subscribers.push(fn);
            if (immediate === true) {
                fn(value, null);
            }
            return () => {
                const index = subscribers.indexOf(fn);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
            };
        }
    };
    const emit = (fn) => {
        subscribers.slice().forEach(fn);
    };
    const callback = fn(emit, subscribe);
    callback[OBSERVABLE] = true;
    callback.subscribe = subscribe;
    return callback;
}

export function data(value = null, mutator = null) {
    value = setValue(value, mutator);
    return observable(value, (emit, subscribe) => (...args) => {
        if (args.length === 1) {
            const newValue = args[0];
            if (newValue === value && (newValue === null || typeof newValue !== 'object')) {
                return value;
            }
            const oldValue = value;
            value = setValue(newValue, mutator);
            emit((fn) => fn(value, oldValue));
            return value;
        } else {
            const fn = tracker[tracker.length - 1];
            if (fn) {
                subscribe(fn);
            }
            return value;
        }
    });
}

export function computed(fn) {
    let value = null, emit;
    const callback = () => {
        tracker.push(callback);
        let error;
        const oldValue = value;
        try {
            value = fn();
        } catch (e) {
            error = e;
        }
        tracker.pop();
        if (error) {
            throw error;
        }
        if (emit) {
            emit((fn) => fn(value, oldValue));
        }
    };
    callback();
    return observable(value, (emitter) => {
        emit = emitter;
        return () => value;
    });
}

export function isObservable(obj) {
    return typeof obj === 'function' && OBSERVABLE in obj;
}
