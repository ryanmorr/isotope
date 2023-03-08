import defineStore from '@ryanmorr/define-store';

export const data = defineStore((get, set) => (value = null) => {
    set(value);
    return (...args) => {
        if (args.length === 1) {
            const prevValue = get();
            const nextValue = args[0];
            if (nextValue === prevValue && (nextValue === null || typeof nextValue !== 'object')) {
                return prevValue;
            }
            set(nextValue, prevValue);
        }
        return get();
    };
});

export const reducer = defineStore((get, set) => (initialState, reducer) => {
    set(initialState);
    return (...args) => {
        if (args.length === 1) {
            const prevState = get();
            set(reducer(prevState, args[0]), prevState);
        }
        return get();
    };
});

export const computed = defineStore((get, set) => (...deps) => {
    const callback = deps.pop();
    const setValue = () => {
        const prevValue = get();
        const args = deps.map((dep) => dep());
        set(callback(...args), prevValue);
    };
    deps.forEach((dep) => dep.subscribe(setValue));
    setValue();
    return get;
});
