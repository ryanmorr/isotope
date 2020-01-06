const tracker = [];
const OBSERVABLE = Symbol('observable');

function addDependency(subscribe) {
    const callback = tracker[tracker.length - 1];
    if (callback) {
        subscribe(callback);
    }
}

function observable(value, setup) {
    const subscribers = [];
    const subscribe = (subscriber, immediate = false) => {
        if (!subscribers.includes(subscriber)) {
            subscribers.push(subscriber);
            if (immediate === true) {
                subscriber(value, null);
            }
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
            };
        }
    };
    const emit = (newValue, oldValue) => {
        subscribers.slice().forEach((subscriber) => subscriber(newValue, oldValue));
    };
    const callback = setup(subscribe, emit);
    callback[OBSERVABLE] = true;
    callback.subscribe = subscribe;
    return callback;
}

export function data(value = null) {
    return observable(value, (subscribe, emit) => (...args) => {
        if (args.length === 1) {
            const newValue = args[0];
            if (newValue === value && (newValue === null || typeof newValue !== 'object')) {
                return value;
            }
            const oldValue = value;
            value = newValue;
            emit(value, oldValue);
            return value;
        } else {
            addDependency(subscribe);
            return value;
        }
    });
}

export function computed(computedFn) {
    let value = computedFn();
    return observable(value, (subscribe, emit) => {
        const callback = () => {
            tracker.push(callback);
            const oldValue = value;
            value = computedFn();
            tracker.pop();
            emit(value, oldValue);
        };
        callback();
        return () => {
            addDependency(subscribe);
            return value;
        };
    });
}

export function isObservable(obj) {
    return typeof obj === 'function' && obj[OBSERVABLE] === true;
}
