import { expect } from 'chai';
import sinon from 'sinon';
import { data, computed, isData } from '../../src/isotope';

describe('computed', () => {
    it('should return a function', () => {
        const foo = computed(() => null);

        expect(foo).to.be.a('function');
    });

    it('should return true for computed callbacks', () => {
        const fn = () => null;
        const foo = computed(fn);

        expect(isData(fn)).to.equal(false);
        expect(isData(foo)).to.equal(true);
    });

    it('should compute a value', () => {
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

    it('should automatically update if depending data changes', () => {
        const firstName = data('John');
        const lastName = data('Doe');
        const fullName = computed(() => `${firstName()} ${lastName()}`);

        expect(fullName()).to.equal('John Doe');

        firstName('Jane');
        expect(fullName()).to.equal('Jane Doe');

        lastName('Jones')
        expect(fullName()).to.equal('Jane Jones');
    });








    it('should subscribe to be notified of data changes', () => {
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

    it('should unsubscribe to be notified of data changes', () => {
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

    it('should not interrupt subscriber invocation sequence ', () => {
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
        lastName('Johnson')

        expect(spy1.callCount).to.equal(4);
        expect(spy2.callCount).to.equal(2);
        expect(spy3.callCount).to.equal(4);
    });
});
