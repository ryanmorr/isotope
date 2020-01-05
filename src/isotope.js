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
    let oldValue = setValue(value, mutator);
    return observable(oldValue, (emit, subscribe) => (...args) => {
        if (args.length === 1) {
            const tempOldValue = oldValue;
            oldValue = setValue(args[0], mutator);
            emit((fn) => fn(oldValue, tempOldValue));
            return oldValue;
        } else {
            const fn = tracker[tracker.length - 1];
            if (fn) {
                subscribe(fn);
            }
            return oldValue;
        }
    });
}

export function computed(fn) {
    let oldValue = null, emit;
    const callback = () => {
        tracker.push(callback);
        let newValue, error;
        try {
            newValue = fn();
        } catch (e) {
            error = e;
        }
        tracker.pop();
        if (error) {
            throw error;
        }
        if (emit) {
            emit((fn) => fn(newValue, oldValue));
        }
        oldValue = newValue;
    };
    callback();
    return observable(oldValue, (emitter) => {
        emit = emitter;
        return () => oldValue;
    });
}

export function isObservable(obj) {
    return typeof obj === 'function' && OBSERVABLE in obj;
}
