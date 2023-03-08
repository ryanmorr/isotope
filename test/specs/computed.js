import { expect } from 'chai';
import sinon from 'sinon';
import { data, computed } from '../../src/isotope.js';

describe('computed', () => {
    it('should immediately compute a value', () => {
        const firstName = data('John');
        const lastName = data('Doe');
        const fullName = computed(firstName, lastName, (fName, lName) => `${fName} ${lName}`);

        expect(fullName).to.be.a('function');
        expect(fullName()).to.equal('John Doe');
    });

    it('should not change if called with an argument', () => {
        const foo = computed(() => 'foo');

        expect(foo('bar')).to.equal('foo');
        expect(foo()).to.equal('foo');
    });

    it('should automatically update if a dependency changes', () => {
        const firstName = data('John');
        const lastName = data('Doe');
        const fullName = computed(firstName, lastName, (fName, lName) => `${fName} ${lName}`);

        expect(fullName()).to.equal('John Doe');

        firstName('Jane');
        expect(fullName()).to.equal('Jane Doe');

        lastName('Jones');
        expect(fullName()).to.equal('Jane Jones');
    });

    it('should add subscribers to be called immediately and when the value changes', () => {
        const firstName = data('John');
        const lastName = data('Doe');
        const fullName = computed(firstName, lastName, (fName, lName) => `${fName} ${lName}`);

        const spy1 = sinon.spy();
        const spy2 = sinon.spy();

        fullName.subscribe(spy1);
        fullName.subscribe(spy2);

        expect(spy1.callCount).to.equal(1);
        expect(spy1.args[0].length).to.equal(1);
        expect(spy1.args[0][0]).to.equal('John Doe');
        expect(spy2.callCount).to.equal(1);
        expect(spy2.args[0].length).to.equal(1);
        expect(spy2.args[0][0]).to.equal('John Doe');
        expect(spy1.calledBefore(spy2)).to.equal(true);

        firstName('Joe');

        expect(spy1.callCount).to.equal(2);
        expect(spy1.args[1].length).to.equal(2);
        expect(spy1.args[1][0]).to.equal('Joe Doe');
        expect(spy1.args[1][1]).to.equal('John Doe');
        expect(spy2.callCount).to.equal(2);
        expect(spy2.args[1].length).to.equal(2);
        expect(spy2.args[1][0]).to.equal('Joe Doe');
        expect(spy2.args[1][1]).to.equal('John Doe');
        
        lastName('Blow');

        expect(spy1.callCount).to.equal(3);
        expect(spy1.args[2][0]).to.equal('Joe Blow');
        expect(spy1.args[2][1]).to.equal('Joe Doe');
        expect(spy2.callCount).to.equal(3);
        expect(spy2.args[2][0]).to.equal('Joe Blow');
        expect(spy2.args[2][1]).to.equal('Joe Doe');
    });

    it('should support multiple computed stores', () => {
        const foo = data('a');
        const bar = data('b');
        const baz = data('c');
        const qux = data('d');

        const first = computed(foo, bar, baz, (a, b, c) => a + b + c);
        const second = computed(foo, qux, (a, b) => a + b);

        const firstSpy = sinon.spy();
        const secondSpy = sinon.spy();

        first.subscribe(firstSpy);
        second.subscribe(secondSpy);

        expect(firstSpy.callCount).to.equal(1);
        expect(secondSpy.callCount).to.equal(1);

        expect(first()).to.equal('abc');
        expect(second()).to.equal('ad');

        foo('x');
        expect(first()).to.equal('xbc');
        expect(second()).to.equal('xd');
        expect(firstSpy.callCount).to.equal(2);
        expect(secondSpy.callCount).to.equal(2);

        bar('y');
        expect(first()).to.equal('xyc');
        expect(second()).to.equal('xd');
        expect(firstSpy.callCount).to.equal(3);
        expect(secondSpy.callCount).to.equal(2);

        baz('z');
        expect(first()).to.equal('xyz');
        expect(second()).to.equal('xd');
        expect(firstSpy.callCount).to.equal(4);
        expect(secondSpy.callCount).to.equal(2);

        qux('w');
        expect(first()).to.equal('xyz');
        expect(second()).to.equal('xw');
        expect(firstSpy.callCount).to.equal(4);
        expect(secondSpy.callCount).to.equal(3);
    });

    it('should support computed stores with computed dependencies', () => {
        const foo = data('a');
        const bar = data('b');
        const baz = data('c');
        const qux = data('d');

        const fooBar = computed(foo, bar, (a, b) => a + b);
        const bazQux = computed(baz, qux, (a, b) => a + b);
        const value = computed(fooBar, bazQux, (a, b) => a + b);

        const fooBarSpy = sinon.spy();
        const bazQuxSpy = sinon.spy();
        const valueSpy = sinon.spy();

        fooBar.subscribe(fooBarSpy);
        bazQux.subscribe(bazQuxSpy);
        value.subscribe(valueSpy);

        expect(fooBarSpy.callCount).to.equal(1);
        expect(bazQuxSpy.callCount).to.equal(1);
        expect(valueSpy.callCount).to.equal(1);

        expect(value()).to.equal('abcd');

        foo('x');
        expect(value()).to.equal('xbcd');
        expect(fooBarSpy.callCount).to.equal(2);
        expect(bazQuxSpy.callCount).to.equal(1);
        expect(valueSpy.callCount).to.equal(2);

        bar('y');
        expect(value()).to.equal('xycd');
        expect(fooBarSpy.callCount).to.equal(3);
        expect(bazQuxSpy.callCount).to.equal(1);
        expect(valueSpy.callCount).to.equal(3);

        baz('z');
        expect(value()).to.equal('xyzd');
        expect(fooBarSpy.callCount).to.equal(3);
        expect(bazQuxSpy.callCount).to.equal(2);
        expect(valueSpy.callCount).to.equal(4);

        qux('w');
        expect(value()).to.equal('xyzw');
        expect(fooBarSpy.callCount).to.equal(3);
        expect(bazQuxSpy.callCount).to.equal(3);
        expect(valueSpy.callCount).to.equal(5);
    });
});
