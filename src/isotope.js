function Store(value) {
    this._value = value;
    this._subscribers = [];
}

Store.prototype.value = function() {
    return this._value;
};

Store.prototype.set = function(value) {
    const prev = this._value;
    this._value = value;
    this._subscribers.slice().forEach((subscriber) => subscriber(value, prev));
    return this._value;
};

Store.prototype.update = function(callback) {
    return this.set(callback(this._value));
}

Store.prototype.subscribe = function(callback) {
    if (!this._subscribers.includes(callback)) {
        this._subscribers.push(callback);
        callback(this._value);
        return () => {
            const index = this._subscribers.indexOf(callback);
            if (index !== -1) {
                this._subscribers.splice(index, 1);
            }
        };
    }
};

Store.prototype.then = function(resolve) {
    resolve(this._value);
};

Store.prototype.toString = function() {
    return String(this._value);
};

Store.prototype.valueOf = function() {
    return this._value;
};

Store.prototype.toJSON = function() {
    return this._value;
};

export function store(value) {
    return new Store(value);
}
