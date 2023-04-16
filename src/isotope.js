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
    const values = [];
    const callback = deps.pop();
    if (callback.length > deps.length) {
        let count = 0;
        const sync = (setter) => callback(...values.concat([setter]));
        deps.forEach((dep, i) => dep.subscribe((value) => {
            values[i] = value;
            if (initialized) {
                count++;
                const n = count;
                sync((val) => {
                    if (count === n) {
                        set(val, get());
                    }
                });
            }
        }));
        initialized = true;
        sync((val) => set(val, get()));
    } else {
        const sync = () => set(callback(...values), get());
        deps.forEach((dep, i) => dep.subscribe((value) => {
            values[i] = value;
            if (initialized) {
                sync();
            }
        }));
        initialized = true;
        sync();
    }
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
