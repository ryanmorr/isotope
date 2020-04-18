import { expect } from 'chai';
import sinon from 'sinon';
import { data } from '../../src/isotope';

describe('data', () => {
    it('should return a default value of null', () => {
        const foo = data();

        expect(foo).to.be.a('function');
        expect(foo()).to.equal(null);
    });

    it('should return the initial value', () => {
        const foo = data('foo');

        expect(foo()).to.equal('foo');
    });

    it('should set and return the current value', () => {
        const foo = data('foo');

        expect(foo()).to.equal('foo');
        expect(foo('bar')).to.equal('bar');
        expect(foo()).to.equal('bar');
    });

    it('should add subscribers to be called immediately and when the value changes', () => {
        const foo = data('foo');

        const spy1 = sinon.spy();
        const spy2 = sinon.spy();

        foo.subscribe(spy1);
        foo.subscribe(spy2);

        expect(spy1.callCount).to.equal(1);
        expect(spy1.args[0].length).to.equal(1);
        expect(spy1.args[0][0]).to.equal('foo');
        expect(spy2.callCount).to.equal(1);
        expect(spy2.args[0].length).to.equal(1);
        expect(spy2.args[0][0]).to.equal('foo');
        expect(spy1.calledBefore(spy2)).to.equal(true);

        foo('bar');

        expect(spy1.callCount).to.equal(2);
        expect(spy1.args[1].length).to.equal(2);
        expect(spy1.args[1][0]).to.equal('bar');
        expect(spy1.args[1][1]).to.equal('foo');
        expect(spy2.callCount).to.equal(2);
        expect(spy1.args[1].length).to.equal(2);
        expect(spy2.args[1][0]).to.equal('bar');
        expect(spy2.args[1][1]).to.equal('foo');
        
        foo('baz');

        expect(spy1.callCount).to.equal(3);
        expect(spy1.args[2][0]).to.equal('baz');
        expect(spy1.args[2][1]).to.equal('bar');
        expect(spy2.callCount).to.equal(3);
        expect(spy2.args[2][0]).to.equal('baz');
        expect(spy2.args[2][1]).to.equal('bar');
    });

    it('should not update if the new value is a primitive and equal to the old value', () => {
        const foo = data(1);
        
		const spy = sinon.spy();
        foo.subscribe(spy);

        expect(spy.callCount).to.equal(1);

		expect(foo(1)).to.equal(1);
		expect(spy.callCount).to.equal(1);

		foo('foo');
		expect(spy.callCount).to.equal(2);
		expect(foo('foo')).to.equal('foo');
		expect(spy.callCount).to.equal(2);

        foo(true);
        expect(spy.callCount).to.equal(3);
        expect(foo(true)).to.equal(true);
        expect(spy.callCount).to.equal(3);

        foo(null);
        expect(spy.callCount).to.equal(4);
        expect(foo(null)).to.equal(null);
        expect(spy.callCount).to.equal(4);

        foo(undefined);
        expect(spy.callCount).to.equal(5);
        expect(foo(undefined)).to.equal(undefined);
        expect(spy.callCount).to.equal(5);
    });
    
    it('should allow updates if the new value is equal to the old value but not a primitive', () => {
        const array = [];
        const object = {};

        const foo = data(array);
        
		const spy = sinon.spy();
        foo.subscribe(spy);

        expect(spy.callCount).to.equal(1);

		expect(foo(array)).to.equal(array);
		expect(spy.callCount).to.equal(2);

		foo(object);
		expect(spy.callCount).to.equal(3);
		expect(foo(object)).to.equal(object);
		expect(spy.callCount).to.equal(4);
	});
});
