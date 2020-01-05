import { expect } from 'chai';
import sinon from 'sinon';
import { data, computed, isObservable } from '../../src/isotope';

describe('computed', () => {
    it('should return a function', () => {
        const foo = computed(() => null);

        expect(foo).to.be.a('function');
    });

    it('should return true for computed observables', () => {
        const fn = () => null;
        const foo = computed(fn);

        expect(isObservable(fn)).to.equal(false);
        expect(isObservable(foo)).to.equal(true);
    });

    it('should immediately compute a value', () => {
        const firstName = data('John');
        const lastName = data('Doe');
        const fullName = computed(() => `${firstName()} ${lastName()}`);

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
        const fullName = computed(() => `${firstName()} ${lastName()}`);

        expect(fullName()).to.equal('John Doe');

        firstName('Jane');
        expect(fullName()).to.equal('Jane Doe');

        lastName('Jones');
        expect(fullName()).to.equal('Jane Jones');
    });

    it('should add subscribers to be notified when the value changes', () => {
        const firstName = data('John');
        const lastName = data('Doe');
        const fullName = computed(() => `${firstName()} ${lastName()}`);

        const spy1 = sinon.spy();
        const spy2 = sinon.spy();

        fullName.subscribe(spy1);
        fullName.subscribe(spy2);

        firstName('Joe');

        expect(spy1.callCount).to.equal(1);
        expect(spy1.args[0][0]).to.equal('Joe Doe');
        expect(spy1.args[0][1]).to.equal('John Doe');
        expect(spy2.callCount).to.equal(1);
        expect(spy2.args[0][0]).to.equal('Joe Doe');
        expect(spy2.args[0][1]).to.equal('John Doe');
        expect(spy1.calledBefore(spy2)).to.equal(true);
        
        lastName('Blow');

        expect(spy1.callCount).to.equal(2);
        expect(spy1.args[1][0]).to.equal('Joe Blow');
        expect(spy1.args[1][1]).to.equal('Joe Doe');
        expect(spy2.callCount).to.equal(2);
        expect(spy2.args[1][0]).to.equal('Joe Blow');
        expect(spy2.args[1][1]).to.equal('Joe Doe');
    });

    it('should not allow the same function to subscribe more than once', () => {
        const firstName = data('John');
        const lastName = data('Doe');
        const fullName = computed(() => `${firstName()} ${lastName()}`);

        const spy = sinon.spy();

        fullName.subscribe(spy);
        fullName.subscribe(spy);
        fullName.subscribe(spy);

        firstName('Jane');
        expect(spy.callCount).to.equal(1);

        lastName('Jones');
        expect(spy.callCount).to.equal(2);
    });

    it('should immediately call a subscriber when provided true as an optional second argument', () => {
        const firstName = data('John');
        const lastName = data('Doe');
        const fullName = computed(() => `${firstName()} ${lastName()}`);

        const spy = sinon.spy();

        fullName.subscribe(spy, true);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal('John Doe');
        expect(spy.args[0][1]).to.equal(null);
    });

    it('should remove a subscriber', () => {
        const firstName = data('John');
        const lastName = data('Doe');
        const fullName = computed(() => `${firstName()} ${lastName()}`);

        const spy = sinon.spy();

        const unsubscribe = fullName.subscribe(spy);

        firstName('Jim');

        expect(spy.callCount).to.equal(1);
        
        unsubscribe();
        firstName('James');
        lastName('Johnson');

        expect(spy.callCount).to.equal(1);
    });

    it('should allow subscribers to remove themselves without disrupting others', () => {
        const firstName = data('John');
        const lastName = data('Doe');
        const fullName = computed(() => `${firstName()} ${lastName()}`);

        let unsubscribe;
        let doUnsubscribe = false;

        const spy1 = sinon.spy();
        const spy2 = sinon.spy(() => {
            if (doUnsubscribe) {
                unsubscribe();
            }
        });
        const spy3 = sinon.spy();

        fullName.subscribe(spy1);
        unsubscribe = fullName.subscribe(spy2);
        fullName.subscribe(spy3);

        firstName('Jack');

        expect(spy1.callCount).to.equal(1);
        expect(spy2.callCount).to.equal(1);
        expect(spy3.callCount).to.equal(1);
        
        doUnsubscribe = true;
        lastName('Jones');

        expect(spy1.callCount).to.equal(2);
        expect(spy2.callCount).to.equal(2);
        expect(spy3.callCount).to.equal(2);

        firstName('Jane');
        lastName('Johnson');

        expect(spy1.callCount).to.equal(4);
        expect(spy2.callCount).to.equal(2);
        expect(spy3.callCount).to.equal(4);
    });

    it('should handle dynamic dependencies', () => {
		const foo = data(1);
		const bar = data(2);
		const toggle = data(false);
		const value = computed(() => toggle() ? foo() : bar());
        
        expect(value()).to.equal(2);

		toggle(true);
		expect(value()).to.equal(1);

		toggle(false);
		expect(value()).to.equal(2);
    });
    
    it('should return the new value within a subscriber', () => {
        const firstName = data('John');
        const lastName = data('Doe');
        const fullName = computed(() => `${firstName()} ${lastName()}`);

        const spy = sinon.spy((name) => {
            expect(fullName()).to.equal(name);
            expect(fullName()).to.equal('Jane Doe');
        });

        fullName.subscribe(spy);

        firstName('Jane');
        expect(spy.callCount).to.equal(1);
    });

    it('should support multiple computed observables', () => {
        const foo = data('a');
        const bar = data('b');
        const baz = data('c');
        const qux = data('d');

        const first = computed(() => foo() + bar() + baz());
        const second = computed(() => foo() + qux());

        const firstSpy = sinon.spy();
        const secondSpy = sinon.spy();

        first.subscribe(firstSpy);
        second.subscribe(secondSpy);

        expect(first()).to.equal('abc');
        expect(second()).to.equal('ad');

        foo('x');
        expect(first()).to.equal('xbc');
        expect(second()).to.equal('xd');
        expect(firstSpy.callCount).to.equal(1);
        expect(secondSpy.callCount).to.equal(1);

        bar('y');
        expect(first()).to.equal('xyc');
        expect(second()).to.equal('xd');
        expect(firstSpy.callCount).to.equal(2);
        expect(secondSpy.callCount).to.equal(1);

        baz('z');
        expect(first()).to.equal('xyz');
        expect(second()).to.equal('xd');
        expect(firstSpy.callCount).to.equal(3);
        expect(secondSpy.callCount).to.equal(1);

        qux('w');
        expect(first()).to.equal('xyz');
        expect(second()).to.equal('xw');
        expect(firstSpy.callCount).to.equal(3);
        expect(secondSpy.callCount).to.equal(2);
    });
});
