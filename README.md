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

Create an observable for a value, returns a function which can be used to get the observable's value by calling the function without any arguments and set the value by passing a single argument of any type:

``` javascript
import { data } from '@ryanmorr/isotope';

const count = data(0);

count(); //=> 0
count(1);
count(); //=> 1
```

Create a computed observable by passing a function which is called immediately and automatically re-runs when any depending observable's values are changed:

``` javascript
import { data, computed } from '@ryanmorr/isotope';

const firstName = data('John');
const lastName = data('Doe');
const fullName = computed(() => `${firstName()} ${lastName()}`);

fullName(); //=> "John Doe"
firstName('Jane');
fullName(); //=> "Jane Doe"
```

Subscribe a callback function to a data or computed observable to be called when the value changes, returns a function which can be used to unsubscribe:

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

Check if a function is a data or computed observable:

``` javascript
import { data, isObservable } from '@ryanmorr/isotope';

const value = data();

isObservable(value); //=> true
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/isotope
[version-image]: https://badge.fury.io/gh/ryanmorr%2Fisotope.svg
[build-url]: https://travis-ci.org/ryanmorr/isotope
[build-image]: https://travis-ci.org/ryanmorr/isotope.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE