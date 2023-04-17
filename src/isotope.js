export class Store {
    constructor(value) {
        this._value = value;
        this._subscribers = [];
    }

    value() {
        return this._value;
    }

    set(value) {
        const prev = this.value();
        this._value = value;
        this._subscribers.slice().forEach((callback) => callback(value, prev));
        return value;
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

class DerivedStore extends Store {
    constructor(deps, callback) {
        super();
        let initialized = false;
        const values = [];
        const sync = () => super.set(callback(...values));
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
    constructor(deps, callback) {
        super();
        let count = 0;
        let initialized = false;
        const values = [];
        const sync = (setter) => callback(...values.concat([setter]));
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

class ReducerStore extends Store {
    constructor(initialState, reducer) {
        super(initialState);
        this._reducer = reducer;
    }

    dispatch(action) {
        return super.set(this._reducer(this.value(), action));
    }
}

DerivedStore.prototype.set = undefined;
AsyncDerivedStore.prototype.set = undefined;
ReducerStore.prototype.set = undefined;

export function store(value) {
    return new ValueStore(value);
}

export function derived(...deps) {
    const callback = deps.pop();
    if (callback.length > deps.length) {
        return new AsyncDerivedStore(deps, callback);
    }
    return new DerivedStore(deps, callback);
}

export function reducer(initialState, reducer) {
    return new ReducerStore(initialState, reducer);
}

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
