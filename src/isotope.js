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
    const sync = () => set(callback(...values), get());
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
