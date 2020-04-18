import { expect } from 'chai';
import sinon from 'sinon';
import { reducer } from '../../src/isotope';

describe('reducer', () => {
    it('should return the initial state', () => {
        const initialState = {foo: 'bar'};
        const foo = reducer(initialState);

        expect(foo()).to.equal(initialState);
    });

    it('should reduce state', () => {
        const count = reducer({count: 0}, (state, action) => {
            switch (action.type) {
                case 'increment':
                    return {count: state.count + 1};
                case 'decrement':
                    return {count: state.count - 1};
            }
        });

        expect(count).to.be.a('function');
        expect(count()).to.deep.equal({count: 0});

        expect(count({type: 'increment'})).to.deep.equal({count: 1});
        expect(count()).to.deep.equal({count: 1});

        expect(count({type: 'increment'})).to.deep.equal({count: 2});
        expect(count()).to.deep.equal({count: 2});

        expect(count({type: 'decrement'})).to.deep.equal({count: 1});
        expect(count()).to.deep.equal({count: 1});
    });

    it('should add subscribers to be called immediately and when the value changes', () => {
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

        count({type: 'increment'});

        expect(spy1.callCount).to.equal(2);
        expect(spy1.args[1].length).to.equal(2);
        expect(spy1.args[1][0]).to.deep.equal({count: 1});
        expect(spy1.args[1][1]).to.deep.equal({count: 0});
        expect(spy2.callCount).to.equal(2);
        expect(spy1.args[1].length).to.equal(2);
        expect(spy2.args[1][0]).to.deep.equal({count: 1});
        expect(spy2.args[1][1]).to.deep.equal({count: 0});
        
        count({type: 'increment'});

        expect(spy1.callCount).to.equal(3);
        expect(spy1.args[2][0]).to.deep.equal({count: 2});
        expect(spy1.args[2][1]).to.deep.equal({count: 1});
        expect(spy2.callCount).to.equal(3);
        expect(spy2.args[2][0]).to.deep.equal({count: 2});
        expect(spy2.args[2][1]).to.deep.equal({count: 1});

        count({type: 'decrement'});

        expect(spy1.callCount).to.equal(4);
        expect(spy1.args[3][0]).to.deep.equal({count: 1});
        expect(spy1.args[3][1]).to.deep.equal({count: 2});
        expect(spy2.callCount).to.equal(4);
        expect(spy2.args[3][0]).to.deep.equal({count: 1});
        expect(spy2.args[3][1]).to.deep.equal({count: 2});
    });
});
