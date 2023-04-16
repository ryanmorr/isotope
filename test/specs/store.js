import { expect } from 'chai';
import sinon from 'sinon';
import { store } from '../../src/isotope.js';

describe('store', () => {
    it('should return the internal value', () => {
        const foo = store();
        const bar = store(123);
        
        expect(foo.value()).to.equal(undefined);
        expect(bar.value()).to.equal(123);
    });

    it('should set the internal value and return the new value', () => {
        const value = store('foo');
        
        expect(value.value()).to.equal('foo');

        expect(value.set('bar')).to.equal('bar');
        expect(value.value()).to.equal('bar');

        expect(value.set('baz')).to.equal('baz');
        expect(value.value()).to.equal('baz');
    });

    it('should update the internal value with a callback function and return the new value', () => {
        const value = store(1);
        
        expect(value.value()).to.equal(1);

        expect(value.update((val) => val + 10)).to.equal(11);
        expect(value.value()).to.equal(11);

        expect(value.update((val) => val + 100)).to.equal(111);
        expect(value.value()).to.equal(111);
    });

    it('should call a subscriber immediately when added', () => {
        const value = store();
        
        const spy = sinon.spy();
        value.subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(undefined);
        expect(spy.args[0][1]).to.equal(undefined);
    });

    it('should call subscribers when the internal value changes', () => {
        const value = store(10);
        
        const spy = sinon.spy();
        value.subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(10);
        expect(spy.args[0][1]).to.equal(undefined);

        value.set(20);
        expect(spy.callCount).to.equal(2);
        expect(spy.args[1][0]).to.equal(20);
        expect(spy.args[1][1]).to.equal(10);

        value.update((val) => val + 100);
        expect(spy.callCount).to.equal(3);
        expect(spy.args[2][0]).to.equal(120);
        expect(spy.args[2][1]).to.equal(20);
    });
});
