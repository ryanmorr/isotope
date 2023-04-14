import { expect } from 'chai';
import sinon from 'sinon';
import { store, reducer, effect, derived } from '../../src/isotope.js';

describe('effect', () => {
    it('should invoke the callback for a single dependency', () => {
        const foo = store(10);

        const spy = sinon.spy();
        effect(foo, spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(10);

        foo.set(20);

        expect(spy.callCount).to.equal(2);
        expect(spy.args[1][0]).to.equal(20);
    });

    it('should invoke the callback for a multiple dependencies', () => {
        const foo = store(10);
        const bar = store(20);
        const baz = store(30);

        const spy = sinon.spy();
        effect(foo, bar, baz, spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(10);
        expect(spy.args[0][1]).to.equal(20);
        expect(spy.args[0][2]).to.equal(30);

        foo.set(11);

        expect(spy.callCount).to.equal(2);
        expect(spy.args[1][0]).to.equal(11);
        expect(spy.args[1][1]).to.equal(20);
        expect(spy.args[1][2]).to.equal(30);

        bar.set(21);

        expect(spy.callCount).to.equal(3);
        expect(spy.args[2][0]).to.equal(11);
        expect(spy.args[2][1]).to.equal(21);
        expect(spy.args[2][2]).to.equal(30);

        baz.set(31);

        expect(spy.callCount).to.equal(4);
        expect(spy.args[3][0]).to.equal(11);
        expect(spy.args[3][1]).to.equal(21);
        expect(spy.args[3][2]).to.equal(31);
    });

    it('should support mixed store dependencies', () => {
        const foo = store(0);
        const bar = derived(foo, (val) => val + 1);
        const baz = reducer({baz: 100}, (state) => ({baz: state.baz - 1}));

        const spy = sinon.spy();
        effect(foo, bar, baz, spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(0);
        expect(spy.args[0][1]).to.equal(1);
        expect(spy.args[0][2]).to.deep.equal({baz: 100});

        foo.set(10);

        expect(spy.callCount).to.equal(3);
        expect(spy.args[1][0]).to.equal(0);
        expect(spy.args[1][1]).to.equal(11);
        expect(spy.args[1][2]).to.deep.equal({baz: 100});

        expect(spy.args[2][0]).to.equal(10);
        expect(spy.args[2][1]).to.equal(11);
        expect(spy.args[2][2]).to.deep.equal({baz: 100});

        baz.dispatch();

        expect(spy.callCount).to.equal(4);
        expect(spy.args[3][0]).to.equal(10);
        expect(spy.args[3][1]).to.equal(11);
        expect(spy.args[3][2]).to.deep.equal({baz: 99});
    });

    it('should return a function to stop future invocations', () => {
        const foo = store(10);
        const bar = store(20);

        const spy = sinon.spy();
        const stop = effect(foo, bar, spy);

        expect(stop).to.be.a('function');
        expect(spy.callCount).to.equal(1);

        stop();

        foo.set(11);
        bar.set(21);

        expect(spy.callCount).to.equal(1);
    });
});
