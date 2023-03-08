# isotope

[![Version Badge][version-image]][project-url]
[![License][license-image]][license-url]
[![Build Status][build-image]][build-url]

> Minimal reactive library

## Install

Download the [CJS](https://github.com/ryanmorr/isotope/raw/master/dist/cjs/isotope.js), [ESM](https://github.com/ryanmorr/isotope/raw/master/dist/esm/isotope.js), [UMD](https://github.com/ryanmorr/isotope/raw/master/dist/umd/isotope.js) versions or install via NPM:

``` sh
npm install @ryanmorr/isotope
```

## Usage

Create a basic store for a value:

``` javascript
import { store } from '@ryanmorr/isotope';

// Create a store with an initial value
const count = store(0);

// Get the store value
count.value(); //=> 0

// Set the store value
count.set(1);

// Set the store value with a callback function
count.update((val) => val + 1);
```

Create a Redux-style reducer store for managing state:

``` javascript
import { reducer } from '@ryanmorr/isotope';

// Create a store with an initial state and reducer function
const counter = reducer({count: 0}, (state, action) => {
    switch (action.type) {
        case 'increment':
            return {count: state.count + 1};
        case 'decrement':
            return {count: state.count - 1};
        default:
            return state;
    }
});

counter.dispatch({type: 'increment'});
counter.state(); //=> {count: 1}
counter.dispatch({type: 'decrement'});
counter.state(); //=> {count: 0}
```

Create a derived store that is based on the value of one or more other stores:

``` javascript
import { store, derived } from '@ryanmorr/isotope';

const firstName = store('John');
const lastName = store('Doe');
const fullName = derived(firstName, lastName, (first, last) => `${first} ${last}`);

fullName.value(); //=> "John Doe"
firstName.set('Jane');
fullName.value(); //=> "Jane Doe"
```

If the derived function returns a promise, it is treated as asynchronous, waiting for the promise to resolve before setting the new value:

```javascript
import { store, derived } from '@ryanmorr/isotope';

const param = store();

// Perform an ajax request and notify subscribers with the results
const results = derived(param, async (data) => {
    return await fetch(`path/to/server/${encodeURIComponent(data)}`);
});
```

All stores support subscribing a callback function to be called when the store is updated, a function to unsubscribe is returned:

``` javascript
import { store } from '@ryanmorr/isotope';

const value = store('foo');

// Log the old and new values after a change
const unsubscribe = value.subscribe((newValue, oldValue) => console.log(newValue, oldValue));

// Trigger all subscribers to be called
value.set('bar');

// Remove subscription
unsubscribe();
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/isotope
[version-image]: https://img.shields.io/github/package-json/v/ryanmorr/isotope?color=blue&style=flat-square
[build-url]: https://github.com/ryanmorr/isotope/actions
[build-image]: https://img.shields.io/github/actions/workflow/status/ryanmorr/isotope/node.js.yml?style=flat-square
[license-image]: https://img.shields.io/github/license/ryanmorr/isotope?color=blue&style=flat-square
[license-url]: UNLICENSE