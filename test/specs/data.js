import { expect } from 'chai';
import sinon from 'sinon';
import { data, isObservable } from '../../src/isotope';

describe('data', () => {
    it('should return a function', () => {
        const foo = data();

        expect(foo).to.be.a('function');
    });

    it('should return true for data callbacks', () => {
        const fn = () => null;
        const foo = data();

        expect(isObservable(fn)).to.equal(false);
        expect(isObservable(foo)).to.equal(true);
    });

    it('should return a default value of null if invoked with no arguments', () => {
        const foo = data();

        expect(foo()).to.equal(null);
    });

    it('should return the initial value provided to data if invoked with no arguments', () => {
        const foo = data('foo');

        expect(foo()).to.equal('foo');
    });

    it('should set and return the current value if invoked with an argument', () => {
        const foo = data('foo');

        expect(foo()).to.equal('foo');
        expect(foo('bar')).to.equal('bar');
        expect(foo()).to.equal('bar');
    });

    it('should support a mutator function as an optional second argument', () => {
        const foo = data('foo', (str) => str.toUpperCase());

        expect(foo()).to.equal('FOO');
        expect(foo('bar')).to.equal('BAR');
        expect(foo()).to.equal('BAR');
    });

    it('should subscribe to be notified of data changes', () => {
        const foo = data('foo');

        const spy1 = sinon.spy();
        const spy2 = sinon.spy();

        foo.subscribe(spy1);
        foo.subscribe(spy2);

        foo('bar');

        expect(spy1.callCount).to.equal(1);
        expect(spy1.args[0][0]).to.equal('bar');
        expect(spy1.args[0][1]).to.equal('foo');
        expect(spy2.callCount).to.equal(1);
        expect(spy2.args[0][0]).to.equal('bar');
        expect(spy2.args[0][1]).to.equal('foo');
        expect(spy1.calledBefore(spy2)).to.equal(true);
        
        foo('baz');

        expect(spy1.callCount).to.equal(2);
        expect(spy1.args[1][0]).to.equal('baz');
        expect(spy1.args[1][1]).to.equal('bar');
        expect(spy2.callCount).to.equal(2);
        expect(spy2.args[1][0]).to.equal('baz');
        expect(spy2.args[1][1]).to.equal('bar');
    });

    it('should not allow the same function to subscribe more than once', () => {
        const foo = data('foo');

        const spy = sinon.spy();

        foo.subscribe(spy);
        foo.subscribe(spy);
        foo.subscribe(spy);

        foo('baz');

        expect(spy.callCount).to.equal(1);
    });

    it('should immediately call a subscriber when provided true as an optional second argument', () => {
        const foo = data('foo');

        const spy = sinon.spy();

        foo.subscribe(spy, true);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal('foo');
        expect(spy.args[0][1]).to.equal(null);
    });

    it('should unsubscribe to be notified of data changes', () => {
        const foo = data('foo');

        const spy = sinon.spy();

        const unsubscribe = foo.subscribe(spy);

        foo('bar');

        expect(spy.callCount).to.equal(1);
        
        unsubscribe();
        foo('baz');

        expect(spy.callCount).to.equal(1);
    });

    it('should not interrupt subscriber invocation sequence ', () => {
        const foo = data('foo');

        let unsubscribe;
        let doUnsubscribe = false;

        const spy1 = sinon.spy();
        const spy2 = sinon.spy(() => {
            if (doUnsubscribe) {
                unsubscribe();
            }
        });
        const spy3 = sinon.spy();

        foo.subscribe(spy1);
        unsubscribe = foo.subscribe(spy2);
        foo.subscribe(spy3);

        foo('bar');

        expect(spy1.callCount).to.equal(1);
        expect(spy2.callCount).to.equal(1);
        expect(spy3.callCount).to.equal(1);
        
        doUnsubscribe = true;
        foo('baz');

        expect(spy1.callCount).to.equal(2);
        expect(spy2.callCount).to.equal(2);
        expect(spy3.callCount).to.equal(2);

        foo('qux');

        expect(spy1.callCount).to.equal(3);
        expect(spy2.callCount).to.equal(2);
        expect(spy3.callCount).to.equal(3);
    });

    it('should return the new value within a subscriber', () => {
        const foo = data('foo');

        const spy = sinon.spy(() => {
            expect(foo()).to.equal('bar')
        });

        foo.subscribe(spy);

        foo('bar');
        expect(spy.callCount).to.equal(1);
    });
});
