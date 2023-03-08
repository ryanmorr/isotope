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
    const values = [];
    const sync = () => {
        const result = callback(...values);
        if (result && typeof result.then === 'function') {
            result.then((value) => set(value, get()));
        } else {
            set(result, get());
        }
    };
    deps.forEach((dep, i) => dep.subscribe((value) => {
        values[i] = value;
        if (initialized) {
            sync();
        }
    }));
    initialized = true;
    sync();
    return {
        value: get
    };
});

export const reducer = defineStore((get, set) => (initialState, reducer) => {
    set(initialState);
    return {
        state: get,
        dispatch: (action) => {
            const prevState = get();
            set(reducer(prevState, action), prevState);
            return get();
        }
    };
});
