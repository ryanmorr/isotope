import defineStore from '@ryanmorr/define-store';

export const store = defineStore((get, set) => (value) => {
    set(value);
    const setValue = (val) => {
        set(val, get());
        return val;
    };
    return {
        value: get,
        set: setValue,
        update: (callback) => setValue(callback(get()))
    };
});

export const derived = defineStore((get, set) => (...deps) => {
    let initialized = false;
    const callback = deps.pop();
    const isAsync = callback.length > deps.length;
    const values = [];
    const sync = () => isAsync ? callback(...values) : set(callback(...values), get());
    deps.forEach((dep, i) => dep.subscribe((value) => {
        values[i] = value;
        if (initialized) {
            sync();
        }
    }));
    if (isAsync) {
        values.push((val) => set(val, get()));
    }
    initialized = true;
    sync();
    return {
        value: get
    };
});

export const reducer = defineStore((get, set) => (initialState, reducer) => {
    set(initialState);
    return {
        value: get,
        dispatch: (action) => {
            const prevState = get();
            set(reducer(prevState, action), prevState);
            return get();
        }
    };
});

export function effect(...deps) {
    let initialized = false;
    const callback = deps.pop();
    const values = [];
    const unsubscribers = deps.map((dep, i) => dep.subscribe((value) => {
        values[i] = value;
        if (initialized) {
            callback(...values);
        }
    }));
    initialized = true;
    callback(...values);
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
}
