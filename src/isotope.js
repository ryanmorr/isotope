export class Store {
    constructor(value) {
        this._value = value;
        this._subscribers = [];
    }

    value() {
        return this._value;
    }

    set(value) {
        const current = this.value();
        if (value !== current) {
            this._value = value;
            this._subscribers.slice().forEach((callback) => callback(value, current));
            return value;
        }
    }

    subscribe(callback) {
        const subscribers = this._subscribers;
        if (!subscribers.includes(callback)) {
            subscribers.push(callback);
            callback(this.value());
            return () => {
                const index = subscribers.indexOf(callback);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
            };
        }
    }

    then(resolve) {
        resolve(this.value());
    }
    
    toString() {
        return String(this.value());
    }
    
    valueOf() {
        return this.value();
    }
    
    toJSON() {
        return this.value();
    }
}

class ValueStore extends Store {
    update(callback) {
        return this.set(callback(this.value()));
    }
}

class ReducerStore extends Store {
    constructor(initialState, reducer) {
        super(initialState);
        this._reducer = reducer;
    }

    dispatch(action) {
        return super.set(this._reducer(this.value(), action));
    }
}

class DerivedStore extends Store {
    constructor(deps, callback, isArray) {
        super();
        let initialized = false;
        const values = [];
        const sync = isArray ? () => super.set(callback(values)) : () => super.set(callback(...values));
        deps.forEach((dep, i) => dep.subscribe((value) => {
            values[i] = value;
            if (initialized) {
                sync();
            }
        }));
        initialized = true;
        sync();
    }
}

class AsyncDerivedStore extends Store {
    constructor(deps, callback, isArray) {
        super();
        let count = 0;
        let initialized = false;
        const values = [];
        const sync = isArray ? (setter) => callback(values, setter) : (setter) => callback(...values.concat([setter]));
        deps.forEach((dep, i) => dep.subscribe((value) => {
            values[i] = value;
            if (initialized) {
                count++;
                const n = count;
                sync((val) => {
                    if (count === n) {
                        super.set(val);
                    }
                });
            }
        }));
        initialized = true;
        sync((val) => super.set(val));
    }
}

DerivedStore.prototype.set = undefined;
AsyncDerivedStore.prototype.set = undefined;
ReducerStore.prototype.set = undefined;

export function store(value) {
    return new ValueStore(value);
}

export function reducer(initialState, reducer) {
    return new ReducerStore(initialState, reducer);
}

export function derived(...args) {
    let deps, callback;
    const isArray = Array.isArray(args[0]);
    if (isArray) {
        deps = args[0];
        callback = args[1];
    } else {
        deps = args;
        callback = args.pop();
    }
    const paramLength = callback.length;
    if ((isArray && paramLength === 2) || paramLength > deps.length) {
        return new AsyncDerivedStore(deps, callback, isArray);
    }
    return new DerivedStore(deps, callback, isArray);
}
