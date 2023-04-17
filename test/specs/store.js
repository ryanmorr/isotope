import { expect } from 'chai';
import sinon from 'sinon';
import { store, Store } from '../../src/isotope.js';

describe('store', () => {
    it('should encapsulate a value', () => {
        const foo = store();
        const bar = store(123);
        
        expect(foo).to.be.an.instanceof(Store);
        expect(foo.value()).to.equal(undefined);
        expect(bar).to.be.an.instanceof(Store);
        expect(bar.value()).to.equal(123);
    });

    it('should set the internal value and return the new value', () => {
        const foo = store('foo');
        
        expect(foo.value()).to.equal('foo');

        expect(foo.set('bar')).to.equal('bar');
        expect(foo.value()).to.equal('bar');

        expect(foo.set('baz')).to.equal('baz');
        expect(foo.value()).to.equal('baz');
    });

    it('should update the internal value with a callback function and return the new value', () => {
        const foo = store(1);
        
        expect(foo.value()).to.equal(1);

        expect(foo.update((val) => val + 10)).to.equal(11);
        expect(foo.value()).to.equal(11);

        expect(foo.update((val) => val + 100)).to.equal(111);
        expect(foo.value()).to.equal(111);
    });

    it('should call a subscriber immediately when added', () => {
        const foo = store();
        
        const spy = sinon.spy();
        foo.subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(undefined);
        expect(spy.args[0][1]).to.equal(undefined);
    });

    it('should call subscribers when the internal value changes', () => {
        const foo = store(10);
        
        const spy = sinon.spy();
        foo.subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(10);
        expect(spy.args[0][1]).to.equal(undefined);

        foo.set(20);
        expect(spy.callCount).to.equal(2);
        expect(spy.args[1][0]).to.equal(20);
        expect(spy.args[1][1]).to.equal(10);

        foo.update((val) => val + 100);
        expect(spy.callCount).to.equal(3);
        expect(spy.args[2][0]).to.equal(120);
        expect(spy.args[2][1]).to.equal(20);
    });

    it('should not allow the same function to subscribe more than once', () => {
        const foo = store('foo');

        const spy = sinon.spy();

        foo.subscribe(spy);
        foo.subscribe(spy);
        foo.subscribe(spy);

        expect(spy.callCount).to.equal(1);

        foo.set('baz');

        expect(spy.callCount).to.equal(2);
    });

    it('should remove a subscriber', () => {
        const foo = store('foo');

        const spy = sinon.spy();
        const unsubscribe = foo.subscribe(spy);

        expect(spy.callCount).to.equal(1);

        foo.set('bar');

        expect(spy.callCount).to.equal(2);
        
        unsubscribe();
        foo.set('baz');

        expect(spy.callCount).to.equal(2);
    });

    it('should allow subscribers to remove themselves without disrupting others', () => {
        const foo = store('foo');

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

        expect(spy1.callCount).to.equal(1);
        expect(spy2.callCount).to.equal(1);
        expect(spy3.callCount).to.equal(1);

        foo.set('bar');

        expect(spy1.callCount).to.equal(2);
        expect(spy2.callCount).to.equal(2);
        expect(spy3.callCount).to.equal(2);
        
        doUnsubscribe = true;
        foo.set('baz');

        expect(spy1.callCount).to.equal(3);
        expect(spy2.callCount).to.equal(3);
        expect(spy3.callCount).to.equal(3);

        foo.set('qux');

        expect(spy1.callCount).to.equal(4);
        expect(spy2.callCount).to.equal(3);
        expect(spy3.callCount).to.equal(4);
    });

    it('should support implicit type conversions', async () => {
        const foo = store(10);
        
        expect(foo.toString()).to.equal('10');
        expect(foo.valueOf()).to.equal(10);
        expect(foo.toJSON()).to.equal(10);
        expect(await foo).to.equal(10);
    });
});
