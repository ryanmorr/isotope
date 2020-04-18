# isotope

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![License][license-image]][license-url]

> Minimal reactive library

## Install

Download the [CJS](https://github.com/ryanmorr/isotope/raw/master/dist/isotope.cjs.js), [ESM](https://github.com/ryanmorr/isotope/raw/master/dist/isotope.esm.js), [UMD](https://github.com/ryanmorr/isotope/raw/master/dist/isotope.umd.js) versions or install via NPM:

``` sh
npm install @ryanmorr/isotope
```

## Usage

Create a basic store for a value:

``` javascript
import { data } from '@ryanmorr/isotope';

const count = data(0);

count(); //=> 0
count(1);
count(); //=> 1
```

Create a Redux-style reducer store for managing state:

``` javascript
import { reducer } from '@ryanmorr/isotope';

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

counter({type: 'increment'});
counter(); //=> {count: 1}
counter({type: 'decrement'});
counter(); //=> {count: 0}
```

Create a computed store that is automatically updated when a depending store is updated:

``` javascript
import { data, computed } from '@ryanmorr/isotope';

const firstName = data('John');
const lastName = data('Doe');
const fullName = computed(firstName, lastName, (f, l) => `${f} ${l}`);

fullName(); //=> "John Doe"
firstName('Jane');
fullName(); //=> "Jane Doe"
```

Subscribe a callback function to a store to be called when updated, a function to unsubscribe is returned:

``` javascript
import { data } from '@ryanmorr/isotope';

const value = data(5);

// Log the old and new values after a change
const unsubscribe = value.subscribe((newValue, oldValue) => console.log(newValue, oldValue));

// Trigger all subscribers to be called
value(10);

// Remove subscription
unsubscribe();
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/isotope
[version-image]: https://badge.fury.io/gh/ryanmorr%2Fisotope.svg
[build-url]: https://travis-ci.org/ryanmorr/isotope
[build-image]: https://travis-ci.org/ryanmorr/isotope.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE