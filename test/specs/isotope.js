import { expect } from 'chai';
import sinon from 'sinon';
import { data, isData } from '../../src/isotope';

describe('isotope', () => {
    it('should return a function', () => {
        const foo = data();

        expect(foo).to.be.a('function');
    });

    it('should return true for data callbacks', () => {
        const fn = () => null;
        const foo = data();

        expect(isData(fn)).to.equal(false);
        expect(isData(foo)).to.equal(true);
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

    it('should support observing for changes of the value', () => {
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
});
