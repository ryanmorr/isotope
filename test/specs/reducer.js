import { expect } from 'chai';
import sinon from 'sinon';
import { reducer } from '../../src/isotope.js';

describe('reducer', () => {
    it('should return the initial state', () => {
        const initialState = {foo: 'bar'};
        const foo = reducer(initialState);

        expect(foo.state()).to.equal(initialState);
    });

    it('should change state', () => {
        const count = reducer({count: 0}, (state, action) => {
            switch (action.type) {
                case 'increment':
                    return {count: state.count + 1};
                case 'decrement':
                    return {count: state.count - 1};
            }
        });

        expect(count.state()).to.deep.equal({count: 0});

        expect(count.dispatch({type: 'increment'})).to.deep.equal({count: 1});
        expect(count.state()).to.deep.equal({count: 1});

        expect(count.dispatch({type: 'increment'})).to.deep.equal({count: 2});
        expect(count.state()).to.deep.equal({count: 2});

        expect(count.dispatch({type: 'decrement'})).to.deep.equal({count: 1});
        expect(count.state()).to.deep.equal({count: 1});
    });

    it('should call a subscriber immediately when added', () => {
        const value = reducer();
        
        const spy = sinon.spy();
        value.subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(undefined);
        expect(spy.args[0][1]).to.equal(undefined);
    });

    it('should call subscribers when the state changes', () => {
        const count = reducer({count: 0}, (state, action) => {
            switch (action.type) {
                case 'increment':
                    return {count: state.count + 1};
                case 'decrement':
                    return {count: state.count - 1};
            }
        });

        const spy1 = sinon.spy();
        const spy2 = sinon.spy();

        count.subscribe(spy1);
        count.subscribe(spy2);

        expect(spy1.callCount).to.equal(1);
        expect(spy1.args[0].length).to.equal(1);
        expect(spy1.args[0][0]).to.deep.equal({count: 0});
        expect(spy2.callCount).to.equal(1);
        expect(spy2.args[0].length).to.equal(1);
        expect(spy2.args[0][0]).to.deep.equal({count: 0});
        expect(spy1.calledBefore(spy2)).to.equal(true);

        count.dispatch({type: 'increment'});

        expect(spy1.callCount).to.equal(2);
        expect(spy1.args[1].length).to.equal(2);
        expect(spy1.args[1][0]).to.deep.equal({count: 1});
        expect(spy1.args[1][1]).to.deep.equal({count: 0});
        expect(spy2.callCount).to.equal(2);
        expect(spy1.args[1].length).to.equal(2);
        expect(spy2.args[1][0]).to.deep.equal({count: 1});
        expect(spy2.args[1][1]).to.deep.equal({count: 0});
        
        count.dispatch({type: 'increment'});

        expect(spy1.callCount).to.equal(3);
        expect(spy1.args[2][0]).to.deep.equal({count: 2});
        expect(spy1.args[2][1]).to.deep.equal({count: 1});
        expect(spy2.callCount).to.equal(3);
        expect(spy2.args[2][0]).to.deep.equal({count: 2});
        expect(spy2.args[2][1]).to.deep.equal({count: 1});

        count.dispatch({type: 'decrement'});

        expect(spy1.callCount).to.equal(4);
        expect(spy1.args[3][0]).to.deep.equal({count: 1});
        expect(spy1.args[3][1]).to.deep.equal({count: 2});
        expect(spy2.callCount).to.equal(4);
        expect(spy2.args[3][0]).to.deep.equal({count: 1});
        expect(spy2.args[3][1]).to.deep.equal({count: 2});
    });
});
